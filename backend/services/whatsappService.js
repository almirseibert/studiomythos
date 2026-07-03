// ─────────────────────────────────────────────────────────────────────────
// WhatsApp Bot — WhatsApp Cloud API (oficial da Meta / Graph API)
//
// Substitui a antiga integração via whatsapp-web.js (Puppeteer/QR), que era
// automação NÃO-oficial e levou ao banimento do número em 2026-07-02.
// Agora: recebe mensagens por WEBHOOK e envia pela GRAPH API — automação
// autorizada e gerenciada pela própria Meta, sem risco de ban por ToS.
//
// Não há mais sessão, QR Code, nem "vendedor digitando no aparelho": o número
// vive na nuvem. Toda intervenção humana passa exclusivamente pelo painel.
// ─────────────────────────────────────────────────────────────────────────

const crypto = require('crypto');
const geminiService = require('./geminiService');
const conversaService = require('./conversaService');

// ─── Config (via .env) ──────────────────────────────────────────────────────

const API_VERSION     = process.env.WHATSAPP_API_VERSION || 'v21.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
const ACCESS_TOKEN    = process.env.WHATSAPP_ACCESS_TOKEN || '';
const APP_SECRET      = process.env.WHATSAPP_APP_SECRET || '';
const VERIFY_TOKEN    = process.env.WHATSAPP_VERIFY_TOKEN || '';

const GRAPH_BASE = `https://graph.facebook.com/${API_VERSION}`;

function estaConfigurado() {
  return !!(PHONE_NUMBER_ID && ACCESS_TOKEN && APP_SECRET && VERIFY_TOKEN);
}

// ─── Estado público (compatível com o painel) ───────────────────────────────
// Sem sessão/QR: o "status" agora reflete apenas se as credenciais do Cloud API
// estão presentes. 'pronto' = configurado e apto a enviar/receber via webhook.

function getStatus() {
  const configurado = estaConfigurado();
  return {
    status: configurado ? 'pronto' : 'nao_configurado',
    ready: configurado,
    transporte: 'cloud_api',
    phoneNumberId: PHONE_NUMBER_ID || null,
    apiVersion: API_VERSION,
    // Campos legados mantidos p/ o painel não quebrar enquanto o front é atualizado
    qrAvailable: false,
    qrTimestamp: null,
  };
}

// ─── Normalização de telefone ────────────────────────────────────────────────
// Chave interna do banco continua sendo `<digits>@c.us` (não migramos dados).
// A Graph API usa o número puro (só dígitos) no campo `to`.

function paraChaveInterna(numero) {
  const digits = String(numero || '').replace(/\D/g, '');
  return digits ? `${digits}@c.us` : String(numero || '');
}

function paraNumeroGraph(phone) {
  return String(phone || '').replace(/\D/g, '');
}

// ─── Chamadas à Graph API ────────────────────────────────────────────────────

