# WhatsApp Bot — Studio Mythos

Bot de atendimento via WhatsApp com IA (Google Gemini), integrado ao CRM. Usa a
**WhatsApp Cloud API oficial da Meta** (Graph API + webhook) — automação autorizada, sem risco
de banimento por Termos de Serviço.

> **Migração (2026-07-02):** a implementação anterior usava `whatsapp-web.js` (biblioteca NÃO-oficial
> que dirigia uma sessão do WhatsApp Web via Puppeteer/QR). Isso viola os ToS e o número foi **banido**
> ("Não use automação não autorizada"). Toda a camada Puppeteer/QR/sessão foi substituída pela Cloud
> API. Ver a seção "Migração whatsapp-web.js → Cloud API" mais abaixo.

## Arquitetura

| Arquivo | Responsabilidade |
|---|---|
| `backend/services/whatsappService.js` | Cloud API: recebe via webhook (`handleWebhookEvent`), envia via Graph API (`enviarTexto`), marca lida + "digitando", agrupa em buffer, divide em bolhas, valida assinatura HMAC |
| `backend/routes/whatsappWebhookRoutes.js` | Webhook PÚBLICO (sem JWT): `GET /webhook` (handshake) e `POST /webhook` (HMAC + processamento async) |
| `backend/services/geminiService.js` | Chamada ao Gemini (function calling), monta o system prompt com contexto do CRM |
| `backend/services/conversaService.js` | CRUD: conversas, mensagens, memórias da IA, agendamentos, vínculo com `clientes` |
| `backend/routes/whatsappRoutes.js` | API REST autenticada (admin): status, listar/enviar conversas, agenda, memórias |
| `frontend/src/pages/WhatsApp.jsx` | Painel: abas Conversas (chat em tempo real), Agenda, Conexão (status do Cloud API) |

## Tabelas no banco (criadas via `backend/config/migrate.js`)

- `whatsapp_conversas` — uma linha por número, com `modo` (`ia_ativa` / `humano_ativo` / `aguardando`) e vínculo opcional a `clientes`
- `whatsapp_mensagens` — histórico completo (remetente: `cliente` / `ia` / `humano`)
- `whatsapp_memoria_ia` — fatos/preferências que a IA registra sobre o contato (function calling `salvar_memoria`)
- `whatsapp_agendamentos` — reuniões marcadas pela IA (function calling `agendar_reuniao`, alteradas/canceladas via `alterar_agendamento`). Formato (presencial/vídeo) e cidade do cliente vão dentro de `descricao`, sem coluna dedicada — sede da Studio Mythos é Lajeado/RS, regra de ~50km pra oferecer presencial está só no system prompt (`geminiService.js`)

## Fluxo de mensagens

1. Contato envia mensagem → a Meta chama `POST /api/whatsapp/webhook` → assinatura HMAC validada → `handleWebhookEvent` → `tratarMensagemRecebida` (só `type === 'text'` por ora)
2. Mensagem é salva no banco imediatamente; se a conversa está em `modo = humano_ativo`, a IA **não responde**
3. Caso contrário, a mensagem entra no buffer de debounce (`enfileirarMensagem`) em vez de ser processada na hora:
   - Espera ~20s (janela randomizada `DEBOUNCE_MIN/MAX_MS`) de silêncio do contato antes de gerar a resposta
   - Se o contato mandar outra mensagem antes disso, o texto é acumulado e o timer **reinicia do zero**
   - Ao fechar a janela, `geminiService.processMessage()` recebe TODAS as mensagens acumuladas juntas (uma por linha) como um único contexto, monta o prompt (dados do CRM + memórias + agenda) e chama o Gemini
   - Antes de responder, `marcarLidaEDigitando()` marca a msg recebida como lida e mostra "digitando…" (via Graph API)
