# WhatsApp Bot — Studio Mythos

Bot de atendimento via WhatsApp com IA (Google Gemini), integrado ao CRM. Usa a biblioteca
[`whatsapp-web.js`](https://github.com/wwebjs/whatsapp-web.js) (não oficial, controla uma sessão
do WhatsApp Web via Puppeteer/Chromium) — ver o repositório para referência de API e eventos.

## Arquitetura

| Arquivo | Responsabilidade |
|---|---|
| `backend/services/whatsappService.js` | Cliente whatsapp-web.js: QR code, eventos de mensagem, envio, detecção humano vs. IA |
| `backend/services/geminiService.js` | Chamada ao Gemini (function calling), monta o system prompt com contexto do CRM |
| `backend/services/conversaService.js` | CRUD: conversas, mensagens, memórias da IA, agendamentos, vínculo com `clientes` |
| `backend/routes/whatsappRoutes.js` | API REST: status, QR, restart, listar/enviar conversas, agenda, memórias |
| `frontend/src/pages/WhatsApp.jsx` | Painel: abas Conversas (chat em tempo real), Agenda, Conexão |

## Tabelas no banco (criadas via `backend/config/migrate.js`)

- `whatsapp_conversas` — uma linha por número, com `modo` (`ia_ativa` / `humano_ativo` / `aguardando`) e vínculo opcional a `clientes`
- `whatsapp_mensagens` — histórico completo (remetente: `cliente` / `ia` / `humano`)
- `whatsapp_memoria_ia` — fatos/preferências que a IA registra sobre o contato (function calling `salvar_memoria`)
- `whatsapp_agendamentos` — reuniões marcadas pela IA (function calling `agendar_reuniao`)

## Fluxo de mensagens

1. Contato envia mensagem → evento `message` (`onIncoming` em `whatsappService.js`)
2. Mensagem é salva no banco; se a conversa está em `modo = humano_ativo`, a IA **não responde**
3. Caso contrário, `geminiService.processMessage()` monta o prompt (dados do CRM + memórias + agenda) e chama o Gemini
4. Resposta é enviada com delay humanizado (`sleep` + "digitando…") e o `id` da mensagem enviada é guardado em `botSentIds`
5. Se um vendedor digita direto no celular → evento `message_create` (`onMessageCreate`) detecta que o `id` **não** está em `botSentIds` → assume que foi humano → muda `modo` para `humano_ativo` e limpa o cache do Gemini daquele número
6. Vendedor pode devolver o atendimento à IA pelo painel (`whatsappRoutes.js`)

## Filtro de grupos e status (stories)

`onIncoming` e `onMessageCreate` ignoram:
- Mensagens de grupo (`@g.us`)
- **Status/stories públicos** (`msg.isStatus` ou JID `status@broadcast`) — sem esse filtro, quando um
  contato posta um status público, o whatsapp-web.js dispara o mesmo evento `message`/`message_create`
  e o bot tratava isso como se fosse uma mensagem direta (bug corrigido em 2026-07-01).

## Configuração necessária (.env / variáveis no EasyPanel)

```
WHATSAPP_ENABLED=true            # sem isso o bot nunca inicializa (server.js só chama initialize() se true)
GEMINI_API_KEY=<chave real>      # geminiService.getClient() lança erro se estiver vazia ou com "inserir_"
GEMINI_MODEL=gemini-2.5-flash-lite  # padrão atual (2026-07); alternativas: gemini-2.5-flash, gemini-2.5-pro
```

⚠️ **Modelos descontinuados pelo Google** (retornam `404 Not Found`, não usar): `gemini-2.0-flash`,
`gemini-2.0-flash-lite`, `gemini-1.5-flash`. O Google desativa modelos antigos periodicamente — se
o bot voltar a dar erro 404 de "model no longer available", conferir a lista atual em
https://ai.google.dev/gemini-api/docs/models antes de trocar o `GEMINI_MODEL`.

⚠️ Em produção o `.env` é ignorado pelo Docker — as variáveis reais precisam ser definidas como
env vars no EasyPanel, não só neste arquivo local.

Causas mais comuns do bot "não responder automaticamente":
1. `WHATSAPP_ENABLED` não está `true` no ambiente onde o backend realmente roda
2. `GEMINI_API_KEY` ausente/placeholder — o erro é só logado no console (`catch` silencioso em `onIncoming`), não trava o servidor
3. Sessão nunca chegou ao status `pronto` (verificar `GET /api/whatsapp/status` e o QR code no painel)
4. Conversa presa em `modo = humano_ativo` (um vendedor mandou mensagem manual antes e ninguém "devolveu à IA" pelo painel)
5. **Cota do Gemini estourada (HTTP 429)** — se o erro mostrar `limit: 0` em todas as métricas (não só "excedeu"), o projeto/chave do Google Cloud por trás da `GEMINI_API_KEY` não tem cota free-tier habilitada. Verificar em https://aistudio.google.com/apikey a qual projeto a chave pertence e o tier de billing; trocar de modelo (ex.: `gemini-2.0-flash` → `gemini-2.0-flash-lite`) só ajuda se a cota zerada for específica daquele modelo — se for cota zerada no projeto inteiro, o problema é de billing/config no Google Cloud (saldo pré-pago em `aistudio.google.com/billing`), não de modelo.
6. **503 "Service Unavailable" / "high demand"** — sobrecarga temporária do lado do Google, não é erro de configuração. `geminiService.js` faz retry automático com backoff (`withRetry`, até 2 tentativas extras) para erros 503/overloaded antes de desistir.

Desde 2026-07-01, `onIncoming` em `whatsappService.js` detecta erro 429/quota/503/sobrecarga e, em vez de ficar mudo, envia uma mensagem de aviso ao cliente e muda a conversa para `modo = humano_ativo`.

## Sessão / Docker

- Autenticação persistida via `LocalAuth` em `./whatsapp-sessions` (volume no EasyPanel — usar
  "Montagem de Volume", não Bind Mount)
- `limparLocksCromium()` remove `SingletonLock`/`SingletonSocket`/`SingletonCookie` deixados por
  crashes anteriores do Chromium, tanto na inicialização quanto no restart
- Imagem Docker: `node:18-slim` com Chromium instalado via apt (`PUPPETEER_EXECUTABLE_PATH`)
