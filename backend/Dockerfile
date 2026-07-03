# Backend Studio Mythos — WhatsApp via Cloud API (Graph API + webhook).
# Não usa mais Puppeteer/Chromium: a integração antiga via whatsapp-web.js foi
# removida após o banimento de 2026-07-02. Imagem enxuta, só Node.
FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
