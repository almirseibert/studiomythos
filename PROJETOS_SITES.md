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

O site fica acessível em `https://studiomythos.com.br/sites/<slug>/`
(o nginx do frontend encaminha `/sites/` para o backend — ver infra abaixo).

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

### 2. URL sob o domínio principal `studiomythos.com.br/sites/...`
Isto já vem configurado no código: o `frontend/nginx.conf` encaminha `location /sites/`
para o serviço interno `studiomythos_backend:3000`. Como os 3 serviços (frontend,
backend, mysql) estão no MESMO projeto EasyPanel, eles se enxergam pelo nome interno
`studiomythos_backend` — **não é preciso configurar nada na UI do EasyPanel** (a sua
versão não tem roteamento por path, e não precisa).

Basta **reimplantar o frontend** depois do deploy para o novo `nginx.conf` valer.
Se algum dia o serviço de backend for renomeado, ajuste o `proxy_pass` no nginx.conf.

> Em desenvolvimento, o `vite.config.js` faz o mesmo papel via `server.proxy`
> (`/sites` → `http://localhost:3001`).

## Dependências adicionadas
`backend`: `multer`, `adm-zip`.
