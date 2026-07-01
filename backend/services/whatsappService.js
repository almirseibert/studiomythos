const { Client, LocalAuth } = require('whatsapp-web.js');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const geminiService = require('./geminiService');
const conversaService = require('./conversaService');

let client = null;
let qrData = null;
let qrTimestamp = null;
let botStatus = 'desconectado';
let isInitializing = false;

// IDs de mensagens enviadas pelo bot (para distinguir de mensagens enviadas por humanos no dispositivo)
const botSentIds = new Set();
const MAX_BOT_IDS = 2000;
// Telefones para os quais o bot está enviando mensagem NESTE INSTANTE — cobre a corrida em que
// o evento 'message_create' dispara ANTES da Promise de msg.reply() resolver (e do ID entrar em botSentIds)
const botSendingTo = new Set();

// ─── Estado público ────────────────────────────────────────────────────────

function getStatus() {
  return { status: botStatus, ready: botStatus === 'pronto', qrAvailable: !!qrData, qrTimestamp };
}

async function getQRImage() {
  if (!qrData) return null;
  return QRCode.toDataURL(qrData);
}

// ─── Remove locks do Chromium deixados por crashes anteriores ─────────────

function limparLocksCromium() {
  const sessionDir = path.resolve('./whatsapp-sessions');
  const lockFiles = ['SingletonLock', 'SingletonSocket', 'SingletonCookie'];
  let removidos = 0;
  try {
    const percorrer = (dir) => {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) { percorrer(fullPath); continue; }
        if (lockFiles.includes(entry.name)) {
          try { fs.unlinkSync(fullPath); removidos++; } catch (_) {}
        }
      }
    };
    percorrer(sessionDir);
    if (removidos > 0) console.log(`🧹 [WA] ${removidos} lock(s) do Chromium removido(s)`);
  } catch (_) {}
}

// ─── Inicialização ─────────────────────────────────────────────────────────

async function initialize() {
  if (isInitializing || botStatus === 'pronto') return;
  isInitializing = true;
  botStatus = 'inicializando';
  console.log('\n📱 Iniciando WhatsApp Bot Studio Mythos...');

  try {
    limparLocksCromium(); // remove SingletonLock de crashes anteriores

    const puppeteerOpts = {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
             '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote', '--disable-gpu'],
    };
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      puppeteerOpts.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    }

    client = new Client({
      authStrategy: new LocalAuth({ dataPath: './whatsapp-sessions' }),
      puppeteer: puppeteerOpts,
    });

    client.on('qr', (qr) => {
      qrData = qr; qrTimestamp = new Date();
      botStatus = 'aguardando_qr'; isInitializing = false;
      console.log('📱 QR Code gerado — acesse o painel WhatsApp para escanear');
      try { require('qrcode-terminal').generate(qr, { small: true }); } catch (_) {}
    });

    client.on('authenticated', () => {
      console.log('✅ WhatsApp: autenticado!');
      qrData = null; botStatus = 'autenticado';
    });

    client.on('auth_failure', (msg) => {
      console.error('❌ WhatsApp: falha na autenticação —', msg);
      botStatus = 'erro_auth'; isInitializing = false;
    });

    client.on('ready', () => {
      console.log('✅ WhatsApp Bot Mythos: pronto para atender!\n');
      botStatus = 'pronto';
    });

    client.on('disconnected', (reason) => {
      console.warn('⚠️  WhatsApp: desconectado —', reason);
      botStatus = 'desconectado'; isInitializing = false; client = null;
    });

    // Mensagens recebidas de outros contatos
    client.on('message', onIncoming);

    // Detecta mensagens enviadas pelo humano diretamente no dispositivo WhatsApp
    client.on('message_create', onMessageCreate);

    await client.initialize();
  } catch (err) {
    console.error('❌ Erro ao inicializar WhatsApp:', err.message);
    botStatus = 'erro'; isInitializing = false; client = null;
  }
}

// ─── Normaliza o phone ID para @c.us (versões novas usam @lid) ───────────

async function resolvePhone(msgFrom, getContactFn) {
  if (msgFrom.endsWith('@c.us') || msgFrom.endsWith('@g.us')) return msgFrom;
  try {
    const contact = await getContactFn();
    if (contact?.id?.user) return `${contact.id.user}@c.us`;
  } catch (_) {}
  // Fallback: extrai dígitos e monta @c.us
  const digits = msgFrom.replace(/\D/g, '');
  return digits ? `${digits}@c.us` : msgFrom;
}

// ─── Envia resposta como bot, protegendo contra a corrida do message_create ─

async function enviarResposta(msg, phone, text) {
  botSendingTo.add(phone);
  try {
    const sentMsg = await msg.reply(text);
    botSentIds.add(sentMsg.id.id);
    if (botSentIds.size > MAX_BOT_IDS) {
      const [first] = botSentIds; botSentIds.delete(first);
    }
    return sentMsg;
  } finally {
    botSendingTo.delete(phone);
  }
}

// ─── Mensagem RECEBIDA (de contato externo) ────────────────────────────────