4. Resposta é dividida em até 3 bolhas (`dividirEmBolhas`) e cada uma é enviada por `enviarTexto` (Graph API), com pausa randomizada entre elas; o limitador global (`agendarEnvioGlobal`) espaça envios entre conversas diferentes
5. **Intervenção humana:** com Cloud API o número vive na nuvem — não há "digitar no aparelho". O vendedor responde SÓ pelo painel (`POST /conversas/:id/mensagem` → `whatsappService.sendMessage`), o que salva a msg como `humano`, muda `modo` para `humano_ativo` e cancela buffer pendente
6. Vendedor pode devolver o atendimento à IA pelo painel (`whatsappRoutes.js`)

> **Janela de 24h:** a Cloud API só permite mensagem livre até 24h após a última mensagem do cliente.
> Fora disso, `sendMessage` recebe erro da Graph API e retorna aviso amigável ao painel — reengajar
> exige um **template aprovado** na Meta (ainda não implementado, ver "Fora de escopo").

## Migração whatsapp-web.js → Cloud API (2026-07-02)

**Por quê:** o número foi **banido** rodando `whatsapp-web.js` (automação não-oficial via Puppeteer),
com a Meta apontando "Não use automação não autorizada". Os logs mostraram ainda múltiplas
autenticações simultâneas na mesma sessão (provável redeploy/réplicas no EasyPanel sem parar o
container anterior) — um dos gatilhos de ban mais fortes. Nenhuma mitigação de comportamento resolve
isso enquanto o transporte for a sessão não-oficial; a única solução sem risco é a API oficial.

**O que mudou de fato:**
- **Sem QR, sem sessão, sem Puppeteer/Chromium.** Autenticação por tokens da Meta no `.env`.
- **Receber:** webhook `POST /api/whatsapp/webhook` (antes: evento `message` do Puppeteer).
- **Enviar:** Graph API `POST /{PHONE_NUMBER_ID}/messages` (antes: `client.sendMessage`).
- **"Vendedor digita no celular" DEIXA DE EXISTIR** — o número vive na nuvem da Meta, não há aparelho.
  Toda intervenção humana passa exclusivamente pelo painel (`sendMessage`). Por isso `onMessageCreate`,
  `botSentIds`/`botSendingTo` e a corrida do `message_create` foram removidos (não há mais eco).
- **Ler + digitar:** `marcarLidaEDigitando()` usa `status:read` + `typing_indicator` da Graph API
  (antes: `chat.sendSeen()`/`sendStateTyping()`).
- **Segurança do webhook:** `GET` valida `WHATSAPP_VERIFY_TOKEN`; `POST` valida a assinatura
  HMAC-SHA256 (`x-hub-signature-256`) contra `WHATSAPP_APP_SECRET` sobre o corpo cru (`req.rawBody`,
  capturado no `express.json({ verify })` em `server.js`).

**Preservado da versão anterior (agnóstico ao transporte):** debounce/agrupamento, divisão em bolhas,
limitador global de envio, handover IA↔humano, memórias, agenda, contexto do CRM, fallback quando o
Gemini está indisponível (429/503 → avisa e passa pra humano).

## Configuração necessária (.env / variáveis no EasyPanel)

Lado **Meta** (uma vez): criar App em `developers.facebook.com` + produto WhatsApp → verificação da
empresa → conectar um **número novo** (o banido não serve) → configurar o Webhook apontando para
`https://SEU-BACKEND/api/whatsapp/webhook`, com o mesmo `VERIFY_TOKEN` e assinando o campo `messages`.

```
WHATSAPP_ENABLED=true                 # habilita o bot (webhook + envio); server.js só loga se true
WHATSAPP_ACCESS_TOKEN=<token>         # System User token PERMANENTE (não o temporário de 24h)
WHATSAPP_PHONE_NUMBER_ID=<id>         # Phone Number ID do número conectado
WHATSAPP_APP_SECRET=<secret>          # valida a assinatura HMAC do webhook
WHATSAPP_VERIFY_TOKEN=<string>        # inventada por nós; o MESMO valor vai no painel da Meta
WHATSAPP_API_VERSION=v21.0            # opcional (padrão v21.0)

GEMINI_API_KEY=<chave real>           # geminiService.getClient() lança erro se vazia ou com "inserir_"
GEMINI_MODEL=gemini-2.5-flash-lite    # padrão atual (2026-07); alternativas: gemini-2.5-flash, gemini-2.5-pro
GEMINI_MODEL_FALLBACK=gemini-2.5-flash  # usado se o principal ficar sobrecarregado (503) mesmo após retries
```

