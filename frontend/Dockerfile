# ==========================================
# Estágio 1: Build (Compilação do React/Vite)
# ==========================================
FROM node:18-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o código do frontend para o container
COPY . .

# Roda o comando de build (gera a pasta /dist com HTML/CSS/JS otimizados)
RUN npm run build

# ==========================================
# Estágio 2: Servidor Web (Nginx)
# ==========================================
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Template processado pelo entrypoint do nginx (envsubst) no boot do container,
# virando /etc/nginx/conf.d/default.conf.
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Backend interno para onde /sites/ é encaminhado. No EasyPanel o host é
# <projeto>_<servico> e a porta é a que o Express escuta (PORT no backend).
# Dá para sobrescrever os dois como env var do serviço, sem rebuild.
ENV BACKEND_HOST=studiomythos_backend \
    BACKEND_PORT=3000 \
    NGINX_ENVSUBST_FILTER=^BACKEND_

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
