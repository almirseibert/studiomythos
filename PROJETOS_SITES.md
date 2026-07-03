# Projetos & Sites — publicação pelo painel (sem mexer no código)

Permite ao **administrador** criar cards na Central de Aplicativos e publicar
landing pages / sites (upload de **ZIP** ou **HTML**) direto pelo painel interno,
em vez de editar o código e rebuildar a cada projeto novo.

## Como usar (no painel)

1. Painel interno → **Administração → Projetos & Sites** (ou item "Projetos & Sites" no menu).
2. **Novo projeto** → preencha título, subtítulo, descrição, cores e:
   - **Arquivos (ZIP/HTML)**: suba um `.zip` (site completo, precisa conter `index.html`
     na raiz — se estiver dentro de uma subpasta única, o sistema promove sozinho) ou um `.html` avulso.
   - **Link externo**: só aponta o card para uma URL já existente.
3. Marque **Publicar** e salve. O card aparece na Central de Aplicativos (`/apps`).

O site fica acessível em `<HOST-DO-BACKEND>/sites/<slug>/`.
Ex.: `https://studiomythos-backend.oehpg2.easypanel.host/sites/yoga-serena/`.

## Arquitetura

- **Banco**: tabela `projetos` (criada automaticamente pela migração idempotente em
  `backend/config/migrate.js`).
- **Backend**: `controllers/projetoController.js` + `routes/projetoRoutes.js`.
  - Upload em memória (multer) → grava em `backend/uploads/sites/<slug>/` (ZIP via `adm-zip`).
  - Servido estático (público) em `GET /sites/...` no `server.js`.
  - CRUD admin em `/api/admin/projetos` (token + admin).
  - Lista pública em `GET /api/projetos`.
- **Frontend**: `pages/ProjetosAdmin.jsx` (gestão) e `pages/AppsList.jsx`
  (renderiza os cards dinâmicos). Helper `services/sites.js` monta a URL pública.

## ⚠️ Passos de infra no EasyPanel (fazer 1x)

O frontend e o backend são serviços separados no EasyPanel; o backend está em
`studiomythos-backend.oehpg2.easypanel.host`.

### 1. Persistência (OBRIGATÓRIO — senão os sites somem a cada deploy)
Os arquivos ficam em `uploads/` dentro do container do backend, que é efêmero.
No EasyPanel, no serviço do **backend**, adicione um **Volume/Mount** persistente:

- **Mount Path** (dentro do container): `/app/uploads`
- Um Volume nomeado (ex.: `studiomythos-sites`).

Assim os uploads sobrevivem a redeploys.

### 2. (Opcional) URL bonita `studiomythos.com.br/sites/...`
Por padrão os sites abrem no host do backend (funciona de imediato).
Para servir sob o domínio principal, adicione no proxy do EasyPanel do domínio
`studiomythos.com.br` uma regra encaminhando o caminho `/sites/` para o serviço
do backend (porta 3000). Feito isso, ajuste o link no frontend se quiser usar o
domínio principal (hoje `services/sites.js` deriva do host da API).

## Dependências adicionadas
`backend`: `multer`, `adm-zip`.