async function onIncoming(msg) {
  if (msg.fromMe) return;
  if (msg.isStatus || msg.from === 'status@broadcast') return; // ignora status/stories públicos de contatos
  if (msg.from.endsWith('@g.us')) return; // ignora grupos

  // whatsapp-web.js >= 1.26 pode retornar @lid em vez de @c.us
  const phone = await resolvePhone(msg.from, () => msg.getContact());
  const text = (msg.body || '').trim();
  if (!text) return;

  console.log(`📩 [WA] ${phone}: ${text.substring(0, 80)}`);

  try {
    // Persiste a mensagem do cliente
    await conversaService.salvarMensagem(phone, 'recebida', 'cliente', text, msg.id.id);

    // Verifica se está em modo humano
    const conversa = await conversaService.obterOuCriarConversa(phone);
    if (conversa.modo === 'humano_ativo') {
      console.log(`👤 [WA] ${phone} em atendimento humano — IA silenciada`);
      return;
    }

    // Processa com IA Gemini
    const resultado = await geminiService.processMessage(phone, text);
    if (!resultado) return;

    // Delay humanizado: pausa + "digitando..."
    await sleep(1200 + Math.random() * 1500);
    const chat = await msg.getChat();
    await chat.sendStateTyping();
    await sleep(Math.min(resultado.text.length * 18, 4500));

    // Envia resposta
    const sentMsg = await enviarResposta(msg, phone, resultado.text);

    await conversaService.salvarMensagem(phone, 'enviada', 'ia', resultado.text, sentMsg.id.id);

    if (resultado.handover) {
      console.log(`🔔 [WA] Handover para humano — ${phone}`);
    }
  } catch (err) {
    console.error('[WA] Erro ao processar mensagem:', err.message);

    // Gemini indisponível (429 cota, 503 sobrecarga etc.) — avisa o cliente e passa pra humano em vez de ficar mudo
    if (/429|quota exceeded|503|service unavailable|high demand/i.test(err.message || '')) {
      try {
        const fallback = 'No momento estou com instabilidade e não consigo responder automaticamente 🙏 Já registrei sua mensagem e um de nossos consultores vai te responder em breve.';
        const sentMsg = await enviarResposta(msg, phone, fallback);
        await conversaService.salvarMensagem(phone, 'enviada', 'ia', fallback, sentMsg.id.id);
        await conversaService.atualizarModo(phone, 'humano_ativo');
        console.warn(`⚠️  [WA] Gemini indisponível — ${phone} passado para atendimento humano`);
      } catch (fallbackErr) {
        console.error('[WA] Falha ao enviar fallback de indisponibilidade:', fallbackErr.message);
      }
    }
  }
}

// ─── Detecta mensagem enviada pelo HUMANO no dispositivo WhatsApp ──────────

async function onMessageCreate(msg) {
  if (!msg.fromMe) return;
  if (msg.isStatus || msg.to === 'status@broadcast') return; // ignora postagem de status próprio
  if (msg.from.endsWith('@g.us')) return;

  // Se o ID está no set, foi enviado pelo bot — ignorar
  if (botSentIds.has(msg.id.id)) return;

  const phone = await resolvePhone(msg.to, () => client.getContactById(msg.to));

  // Corrida: 'message_create' pode disparar antes da Promise de enviarResposta() resolver
  // (e portanto antes do ID cair em botSentIds) — se o bot está enviando pra este telefone
  // agora, é a própria mensagem do bot, não um humano digitando.
  if (botSendingTo.has(phone)) return;

  // Foi digitado por um humano no dispositivo — assume o atendimento
  const text = (msg.body || '').trim();
  if (!text) return;

  console.log(`👤 [WA] Humano enviou mensagem para ${phone}: ${text.substring(0, 60)}`);

  try {
    await conversaService.salvarMensagem(phone, 'enviada', 'humano', text, msg.id.id);
    await conversaService.atualizarModo(phone, 'humano_ativo');
    // Limpa cache do Gemini para quando a IA retornar
    geminiService.limparCache(phone);
  } catch (err) {
    console.error('[WA] Erro ao registrar mensagem humana:', err.message);
  }
}

// ─── Envio via API (vendedor pelo painel) ──────────────────────────────────

async function sendMessage(phone, text, vendedorId = null) {
  if (!client || botStatus !== 'pronto') throw new Error('WhatsApp não está conectado');
  const chatId = phone.includes('@') ? phone : `${phone.replace(/\D/g, '')}@c.us`;
  const sentMsg = await client.sendMessage(chatId, text);
  botSentIds.add(sentMsg.id.id);
  if (botSentIds.size > MAX_BOT_IDS) { const [f] = botSentIds; botSentIds.delete(f); }

  // Salva no banco como mensagem humana
  await conversaService.salvarMensagem(chatId, 'enviada', 'humano', text, sentMsg.id.id);
  if (vendedorId) await conversaService.atualizarModo(chatId, 'humano_ativo', vendedorId);

  return sentMsg;
}

// ─── Restart ───────────────────────────────────────────────────────────────

async function restart() {
  if (client) { try { await client.destroy(); } catch (_) {} client = null; }
  botStatus = 'desconectado'; isInitializing = false; qrData = null;
  botSentIds.clear();
  botSendingTo.clear();
  await sleep(1500);
  limparLocksCromium(); // garante limpeza antes de reiniciar
  await initialize();
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

module.exports = { initialize, getStatus, getQRImage, sendMessage, restart };
