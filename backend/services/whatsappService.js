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
// o evento 'message_create' dispara ANTES da Promise de enviarResposta() resolver (e do ID entrar em botSentIds)
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
      // Evita que buffers pendentes tentem enviar contra um client nulo depois da queda
      for (const buffer of bufferPorTelefone.values()) { if (buffer.timer) clearTimeout(buffer.timer); }
      bufferPorTelefone.clear();
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

// ─── Limitador global de envio ─────────────────────────────────────────────
// Espaça as respostas automáticas do bot ENTRE CONVERSAS DIFERENTES, não só
// dentro da mesma. Sem isso, se vários buffers de debounce fecharem ao mesmo
// tempo, o bot dispararia várias mensagens em segundos — um dos sinais mais
// fortes de automação para os sistemas antispam do WhatsApp.

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
  // A fila sempre segue adiante — uma falha numa tarefa não trava as próximas
  filaEnvioGlobal = tarefa.then(() => {}, () => {});
  return tarefa;
}

// ─── Envia resposta como bot, protegendo contra a corrida do message_create ─

async function enviarResposta(phone, text) {
  botSendingTo.add(phone);
  try {
    const sentMsg = await agendarEnvioGlobal(() => client.sendMessage(phone, text));
    botSentIds.add(sentMsg.id.id);
    if (botSentIds.size > MAX_BOT_IDS) {
      const [first] = botSentIds; botSentIds.delete(first);
    }
    return sentMsg;
  } finally {
    botSendingTo.delete(phone);
  }
}

// ─── Agrupa mensagens rápidas do cliente antes de responder ────────────────
// Cada mensagem nova reinicia a janela de espera (debounce). Só depois de
// ~20s de silêncio a IA processa TODAS as mensagens acumuladas como um único
// contexto, mostra "digitando..." por alguns segundos e então envia a resposta.
// As janelas usam um intervalo (não um valor fixo): timing idêntico em toda
// resposta é, por si só, uma assinatura de automação.

const DEBOUNCE_MIN_MS = 18000;
const DEBOUNCE_MAX_MS = 23000;
const TYPING_MIN_MS = 2500;
const TYPING_MAX_MS = 4500;
const bufferPorTelefone = new Map(); // phone → { textos: string[], timer, ultimoMsg }

function tempoAleatorio(min, max) {
  return min + Math.random() * (max - min);
}

// ─── Divide a resposta em "bolhas" separadas, como um humano digitaria ────
// Gemini já é instruído a escrever no máximo 3 parágrafos; mandar tudo como um bloco
// único de texto é menos natural do que separar por parágrafo em mensagens distintas,
// cada uma com seu próprio "digitando..." — mais parecido com alguém no celular.
const MAX_BOLHAS = 3;

function dividirEmBolhas(text) {
  const partes = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  if (partes.length === 0) return [text.trim()];
  if (partes.length <= MAX_BOLHAS) return partes;
  // Excesso de quebras (ex.: lista longa) — junta o resto na última bolha em vez de fragmentar demais
  return [...partes.slice(0, MAX_BOLHAS - 1), partes.slice(MAX_BOLHAS - 1).join('\n\n')];
}

function enfileirarMensagem(phone, text, msg) {
  let buffer = bufferPorTelefone.get(phone);
  if (!buffer) {
    buffer = { textos: [], timer: null, ultimoMsg: null };
    bufferPorTelefone.set(phone, buffer);
  }
  buffer.textos.push(text);
  buffer.ultimoMsg = msg;

  if (buffer.timer) clearTimeout(buffer.timer);
  buffer.timer = setTimeout(() => {
    processarBuffer(phone).catch(err => console.error('[WA] Erro ao processar buffer:', err.message));
  }, tempoAleatorio(DEBOUNCE_MIN_MS, DEBOUNCE_MAX_MS));
}

async function processarBuffer(phone) {
  const buffer = bufferPorTelefone.get(phone);
  if (!buffer || buffer.textos.length === 0) return;
  bufferPorTelefone.delete(phone); // libera o slot; mensagem nova durante o processamento cria buffer próprio

  const mensagemCombinada = buffer.textos.join('\n');

  try {
    // Um humano pode ter assumido a conversa enquanto o bot esperava a janela de silêncio
    const conversa = await conversaService.obterOuCriarConversa(phone);
    if (conversa.modo === 'humano_ativo') {
      console.log(`👤 [WA] ${phone} em atendimento humano — IA não responde ao buffer acumulado`);
      return;
    }

    const resultado = await geminiService.processMessage(phone, mensagemCombinada);
    if (!resultado) return;

    // Marca como lida antes de responder — sequência humana (ler → digitar → enviar)
    try {
      const chat = await buffer.ultimoMsg.getChat();
      await chat.sendSeen();
    } catch (_) {}

    // Envia cada bolha com seu próprio "digitando...", em vez de um bloco único de texto
    let sentMsg = null;
    for (const bolha of dividirEmBolhas(resultado.text).filter(Boolean)) {
      try {
        const chat = await buffer.ultimoMsg.getChat();
        await chat.sendStateTyping();
      } catch (_) {}
      await sleep(tempoAleatorio(TYPING_MIN_MS, TYPING_MAX_MS));

      sentMsg = await enviarResposta(phone, bolha);
      await conversaService.salvarMensagem(phone, 'enviada', 'ia', bolha, sentMsg.id.id);
    }

    if (resultado.handover) {
      console.log(`🔔 [WA] Handover para humano — ${phone}`);
    }
  } catch (err) {
    console.error('[WA] Erro ao processar mensagem:', err.message);

    // Gemini indisponível (429 cota, 503 sobrecarga etc.) — avisa o cliente e passa pra humano em vez de ficar mudo
    if (/429|quota exceeded|503|service unavailable|high demand/i.test(err.message || '')) {
      try {
        const fallback = 'No momento estou com instabilidade e não consigo responder automaticamente 🙏 Já registrei sua mensagem e um de nossos consultores vai te responder em breve.';
        const sentMsg = await enviarResposta(phone, fallback);
        await conversaService.salvarMensagem(phone, 'enviada', 'ia', fallback, sentMsg.id.id);
        await conversaService.atualizarModo(phone, 'humano_ativo');
        console.warn(`⚠️  [WA] Gemini indisponível — ${phone} passado para atendimento humano`);
      } catch (fallbackErr) {
        console.error('[WA] Falha ao enviar fallback de indisponibilidade:', fallbackErr.message);
      }
    }
  }
}

