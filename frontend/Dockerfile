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

# DESCOMENTE ESTA LINHA e adicione-a ao seu Dockerfile:
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
