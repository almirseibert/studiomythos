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
- `whatsapp_agendamentos` — reuniões marcadas pela IA (function calling `agendar_reuniao`, alteradas/canceladas via `alterar_agendamento`). Formato (presencial/vídeo) e cidade do cliente vão dentro de `descricao`, sem coluna dedicada — sede da Studio Mythos é Lajeado/RS, regra de ~50km pra oferecer presencial está só no system prompt (`geminiService.js`)

## Fluxo de mensagens

1. Contato envia mensagem → evento `message` (`onIncoming` em `whatsappService.js`)
2. Mensagem é salva no banco imediatamente; se a conversa está em `modo = humano_ativo`, a IA **não responde**
3. Caso contrário, a mensagem entra no buffer de debounce (`enfileirarMensagem`) em vez de ser processada na hora:
   - Espera `DEBOUNCE_MS` (20s) de silêncio do contato antes de gerar a resposta
   - Se o contato mandar outra mensagem antes disso, o texto é acumulado e o timer de 20s **reinicia do zero**
   - Ao fechar a janela, `geminiService.processMessage()` recebe TODAS as mensagens acumuladas juntas (uma por linha) como um único contexto, monta o prompt (dados do CRM + memórias + agenda) e chama o Gemini
   - Antes de enviar, mostra "digitando…" por `TYPING_MS` (3s)
4. Resposta é enviada (`enviarResposta`) e o `id` da mensagem enviada é guardado em `botSentIds`
5. Se um vendedor digita direto no celular → evento `message_create` (`onMessageCreate`) detecta que o `id` **não** está em `botSentIds` → assume que foi humano → muda `modo` para `humano_ativo`, cancela qualquer buffer pendente daquele número e limpa o cache do Gemini
6. Vendedor pode devolver o atendimento à IA pelo painel (`whatsappRoutes.js`)

## ⚠️ Risco de bloqueio/restrição pelo WhatsApp

O `whatsapp-web.js` é **não-oficial**: automatiza a sessão real do WhatsApp Web via Puppeteer, fora
dos termos de uso do WhatsApp. O WhatsApp tem detecção de automação por comportamento (ML) que pode
restringir a conta (temporário) ou banir (recorrente), independente do que gera o texto por trás —
não é algo específico do Gemini. Sinais que aumentam o risco: alto volume de mensagens em pouco
tempo, iniciar conversas com quem nunca falou com você antes (cold outreach), respostas muito
rápidas/uniformes, reconexões frequentes, denúncias de destinatários.

Mitigações já implementadas em `whatsappService.js` (2026-07-01/02, após um bloqueio real de 24h):
- Bot **nunca inicia conversa** — só responde quem mandou mensagem primeiro (confirmado: não existe
  disparo em massa nem contato frio em nenhum lugar do código)
- **Limitador global de envio** (`agendarEnvioGlobal`): espaça respostas entre CONVERSAS DIFERENTES
  (2-5s), evitando rajada de várias mensagens saindo ao mesmo tempo quando vários buffers de debounce
  fecham juntos
- **Cooldown de restart** (`RESTART_COOLDOWN_MS`, 30s): impede reconexões em sequência rápida, mesmo
  clicando o botão "Reiniciar" do painel várias vezes — reconexão frequente (login/logout) é sinal de
  automação
- **Whitelist de chat 1:1** (`onIncoming`/`onMessageCreate`): responde só a `@c.us`/`@lid`. Antes só
  excluía grupos (`@g.us`) e status — listas de transmissão (`@broadcast`) e canais/newsletters
  (`@newsletter`) não eram filtrados, e o bot poderia responder automaticamente nesses contextos
- **Bug corrigido em `onMessageCreate`**: o filtro de grupo checava `msg.from.endsWith('@g.us')`, mas
  em mensagem enviada (`fromMe`) `from` é sempre o próprio número — o destino real está em `msg.to`.
  Na prática o filtro nunca funcionava; mensagens de grupo enviadas do celular criavam conversas
  fantasma no banco com o JID do grupo como se fosse telefone
