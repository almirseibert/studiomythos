# Guia de Implantação — WhatsApp Bot com Cloud API (oficial da Meta)

> Documento passo a passo: o que foi feito, como configurar a conta na Meta, como implantar no
> sistema (EasyPanel) e quanto você paga. Escrito em 2026-07-03 após a migração do bot.

---

## 1. Resumo — o que foi feito e por quê

### O problema
O bot de WhatsApp rodava sobre a biblioteca **`whatsapp-web.js`** — uma solução **não-oficial** que
automatiza a sessão do WhatsApp Web via um navegador escondido (Puppeteer/Chromium) e um QR Code.
Isso **viola os Termos de Serviço do WhatsApp**. Em 02/07/2026 o número foi **banido** ("Esta conta
não pode usar o WhatsApp — Não use automação não autorizada").

Não existe ajuste de comportamento que resolva isso de forma definitiva: o problema é a **abordagem**
(dirigir uma sessão real por robô), não o texto que a IA gera.

### A solução
Migramos para a **WhatsApp Business Platform / Cloud API** — a API **oficial** da Meta. Aqui a
automação é **autorizada e gerenciada pela própria Meta**, então **não há risco de banimento** por
uso de bot (desde que você respeite as políticas de conteúdo — não fazer spam, etc.).

### O que mudou na prática

| Aspecto | Antes (`whatsapp-web.js`) | Agora (Cloud API) |
|---|---|---|
| Autenticação | QR Code + sessão num "celular virtual" | Tokens da Meta (no servidor) |
| Receber mensagem | Sessão espiando o WhatsApp Web | **Webhook** (a Meta avisa seu servidor) |
| Enviar mensagem | Simular clique/digitação | Chamada de **API oficial** (Graph API) |
| Vendedor no celular | Podia digitar no aparelho | **Não existe mais** — o número vive na nuvem; humano responde **só pelo painel** |
| Risco de ban | **Alto** (viola ToS) | **Nenhum** (uso oficial) |
| Custo | "Grátis" (mas ilegal e instável) | Ver seção 7 — na prática **≈ R$ 0** para o nosso uso |

### O que **continua igual** (não muda para o cliente final)
- A IA (Gemini) responde do mesmo jeito, com o mesmo contexto do CRM, memórias e agenda.
- Agrupamento de mensagens (espera o cliente terminar de digitar antes de responder).
- Resposta dividida em "bolhas", "digitando…", marcar como lida.
- Vendedor assume/devolve conversa pelo painel.

### Mudança importante de comportamento
- **O vendedor não digita mais pelo celular** — o número não fica num aparelho, e sim na nuvem da
  Meta. Toda intervenção humana passa **exclusivamente pelo painel do CRM** (aba WhatsApp).
- **Janela de 24 horas:** você só pode enviar mensagem "livre" (texto normal) para um cliente **até
  24h após a última mensagem que ELE te mandou**. Depois disso, só é possível reengajar com um
  **template pré-aprovado** pela Meta (recurso ainda não implementado — ver seção 8).

---

## 2. Como funciona (visão técnica rápida)

```
Cliente manda msg no WhatsApp
        │
        ▼
  Servidores da Meta  ──(webhook: POST /api/whatsapp/webhook)──►  Nosso backend
        ▲                                                              │
        │                                                              ▼
        │                                                   Valida assinatura (segurança)
        │                                                   Salva no banco (CRM)
        │                                                   Agrupa e envia pro Gemini
        │                                                              │
        └──────(Graph API: envia resposta)◄────── IA gera resposta ◄──┘
```

- **Recebe** mensagens por **webhook**: a Meta faz uma requisição HTTP para o nosso endereço público
  `https://SEU-BACKEND/api/whatsapp/webhook` toda vez que chega mensagem.
- **Envia** respostas chamando a **Graph API** da Meta.
- **Segurança:** o webhook é público (a Meta não usa nosso login), mas cada requisição é validada por
  assinatura criptográfica (HMAC-SHA256 com o `APP_SECRET`) — ninguém consegue forjar mensagens.

Arquivos principais (para referência técnica): `backend/services/whatsappService.js`,
`backend/routes/whatsappWebhookRoutes.js`, `backend/server.js`. Detalhes em `WHATSAPP_BOT.md`.

---

## 3. Pré-requisitos

- [ ] Uma conta no **Facebook/Meta** (pessoal serve para começar; será a administradora).
- [ ] Um **número de telefone novo**, que **NÃO** esteja em uso em nenhum app WhatsApp (nem no
  WhatsApp normal, nem no Business). ⚠️ **O número banido não serve.** Pode ser um chip novo, um
  número virtual, ou um fixo (recebe o código por ligação).
- [ ] Acesso ao **EasyPanel** (onde o backend roda) para configurar variáveis de ambiente.
- [ ] Dados da empresa para a **verificação de negócio** (CNPJ, etc.) — necessária para sair do
  modo de teste e atender qualquer cliente.

---

## 4. Passo a passo na Meta (configuração da conta)

> Os nomes de menu da Meta mudam de tempos em tempos. Se algo estiver com nome diferente, procure
> pelo termo equivalente — a lógica dos passos permanece.

### 4.1. Criar a conta comercial (Meta Business)
1. Acesse **business.facebook.com** e crie um **Portfólio de Negócios** (Business Manager), com o
   nome da empresa (Studio Mythos).
2. Preencha os dados da empresa.

### 4.2. Criar o App de desenvolvedor
1. Acesse **developers.facebook.com** → faça login → **Meus Apps** → **Criar App**.
2. Escolha o tipo de uso **"Empresa" (Business)**.
3. Dê um nome (ex.: "Studio Mythos WhatsApp"), vincule ao Portfólio de Negócios criado.

### 4.3. Adicionar o produto WhatsApp
1. Dentro do App, na lista de produtos, encontre **WhatsApp** → **Configurar**.
2. A Meta cria automaticamente uma **conta de teste** com um **número de teste** (pode mandar para
   até 5 números cadastrados — bom para testar antes de ir ao ar).

### 4.4. Anotar os identificadores
Na tela **WhatsApp → Configuração da API**, anote:
- **Phone Number ID** (ID do número de telefone) → vira `WHATSAPP_PHONE_NUMBER_ID`
- **WhatsApp Business Account ID** (ID da conta — WABA) → útil para suporte/configurações
- **App ID** e **App Secret** (em **Configurações do App → Básico**) → o `App Secret` vira
  `WHATSAPP_APP_SECRET` (clique em "Mostrar")

### 4.5. Conectar o número real (produção)
1. Em **WhatsApp → Configuração da API → "Adicionar número de telefone"** (ou "Gerenciar números").
2. Informe o **número novo** e o nome de exibição da empresa.
3. Verifique por **SMS** ou **ligação** (código de 6 dígitos).
4. Pronto — esse número passa a ser gerenciado pela nuvem da Meta (não instale ele em nenhum
   celular, senão desconecta da API).

### 4.6. Gerar o token de acesso **permanente** (importante!)
O token que aparece na tela inicial é **temporário (expira em 24h)** — serve só para teste. Para
produção, gere um token **permanente** via **System User**:

1. Vá em **business.facebook.com → Configurações do Negócio → Usuários → Usuários do sistema**.
2. **Adicionar** → crie um usuário do sistema (ex.: "bot-whatsapp"), função **Admin**.
3. **Atribuir ativos** → selecione o **App** e a **conta do WhatsApp (WABA)** → dê controle total.
4. Clique em **Gerar novo token** → selecione o App → marque as permissões:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
5. Em "Expiração do token", escolha **"Nunca"**.
6. **Copie e guarde o token** (ele só aparece uma vez) → vira `WHATSAPP_ACCESS_TOKEN`.

### 4.7. Definir o Verify Token (você inventa)
- Escolha uma **senha/string secreta qualquer** (ex.: `mythos-webhook-9f3k2p`). Ela não vem da Meta —
  você define. Vai no servidor como `WHATSAPP_VERIFY_TOKEN` **e** no painel da Meta (passo 4.8), e os
  dois precisam ser **idênticos**.

### 4.8. Configurar o Webhook
> ⚠️ Faça isso **depois** de já ter colocado as variáveis no servidor e reiniciado (seção 5) — a
> Meta testa a URL na hora de salvar, e o servidor precisa estar respondendo.

1. Em **WhatsApp → Configuração → Webhooks** (ou **App → Webhooks**), clique em **Editar/Configurar**.
2. **URL de retorno de chamada (Callback URL):**
   ```
   https://SEU-BACKEND/api/whatsapp/webhook
   ```
   (substitua `SEU-BACKEND` pelo domínio real do backend no EasyPanel — o mesmo domínio que o CRM
   já usa para a API.)
3. **Token de verificação:** cole o **mesmo** valor do `WHATSAPP_VERIFY_TOKEN`.
4. Clique em **Verificar e salvar** → deve dar certo na hora (nosso servidor responde ao handshake).
5. Em **Campos do Webhook (Webhook fields)**, clique em **Gerenciar** e **assine (Subscribe)** o
   campo **`messages`**. Sem isso, nenhuma mensagem chega ao bot.

### 4.9. Verificação do negócio (para sair do modo de teste)
- Enquanto o App está em **modo de desenvolvimento**, o bot só conversa com números que você
  cadastrar manualmente (teste).
- Para atender **qualquer cliente**, faça a **Verificação do Negócio** (Business Verification) em
  **Configurações do Negócio → Central de Segurança**: envie CNPJ, comprovante, etc. Leva de algumas
  horas a alguns dias.
- Depois, coloque o App em **modo Ativo (Live)**.

---

## 5. Passo a passo no sistema (EasyPanel)

### 5.1. Garantir que o código está atualizado
O backend já está com a versão Cloud API no branch `main` (commit `0ddf190`). No EasyPanel, faça o
**Deploy/Rebuild** a partir do `main`. O boot deve subir **sem erro** (não precisa mais de
Chromium/Puppeteer).

### 5.2. Configurar as variáveis de ambiente
No EasyPanel, na aba de **Environment / Variáveis** do serviço do backend, adicione:

```
WHATSAPP_ENABLED=true
WHATSAPP_ACCESS_TOKEN=<token permanente do passo 4.6>
WHATSAPP_PHONE_NUMBER_ID=<Phone Number ID do passo 4.4>
WHATSAPP_APP_SECRET=<App Secret do passo 4.4>
WHATSAPP_VERIFY_TOKEN=<a string que você inventou no passo 4.7>
WHATSAPP_API_VERSION=v21.0

# IA (já devem existir):
GEMINI_API_KEY=<sua chave do Gemini>
GEMINI_MODEL=gemini-2.5-flash-lite
GEMINI_MODEL_FALLBACK=gemini-2.5-flash
```

> ⚠️ Em produção o arquivo `.env` do repositório é **ignorado** — as variáveis reais têm que estar
> aqui, no EasyPanel.

### 5.3. Reiniciar e conferir o log
Reinicie o serviço. No log de boot você deve ver:
```
📲 WhatsApp Cloud API configurado — webhook ativo em /api/whatsapp/webhook
```
Se aparecer o aviso `WHATSAPP_ENABLED=true mas faltam variáveis WHATSAPP_*`, alguma variável está
faltando ou com nome errado.

> ⚠️ **Rode apenas UMA instância** do backend. Duas instâncias processariam o mesmo webhook em
> duplicidade (o cliente receberia respostas repetidas). Confira réplicas/redeploy no EasyPanel.

---

## 6. Validação (testar de ponta a ponta)

1. **Status:** no painel do CRM → aba **WhatsApp → Conexão**, o status deve estar **"Conectado"**
   (`pronto`), mostrando o Phone Number ID. (Ou acesse `GET /api/whatsapp/status`.)
2. **Webhook:** ao salvar na Meta (passo 4.8), o handshake já confirma que está funcionando. No log
   aparece `✅ [WA] Webhook verificado pela Meta`.
3. **Mensagem real:** de um celular, mande uma mensagem para o número do bot.
   - No log: `📩 [WA] <numero>: <texto>`.
   - Após ~20s (agrupamento), a IA responde (em bolhas). A conversa aparece no painel.
4. **Intervenção humana:** no painel, "Assumir" uma conversa e responder — a mensagem sai como
   vendedor e a IA silencia até você "Devolver à IA".

---

## 7. Custos — quanto você paga para a Meta

> ⚠️ **Os preços da Meta mudam periodicamente e variam por país.** Os valores abaixo são uma
> referência (Brasil, 2025/2026) — **confirme sempre no "rate card" oficial** em
> *developers.facebook.com/docs/whatsapp/pricing* e no seu painel de faturamento.

### O modelo de cobrança (resumo)
Desde meados de 2025, a Meta cobra **por mensagem** enviada por você em **templates**, divididos em
categorias. **Mensagens que o cliente inicia e você responde dentro de 24h são de graça.**

| Tipo | O que é | Custo |
|---|---|---|
| **Service / atendimento** | Cliente te manda mensagem e você responde dentro de 24h (o nosso caso!) | **GRÁTIS e ilimitado** |
| **Utility (utilidade)** | Confirmação de pedido, lembrete, recibo — via template, dentro da janela de 24h | **Grátis** dentro da janela; pago fora dela |
| **Marketing** | Promoção, oferta, reengajamento por template | **Pago** (~US$ 0,05–0,07 por msg no Brasil) |
| **Authentication** | Código de verificação / OTP por template | **Pago** (~US$ 0,03 por msg no Brasil) |

### Na prática, para o NOSSO bot
O bot **só responde a quem manda mensagem primeiro**, e sempre dentro da janela de 24h. Isso é
**conversa de atendimento (service)** → **custo ≈ R$ 0**.

Você **só começaria a pagar** se, no futuro, implementarmos o envio **ativo** de **templates**
(ex.: reengajar um cliente que sumiu há mais de 24h, ou disparar uma campanha). Isso ainda **não
existe** no sistema (ver seção 8).

### Resumindo os valores
- **Uso atual (só responder clientes):** **grátis**. Você não paga nada por mensagem.
- **Se adicionar campanhas/reengajamento por template:** aí sim há custo por mensagem, na faixa de
  centavos de dólar cada, dependendo da categoria e do país.
- **Cobrança:** a Meta cobra via um **método de pagamento** que você cadastra em
  *Configurações do Negócio → Pagamentos* (cartão de crédito). Sem template pago, a fatura fica
  zerada.

> 💡 **Recomendação:** cadastre um cartão mesmo assim (evita a conta ficar limitada), configure um
> **limite de gastos** baixo e acompanhe o painel de faturamento no primeiro mês.

---

## 8. O que ainda não foi implementado (follow-up)

- **Templates para reengajar fora da janela de 24h.** Hoje, se um vendedor tentar responder pelo
  painel um cliente que sumiu há mais de 24h, o sistema retorna um aviso ("janela expirada"). Para
  reabrir a conversa seria preciso: (1) criar e submeter um template para aprovação na Meta, e (2)
  implementar o envio desse template no código. Custa por mensagem (ver seção 7).
- **Mídia recebida** (imagem, áudio, documento): por ora o bot só trata **texto**; outros tipos são
  registrados no log e ignorados.

---

## 9. Manutenção e boas práticas

- **Não instale o número em nenhum celular.** Ele vive na nuvem da Meta; instalar no WhatsApp comum
  o desconecta da API.
- **Uma instância só** do backend (evita respostas duplicadas).
- **Token permanente:** se algum dia as mensagens pararem de sair com erro de autenticação, o token
  pode ter sido revogado — gere outro pelo System User (passo 4.6).
- **Políticas de conteúdo:** mesmo sendo oficial, evite spam e mensagens não solicitadas. A conta
  pode ser penalizada por **denúncias de usuários** e má **qualidade** (a Meta mostra um indicador
  de "Qualidade do número" no painel). Como o bot só responde quem procura a empresa, o risco é
  baixo.
- **Qualidade do número:** acompanhe no painel da Meta (verde = ótimo). Se cair, revise conteúdo e
  frequência.

---

## 10. Checklist rápido

**Na Meta:**
- [ ] Portfólio de Negócios criado
- [ ] App criado + produto WhatsApp adicionado
- [ ] Número novo conectado e verificado
- [ ] Token permanente gerado (System User)
- [ ] App Secret e Phone Number ID anotados
- [ ] Verificação do negócio concluída + App em modo Ativo
- [ ] Webhook configurado e campo `messages` assinado
- [ ] Método de pagamento cadastrado (fatura fica zerada no uso atual)

**No sistema (EasyPanel):**
- [ ] Deploy do `main` (commit `0ddf190` ou posterior)
- [ ] Variáveis `WHATSAPP_*` + `GEMINI_*` configuradas
- [ ] `WHATSAPP_ENABLED=true`
- [ ] Reiniciado, log mostra "WhatsApp Cloud API configurado"
- [ ] Uma instância só

**Teste final:**
- [ ] Status "Conectado" no painel
- [ ] Mensagem real recebida e respondida pela IA
- [ ] Intervenção humana pelo painel funcionando