> **1 instância só:** mesmo sem risco de ban, rode uma única instância do backend — duas processariam
> o mesmo webhook em duplicidade. Conferir réplicas/redeploy no EasyPanel.

⚠️ **Modelos descontinuados pelo Google** (retornam `404 Not Found`, não usar): `gemini-2.0-flash`,
`gemini-2.0-flash-lite`, `gemini-1.5-flash`. O Google desativa modelos antigos periodicamente — se
o bot voltar a dar erro 404 de "model no longer available", conferir a lista atual em
https://ai.google.dev/gemini-api/docs/models antes de trocar o `GEMINI_MODEL`.

⚠️ Em produção o `.env` é ignorado pelo Docker — as variáveis reais precisam ser definidas como
env vars no EasyPanel, não só neste arquivo local.

Causas mais comuns do bot "não responder automaticamente":
1. `WHATSAPP_ENABLED` não está `true`, ou falta alguma variável `WHATSAPP_*` (o `GET /api/whatsapp/status` retorna `nao_configurado`)
2. `GEMINI_API_KEY` ausente/placeholder — o erro é só logado no console, não trava o servidor
3. **Webhook não configurado/entregando** na Meta: confira o handshake (`GET /webhook` deve devolver o challenge), a assinatura do App (o campo `messages` precisa estar assinado) e se a URL pública aponta pro backend certo. Erro comum: `req.rawBody` vazio → assinatura sempre inválida (o `express.json({ verify })` precisa estar montado ANTES da rota do webhook)
4. Conversa presa em `modo = humano_ativo` (um vendedor respondeu pelo painel antes e ninguém "devolveu à IA")
5. **Cota do Gemini estourada (HTTP 429)** — se o erro mostrar `limit: 0` em todas as métricas (não só "excedeu"), o projeto/chave do Google Cloud por trás da `GEMINI_API_KEY` não tem cota free-tier habilitada. Verificar em https://aistudio.google.com/apikey a qual projeto a chave pertence e o tier de billing; trocar de modelo (ex.: `gemini-2.0-flash` → `gemini-2.0-flash-lite`) só ajuda se a cota zerada for específica daquele modelo — se for cota zerada no projeto inteiro, o problema é de billing/config no Google Cloud (saldo pré-pago em `aistudio.google.com/billing`), não de modelo.
6. **503 "Service Unavailable" / "high demand"** — sobrecarga temporária do lado do Google, não é erro de configuração. `geminiService.js` faz retry automático com backoff (`withRetry`, até 3 tentativas extras) e, se o modelo principal continuar sobrecarregado, tenta automaticamente o `GEMINI_MODEL_FALLBACK` (padrão `gemini-2.5-flash`) antes de desistir e passar pra humano. Se AMBOS os modelos derem 503 seguido, é sobrecarga ampla do Google (não específica de um modelo) — não há mais o que fazer do lado do bot além de esperar.

O tratamento de Gemini indisponível (429/quota/503/sobrecarga) segue igual: em vez de ficar mudo,
`processarBuffer` envia uma mensagem de aviso ao cliente e muda a conversa para `modo = humano_ativo`.

## Docker

- Imagem enxuta `node:18-slim`, **sem Chromium/Puppeteer** (removidos na migração). Não há volume de
  sessão a montar — a autenticação é via tokens no ambiente.
- Em produção o `.env` é ignorado pelo Docker: definir as variáveis `WHATSAPP_*`/`GEMINI_*` como env
  vars no EasyPanel.

## Fora de escopo (follow-up)

- **Templates** para reengajar fora da janela de 24h (exige template aprovado na Meta). Hoje
  `sendMessage` só retorna aviso amigável ao painel nesse caso.
- **Mídia** recebida (imagem/áudio/documento) — por ora só `type: text` é tratado; o resto é logado e ignorado.