// ─── Mensagem RECEBIDA (de contato externo) ────────────────────────────────

async function onIncoming(msg) {
  if (msg.fromMe) return;
  if (msg.isStatus) return; // ignora status/stories públicos de contatos
  // Só responde chat 1:1 de verdade (@c.us ou @lid) — bloqueia por padrão qualquer coisa
  // fora desse whitelist: grupos (@g.us), listas de transmissão (@broadcast), canais/newsletters
  // (@newsletter) etc. Responder automaticamente nesses contextos é o tipo de comportamento que
  // mais pesa na detecção de spam/automação do WhatsApp.
  if (!msg.from.endsWith('@c.us') && !msg.from.endsWith('@lid')) return;

  const phone = await resolvePhone(msg.from, () => msg.getContact());
  const text = (msg.body || '').trim();
  if (!text) return;

  console.log(`📩 [WA] ${phone}: ${text.substring(0, 80)}`);

  try {
    // Persiste a mensagem do cliente imediatamente (histórico fica correto mesmo se o buffer nunca fechar)
    await conversaService.salvarMensagem(phone, 'recebida', 'cliente', text, msg.id.id);

    // Verifica se está em modo humano
    const conversa = await conversaService.obterOuCriarConversa(phone);
    if (conversa.modo === 'humano_ativo') {
      console.log(`👤 [WA] ${phone} em atendimento humano — IA silenciada`);
      return;
    }

    // Acumula no buffer — só processa após DEBOUNCE_MS de silêncio do cliente
    enfileirarMensagem(phone, text, msg);
  } catch (err) {
    console.error('[WA] Erro ao processar mensagem:', err.message);
  }
}

// ─── Detecta mensagem enviada pelo HUMANO no dispositivo WhatsApp ──────────

async function onMessageCreate(msg) {
  if (!msg.fromMe) return;
  if (msg.isStatus) return; // ignora postagem de status próprio
  // Em mensagens enviadas (fromMe), o destino está em `msg.to` — não em `msg.from` (que é
  // sempre o próprio número). Checar `msg.from` aqui nunca filtrava grupo/broadcast/newsletter
  // de verdade; corrigido para o mesmo whitelist de chat 1:1 usado em onIncoming.
  if (!msg.to.endsWith('@c.us') && !msg.to.endsWith('@lid')) return;

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
    cancelarBuffer(phone); // humano assumiu — cancela resposta da IA que estivesse aguardando na janela de debounce
    // Limpa cache do Gemini para quando a IA retornar
    geminiService.limparCache(phone);
  } catch (err) {
    console.error('[WA] Erro ao registrar mensagem humana:', err.message);
  }
}

// ─── Cancela um buffer de mensagens pendente (ex.: humano assumiu a conversa) ─

function cancelarBuffer(phone) {
  const buffer = bufferPorTelefone.get(phone);
  if (!buffer) return;
  if (buffer.timer) clearTimeout(buffer.timer);
  bufferPorTelefone.delete(phone);
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
  cancelarBuffer(chatId); // humano assumiu — cancela resposta da IA que estivesse aguardando na janela de debounce

  return sentMsg;
}

// ─── Restart ───────────────────────────────────────────────────────────────
// Reconexões frequentes (vários login/logout em sequência) são, por si só, um
// padrão associado a automação — por isso o restart tem um período mínimo
// entre chamadas, mesmo que o botão do painel seja clicado várias vezes.

const RESTART_COOLDOWN_MS = 30000;
let ultimoRestartEm = 0;

async function restart() {
  const decorrido = Date.now() - ultimoRestartEm;
  if (decorrido < RESTART_COOLDOWN_MS) {
    throw new Error(`Aguarde ${Math.ceil((RESTART_COOLDOWN_MS - decorrido) / 1000)}s antes de reiniciar novamente`);
  }
  ultimoRestartEm = Date.now();

  if (client) { try { await client.destroy(); } catch (_) {} client = null; }
  botStatus = 'desconectado'; isInitializing = false; qrData = null;
  botSentIds.clear();
  botSendingTo.clear();
  for (const buffer of bufferPorTelefone.values()) { if (buffer.timer) clearTimeout(buffer.timer); }
  bufferPorTelefone.clear();
  await sleep(1500);
  limparLocksCromium(); // garante limpeza antes de reiniciar
  await initialize();
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

module.exports = { initialize, getStatus, getQRImage, sendMessage, restart };