- **Timing randomizado**: janela de debounce (18-23s) e "digitando..." (2.5-4.5s) deixaram de ser
  valores fixos — um delay idêntico em toda resposta é, por si só, uma assinatura de bot
- **`chat.sendSeen()` antes de responder**: marca a mensagem como lida antes de digitar, seguindo a
  sequência humana (ler → digitar → enviar) em vez da resposta aparecer do nada após o silêncio
- **Limpeza de buffers em `disconnected`**: evita que buffers pendentes tentem enviar contra um
  client nulo depois de uma queda de sessão
- **Resposta dividida em bolhas** (`dividirEmBolhas`, 2026-07-02): a IA já é instruída a responder em
  no máximo 3 parágrafos; em vez de mandar tudo como um bloco único de texto, cada parágrafo agora
  vira uma mensagem separada, com seu próprio "digitando..." antes — mais parecido com alguém
  digitando no celular. Limitado a 3 bolhas por resposta (parágrafos extras são agrupados na última)
  pra não fragmentar demais uma lista longa

Fatores de risco que **não têm mitigação de código** (nível de infraestrutura, fora do repo):
- IP do servidor: contas conectadas a partir de IP de datacenter (comum em hospedagem como
  EasyPanel/AWS/DigitalOcean) tendem a ser vistas como mais suspeitas que IP residencial/móvel
- Redeploy sem parar o container anterior primeiro pode deixar duas instâncias autenticadas na
  mesma sessão do WhatsApp ao mesmo tempo — conferir isso no EasyPanel antes de cada deploy

Deliberadamente **não implementado**: técnicas de disfarce de fingerprint do Puppeteer (ex.:
plugins "stealth" pra esconder `navigator.webdriver`/sinais de automação do navegador). Isso seria
burlar ativamente o sistema anti-abuso do WhatsApp, não só reduzir comportamento de bot — diferente
das mitigações acima, que só fazem o bot se comportar de forma mais parecida com um humano de
verdade. Se o bloqueio voltar a acontecer mesmo com essas mitigações, a via seria migrar de vez pro
Cloud API, não insistir em mascarar a automação.

Nenhuma mitigação elimina o risco por completo enquanto o bot rodar sobre `whatsapp-web.js` — é uma
limitação estrutural da abordagem. A solução sem risco de bloqueio é migrar pra WhatsApp Business
Platform (Cloud API, oficial da Meta), que exige verificação de empresa e reescrita do
`whatsappService.js` (webhooks + Graph API em vez de eventos Puppeteer).

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
GEMINI_MODEL_FALLBACK=gemini-2.5-flash  # usado automaticamente se o modelo principal ficar sobrecarregado (503) mesmo após os retries
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
6. **503 "Service Unavailable" / "high demand"** — sobrecarga temporária do lado do Google, não é erro de configuração. `geminiService.js` faz retry automático com backoff (`withRetry`, até 3 tentativas extras) e, se o modelo principal continuar sobrecarregado, tenta automaticamente o `GEMINI_MODEL_FALLBACK` (padrão `gemini-2.5-flash`) antes de desistir e passar pra humano. Se AMBOS os modelos derem 503 seguido, é sobrecarga ampla do Google (não específica de um modelo) — não há mais o que fazer do lado do bot além de esperar.

Desde 2026-07-01, `onIncoming` em `whatsappService.js` detecta erro 429/quota/503/sobrecarga e, em vez de ficar mudo, envia uma mensagem de aviso ao cliente e muda a conversa para `modo = humano_ativo`.

## Sessão / Docker

- Autenticação persistida via `LocalAuth` em `./whatsapp-sessions` (volume no EasyPanel — usar
  "Montagem de Volume", não Bind Mount)
- `limparLocksCromium()` remove `SingletonLock`/`SingletonSocket`/`SingletonCookie` deixados por
  crashes anteriores do Chromium, tanto na inicialização quanto no restart
- Imagem Docker: `node:18-slim` com Chromium instalado via apt (`PUPPETEER_EXECUTABLE_PATH`)
