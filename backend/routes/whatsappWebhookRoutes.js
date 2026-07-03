// ─────────────────────────────────────────────────────────────────────────
// Webhook PÚBLICO do WhatsApp Cloud API (chamado pela Meta, sem JWT).
//
// Montado SEM os middlewares verificarToken/exigirAdmin — a Meta não envia
// nosso token JWT. A autenticidade é garantida por outros dois mecanismos:
//  • GET  /webhook → handshake com WHATSAPP_VERIFY_TOKEN
//  • POST /webhook → assinatura HMAC-SHA256 (x-hub-signature-256) do corpo cru
//
// Requer que o server.js preserve o corpo cru em req.rawBody (via a opção
// `verify` do express.json()), necessário para validar a assinatura.
// ─────────────────────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();
const whatsappService = require('../services/whatsappService');

// Handshake de verificação (a Meta chama uma vez ao configurar o webhook)
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const resposta = whatsappService.verificarHandshake(mode, token, challenge);
  if (resposta !== null) {
    console.log('✅ [WA] Webhook verificado pela Meta');
    return res.status(200).send(resposta); // texto puro, não JSON
  }
  console.warn('⚠️  [WA] Handshake do webhook recusado (verify_token inválido)');
  return res.sendStatus(403);
});

// Recebimento de eventos (mensagens, recibos de status)
router.post('/', (req, res) => {
  const assinatura = req.get('x-hub-signature-256');
  if (!whatsappService.verificarAssinatura(req.rawBody, assinatura)) {
    console.warn('⚠️  [WA] Webhook com assinatura inválida — descartado');
    return res.sendStatus(403);
  }

  // Responde 200 IMEDIATAMENTE — a Meta reentrega se demorar. Processa async.
  res.sendStatus(200);
  whatsappService.handleWebhookEvent(req.body).catch(err =>
    console.error('[WA] Erro no processamento assíncrono do webhook:', err.message)
  );
});

module.exports = router;
