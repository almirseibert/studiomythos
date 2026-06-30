# node:18-slim (Debian) — necessário para instalar Chromium via apt (Puppeteer/whatsapp-web.js)
FROM node:18-slim

# Instala Chromium e dependências para o Puppeteer funcionar sem sandbox
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-noto-color-emoji \
    fonts-freefont-ttf \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Aponta Puppeteer para o Chromium do sistema (evita download duplicado)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Cria o diretório de sessões do WhatsApp (pode ser montado como volume)
RUN mkdir -p /app/whatsapp-sessions

EXPOSE 3000

CMD ["node", "server.js"]