async function graphPost(payload) {
  if (!estaConfigurado()) throw new Error('WhatsApp Cloud API não configurado (faltam variáveis WHATSAPP_*)');
  const res = await fetch(`${GRAPH_BASE}/${PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data?.error || {};
    const e = new Error(err.message || `Graph API erro HTTP ${res.status}`);
    e.graphCode = err.code;            // ex.: 131047 = fora da janela de 24h
    e.graphSubcode = err.error_subcode;
    e.httpStatus = res.status;
    throw e;
  }
  return data;
}

// Envia uma mensagem de texto. Retorna o ID da mensagem (wamid) atribuído pela Meta.
async function enviarTexto(phone, text) {
  const data = await agendarEnvioGlobal(() => graphPost({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: paraNumeroGraph(phone),
    type: 'text',
    text: { preview_url: false, body: text },
  }));
  return data?.messages?.[0]?.id || null;
}

// Marca a mensagem recebida como lida E mostra o indicador "digitando..." —
// mesma sequência humana (ler → digitar → enviar) que a Meta usa oficialmente.
// O indicador some sozinho ao enviarmos a resposta (ou após ~25s).
async function marcarLidaEDigitando(incomingMessageId) {
  if (!incomingMessageId) return;
  try {
    await graphPost({
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: incomingMessageId,
      typing_indicator: { type: 'text' },
    });
  } catch (err) {
    console.warn('[WA] Não foi possível marcar como lida/digitando:', err.message);
  }
}

// ─── Limitador global de envio ─────────────────────────────────────────────
// Espaça as respostas automáticas entre CONVERSAS DIFERENTES para não disparar
// várias mensagens no mesmo instante quando vários buffers de debounce fecham
// juntos. Boa prática mesmo na Cloud API (evita picos e parece mais natural).

const INTERVALO_MIN_MS = 2000;
const INTERVALO_MAX_MS = 5000;
let filaEnvioGlobal = Promise.resolve();
let ultimoEnvioGlobal = 0;

function agendarEnvioGlobal(fn) {
  const tarefa = filaEnvioGlobal.then(async () => {
    const espera = INTERVALO_MIN_MS + Math.random() * (INTERVALO_MAX_MS - INTERVALO_MIN_MS);
    const decorrido = Date.now() - ultimoEnvioGlobal;
    if (decorrido < espera) await sleep(espera - decorrido);
    ultimoEnvioGlobal = Date.now();
    return fn();
  });
  filaEnvioGlobal = tarefa.then(() => {}, () => {}); // a fila segue mesmo se uma tarefa falhar
  return tarefa;
}

// ─── Divisão da resposta em "bolhas", como um humano digitaria ────────────────

const MAX_BOLHAS = 3;

function dividirEmBolhas(text) {
  const partes = String(text || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  if (partes.length === 0) return [String(text || '').trim()];
  if (partes.length <= MAX_BOLHAS) return partes;
  return [...partes.slice(0, MAX_BOLHAS - 1), partes.slice(MAX_BOLHAS - 1).join('\n\n')];
}

// ─── Agrupamento (debounce) de mensagens rápidas do cliente ───────────────────
// Cada mensagem nova reinicia a janela; só após ~20s de silêncio a IA processa
// TODAS as mensagens acumuladas como um único contexto. Janelas randomizadas.

const DEBOUNCE_MIN_MS = 18000;
const DEBOUNCE_MAX_MS = 23000;
const TYPING_MIN_MS = 2500;
const TYPING_MAX_MS = 4500;
const bufferPorTelefone = new Map(); // phone(@c.us) → { textos, timer, ultimoMsgId }

function tempoAleatorio(min, max) {
  return min + Math.random() * (max - min);
}

function enfileirarMensagem(phone, text, incomingMessageId) {
  let buffer = bufferPorTelefone.get(phone);
  if (!buffer) {
    buffer = { textos: [], timer: null, ultimoMsgId: null };
    bufferPorTelefone.set(phone, buffer);
  }
  buffer.textos.push(text);
  buffer.ultimoMsgId = incomingMessageId;

  if (buffer.timer) clearTimeout(buffer.timer);
  buffer.timer = setTimeout(() => {
    processarBuffer(phone).catch(err => console.error('[WA] Erro ao processar buffer:', err.message));
  }, tempoAleatorio(DEBOUNCE_MIN_MS, DEBOUNCE_MAX_MS));
}

function cancelarBuffer(phone) {
  const buffer = bufferPorTelefone.get(phone);
  if (!buffer) return;
  if (buffer.timer) clearTimeout(buffer.timer);
  bufferPorTelefone.delete(phone);
}

async function processarBuffer(phone) {
  const buffer = bufferPorTelefone.get(phone);
  if (!buffer || buffer.textos.length === 0) return;
  bufferPorTelefone.delete(phone); // libera o slot; msg nova durante o processamento cria buffer próprio

  const mensagemCombinada = buffer.textos.join('\n');

  try {
    // Um humano pode ter assumido a conversa enquanto a IA esperava a janela de silêncio
    const conversa = await conversaService.obterOuCriarConversa(phone);
    if (conversa.modo === 'humano_ativo') {
      console.log(`👤 [WA] ${phone} em atendimento humano — IA não responde ao buffer acumulado`);
      return;
    }

    const resultado = await geminiService.processMessage(phone, mensagemCombinada);
    if (!resultado) return;

    // Marca como lida + mostra "digitando..." antes de responder (sequência humana)
    await marcarLidaEDigitando(buffer.ultimoMsgId);

    // Envia cada bolha com sua própria pausa, em vez de um bloco único de texto
    for (const bolha of dividirEmBolhas(resultado.text).filter(Boolean)) {
      await sleep(tempoAleatorio(TYPING_MIN_MS, TYPING_MAX_MS));
      const msgId = await enviarTexto(phone, bolha);
      await conversaService.salvarMensagem(phone, 'enviada', 'ia', bolha, msgId);
    }

    if (resultado.handover) {
      console.log(`🔔 [WA] Handover para humano — ${phone}`);
    }
  } catch (err) {
    console.error('[WA] Erro ao processar mensagem:', err.message);

    // Gemini indisponível (429 cota, 503 sobrecarga etc.) — avisa e passa pra humano
    if (/429|quota exceeded|503|service unavailable|high demand/i.test(err.message || '')) {
      try {
        const fallback = 'No momento estou com instabilidade e não consigo responder automaticamente 🙏 Já registrei sua mensagem e um de nossos consultores vai te responder em breve.';
        const msgId = await enviarTexto(phone, fallback);
        await conversaService.salvarMensagem(phone, 'enviada', 'ia', fallback, msgId);
        await conversaService.atualizarModo(phone, 'humano_ativo');
        console.warn(`⚠️  [WA] Gemini indisponível — ${phone} passado para atendimento humano`);
      } catch (fallbackErr) {
        console.error('[WA] Falha ao enviar fallback de indisponibilidade:', fallbackErr.message);
      }
    }
  }
}

// ─── Webhook: verificação do handshake (GET) ──────────────────────────────────
// A Meta chama GET /webhook?hub.mode=subscribe&hub.verify_token=...&hub.challenge=...
// Devolvemos o challenge em texto puro se o token bater. Retorna o challenge ou null.

function verificarHandshake(mode, token, challenge) {
  if (mode === 'subscribe' && token && token === VERIFY_TOKEN) return challenge;
  return null;
}

// ─── Webhook: verificação da assinatura HMAC (POST) ───────────────────────────
// A Meta assina o corpo cru com o APP_SECRET (header x-hub-signature-256).

function verificarAssinatura(rawBody, signatureHeader) {
  if (!APP_SECRET) return false;
  if (!rawBody || !signatureHeader) return false;
  const esperado = 'sha256=' + crypto.createHmac('sha256', APP_SECRET).update(rawBody).digest('hex');
  const a = Buffer.from(esperado);
  const b = Buffer.from(String(signatureHeader));
  if (a.length !== b.length) return false;
  try { return crypto.timingSafeEqual(a, b); } catch (_) { return false; }
}

// ─── Webhook: processamento do evento (POST) ──────────────────────────────────
// Estrutura: entry[].changes[].value.messages[] (mensagens recebidas)
//            entry[].changes[].value.statuses[] (recibos de entrega/leitura — ignorados)

async function handleWebhookEvent(body) {
  try {
    const entries = body?.entry || [];
    for (const entry of entries) {
      for (const change of entry.changes || []) {
        const value = change.value || {};
        const mensagens = value.messages || [];
        for (const msg of mensagens) {
          await tratarMensagemRecebida(msg);
        }
      }
    }
  } catch (err) {
    console.error('[WA] Erro ao tratar evento do webhook:', err.message);
  }
}

async function tratarMensagemRecebida(msg) {
  // Só texto por ora; mídia/localização/etc. são logados e ignorados
  if (msg.type !== 'text') {
    console.log(`ℹ️  [WA] Mensagem tipo "${msg.type}" ignorada (só texto é tratado por ora) de ${msg.from}`);
    return;
  }

  const phone = paraChaveInterna(msg.from);
  const text = (msg.text?.body || '').trim();
  if (!text) return;

  console.log(`📩 [WA] ${phone}: ${text.substring(0, 80)}`);

  try {
    // Persiste imediatamente (histórico correto mesmo se o buffer nunca fechar)
    await conversaService.salvarMensagem(phone, 'recebida', 'cliente', text, msg.id);

    const conversa = await conversaService.obterOuCriarConversa(phone);
    if (conversa.modo === 'humano_ativo') {
      console.log(`👤 [WA] ${phone} em atendimento humano — IA silenciada`);
      return;
    }

    enfileirarMensagem(phone, text, msg.id);
  } catch (err) {
    console.error('[WA] Erro ao registrar mensagem recebida:', err.message);
  }
}

// ─── Envio via painel (vendedor humano) ───────────────────────────────────────
// Só é possível dentro da janela de 24h após a última mensagem do cliente.
// Fora dela, a Graph API rejeita e exigimos template aprovado (follow-up futuro).

async function sendMessage(phone, text, vendedorId = null) {
  if (!estaConfigurado()) throw new Error('WhatsApp Cloud API não está configurado');
  const chave = paraChaveInterna(phone);

  let msgId;
  try {
    msgId = await enviarTexto(chave, text);
  } catch (err) {
    // 131047 / 131026 e afins = fora da janela de atendimento de 24h
    if (err.graphCode === 131047 || /24|window|re-?engage|template/i.test(err.message || '')) {
      throw new Error('Janela de 24h expirada: o cliente não envia mensagem há mais de 24h. Só é possível reengajar com um template aprovado na Meta.');
    }
    throw err;
  }

  await conversaService.salvarMensagem(chave, 'enviada', 'humano', text, msgId);
  if (vendedorId) await conversaService.atualizarModo(chave, 'humano_ativo', vendedorId);
  cancelarBuffer(chave); // humano assumiu — cancela resposta da IA pendente na janela de debounce

  return { id: { id: msgId } }; // formato compatível com o retorno legado usado nas rotas
}

// ─── Utilitário ───────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

module.exports = {
  getStatus,
  sendMessage,
  // Webhook
  verificarHandshake,
  verificarAssinatura,
  handleWebhookEvent,
  estaConfigurado,
};
