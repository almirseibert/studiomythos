const { GoogleGenerativeAI } = require('@google/generative-ai');
const conversaService = require('./conversaService');

// ─── Histórico em memória (cache por sessão) ───────────────────────────────
// Complementa o DB: evita recarregar do banco a cada mensagem na mesma sessão
const historyCache = new Map(); // phone → [{role, parts}]

function getClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key.startsWith('inserir_')) throw new Error('GEMINI_API_KEY não configurada no .env');
  return new GoogleGenerativeAI(key);
}

// ─── System prompt dinâmico (contextualizado por cliente/memórias/agenda) ──

function buildSystemPrompt(contexto) {
  const { cliente, interacoes, memorias, agendamentos } = contexto;

  let prompt = `Atue como Mythos, um executivo de vendas altamente profissional, com toda a experiência em vendas do maior vendedor do mundo, trabalhando para a Studio Mythos — um estúdio full-service de produto digital. Produzimos Sites, e-commerce, aplicativos, plataformas internas e marketing.

SEU PROPÓSITO:
Trabalhar para oferecer os produtos e serviços da Studio Mythos, sempre focando na conversão de vendas e no agendamento de reuniões.

TOM DE VOZ E PERSONALIDADE:
- Estilo de fala: direto, amigável, profissional
- Humor: sério, mas brincalhão e acolhedor quando a conversa permitir
- Nível de formalidade: altamente formal e polido

SERVIÇOS DA STUDIO MYTHOS:
- Sites institucionais, landing pages e e-commerce
- Sistemas web sob medida: CRMs, ERPs, plataformas SaaS
- Aplicativos mobile iOS e Android
- Identidade visual e branding premium
- Suporte e manutenção técnica contínua
- Site: studiomythos.com.br | Horário humano: Seg-Sex, 9h–18h

DIRETRIZES DE COMPORTAMENTO:
- Sempre responda com objetividade
- Nunca use linguagem ofensiva
- Faça perguntas para esclarecer dúvidas quando necessário
- Respostas curtas e diretas (estilo WhatsApp) — máximo 3 parágrafos
- Use emojis com moderação: no máximo 2 por mensagem
- NUNCA invente preços, prazos ou promessas — tudo depende de escopo
- Quando não souber, diga que vai verificar com a equipe
- Ao detectar interesse em comprar → ofereça agendar uma reunião de diagnóstico gratuita
- Para coletar orçamento: nome completo, e-mail, tipo de projeto e descrição
- Quando o cliente pedir para falar com humano → use a função solicitar_humano

AO AGENDAR UMA REUNIÃO:
- A sede da Studio Mythos fica em Lajeado/RS. ANTES de chamar agendar_reuniao, pergunte ao
  cliente se prefere reunião presencial ou por vídeo/chamada
- Se o cliente quiser presencial, pergunte a cidade dele. Se a cidade estiver a mais de
  ~50km de Lajeado/RS (ex: fora do Vale do Taquari), explique educadamente que presencial
  só é viável dentro dessa distância e ofereça vídeo/chamada como alternativa
- Passe o formato escolhido no campo "modalidade" e a cidade do cliente no campo
  "cidade_cliente" ao chamar agendar_reuniao
- APÓS agendar com sucesso, SEMPRE responda ao cliente: agradeça o contato, confirme data,
  horário e formato da reunião, avise que qualquer cancelamento ou alteração de data pode
  ser resolvido falando diretamente com você (a IA) por aqui mesmo, pergunte se ficou
  alguma dúvida e se despeça cordialmente
- Se o cliente pedir para reagendar ou cancelar uma reunião já marcada, use a função
  alterar_agendamento com o [ID] correspondente (veja a lista de agendamentos do contato)

FUNÇÕES DISPONÍVEIS:
- agendar_reuniao: use quando o cliente aceitar marcar uma reunião/ligação (depois de confirmar o formato)
- alterar_agendamento: use para reagendar (nova data) ou cancelar uma reunião já existente
- salvar_memoria: use para registrar preferências, objeções, fatos importantes do cliente
- solicitar_humano: use quando o cliente pedir atendimento humano ou quando a situação exigir um vendedor`;

  if (cliente) {
    prompt += `\n\n══ DADOS DO CONTATO ATUAL ══
Nome: ${cliente.nome || 'Não identificado'}
Empresa: ${cliente.empresa || 'Não informada'}
Status no Funil: ${cliente.status || 'Desconhecido'}
Vendedor responsável no CRM: ${cliente.vendedor_nome || 'Nenhum atribuído'}
Valor em negociação: R$ ${Number(cliente.valor_proposta || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Serviços de interesse: ${cliente.servicos_oferecidos || 'Não definido'}
Produto/Proposta: ${cliente.produto_oferecido || 'Não definido'}
Observações do CRM: ${cliente.observacoes || 'Nenhuma'}`;
  } else {
    prompt += `\n\n══ CONTATO ATUAL ══
Novo contato — sem cadastro no CRM ainda. Tente identificar nome, empresa e interesse ao longo da conversa e use salvar_memoria para registrar o que descobrir.`;
  }

  if (interacoes.length > 0) {
    prompt += `\n\n══ HISTÓRICO DE INTERAÇÕES NO CRM ══`;
    for (const i of interacoes.slice(0, 6)) {
      prompt += `\n• [${i.data}] ${i.tipo}: ${i.descricao}`;
    }
  }

  if (memorias.length > 0) {
    prompt += `\n\n══ SUAS MEMÓRIAS SOBRE ESTE CONTATO ══`;
    for (const m of memorias) {
      prompt += `\n• [${m.tipo}] ${m.conteudo}`;
    }
  }

  if (agendamentos.length > 0) {
    prompt += `\n\n══ AGENDAMENTOS COM ESTE CONTATO ══
Use o campo [ID] com a função alterar_agendamento se o cliente pedir para reagendar ou cancelar.`;
    for (const a of agendamentos) {
      prompt += `\n• [ID ${a.id}] ${a.titulo} em ${a.data_hora} (${a.status})${a.descricao ? ' — ' + a.descricao : ''}`;
    }
  }

  return prompt;
}

// ─── Ferramentas (Function Calling) ────────────────────────────────────────

const TOOLS = [{
  functionDeclarations: [
    {
      name: 'agendar_reuniao',
      description: 'Agenda uma reunião ou ligação com o cliente. Só chame depois de perguntar e confirmar o formato (presencial ou vídeo/chamada) com o cliente.',
      parameters: {
        type: 'OBJECT',
        properties: {
          titulo:          { type: 'STRING', description: 'Título da reunião, ex: "Diagnóstico gratuito Studio Mythos"' },
          data_hora:       { type: 'STRING', description: 'Data e hora no formato AAAA-MM-DD HH:MM' },
          modalidade:      { type: 'STRING', description: 'Formato combinado com o cliente: "presencial" ou "video"' },
          cidade_cliente:  { type: 'STRING', description: 'Cidade do cliente, obrigatória se modalidade = presencial' },
          descricao:       { type: 'STRING', description: 'Detalhes adicionais sobre o que será discutido' },
        },
        required: ['titulo', 'data_hora', 'modalidade'],
      },
    },
    {
      name: 'alterar_agendamento',
      description: 'Reagenda (nova data/hora) ou cancela uma reunião já existente. Use quando o cliente pedir para remarcar ou desmarcar, referenciando o [ID] listado nos agendamentos do contato.',
      parameters: {
        type: 'OBJECT',
        properties: {
          agendamento_id: { type: 'NUMBER', description: 'ID do agendamento a alterar (veja a lista de agendamentos do contato)' },
          novo_status:    { type: 'STRING', description: 'Use "cancelado" para cancelar. Deixe em branco se for só reagendar.' },
          nova_data_hora: { type: 'STRING', description: 'Nova data e hora no formato AAAA-MM-DD HH:MM, se for reagendar' },
        },
        required: ['agendamento_id'],
      },
    },
    {
      name: 'salvar_memoria',
      description: 'Salva uma informação importante sobre o cliente para referência em conversas futuras.',
      parameters: {
        type: 'OBJECT',
        properties: {
          tipo:     { type: 'STRING', description: 'Uma de: fato, preferencia, interesse, objecao, nota' },
          conteudo: { type: 'STRING', description: 'A informação a registrar, de forma objetiva' },
        },
        required: ['tipo', 'conteudo'],
      },
    },
    {
      name: 'solicitar_humano',
      description: 'Sinaliza que um vendedor humano deve assumir esta conversa.',
      parameters: {
        type: 'OBJECT',
        properties: {
          motivo: { type: 'STRING', description: 'Razão pela qual um humano é necessário' },
        },
        required: ['motivo'],
      },
    },
  ],
}];

// ─── Execução das funções ──────────────────────────────────────────────────

async function executarFuncao(nome, args, phone, clienteId) {
  if (nome === 'agendar_reuniao') {
    const modalidade = args.modalidade === 'presencial' ? 'Presencial' : 'Vídeo/chamada';
    const detalhes = [
      `Formato: ${modalidade}${args.cidade_cliente ? ` (cliente em ${args.cidade_cliente})` : ''}`,
      args.descricao || null,
    ].filter(Boolean).join(' — ');

    const id = await conversaService.criarAgendamento(
      phone, args.titulo, args.data_hora, detalhes, clienteId
    );
    return { sucesso: true, id, mensagem: `Reunião "${args.titulo}" agendada para ${args.data_hora} (${modalidade})` };
  }

  if (nome === 'alterar_agendamento') {
    const campos = {};
    if (args.nova_data_hora) campos.data_hora = args.nova_data_hora;
    if (args.novo_status) campos.status = args.novo_status;
    if (Object.keys(campos).length === 0) {
      return { sucesso: false, erro: 'Nenhuma alteração informada (nova_data_hora ou novo_status)' };
    }
    await conversaService.atualizarAgendamento(args.agendamento_id, campos);
    return { sucesso: true, mensagem: 'Agendamento atualizado com sucesso' };
  }

  if (nome === 'salvar_memoria') {
    const tipos = ['fato', 'preferencia', 'interesse', 'objecao', 'nota'];
    const tipo = tipos.includes(args.tipo) ? args.tipo : 'nota';
    await conversaService.salvarMemoria(phone, tipo, args.conteudo);
    return { sucesso: true, mensagem: 'Memória salva' };
  }

  if (nome === 'solicitar_humano') {
    await conversaService.atualizarModo(phone, 'humano_ativo');
    return { sucesso: true, handover: true, motivo: args.motivo };
  }

  return { sucesso: false, erro: 'Função desconhecida' };
}

// ─── Retry com backoff para erros transitórios (503 sobrecarga) ───────────

function isTransitorio(err) {
  return /503|overloaded|high demand|UNAVAILABLE/i.test(err.message || '');
}

async function withRetry(fn, retries = 3) {
  for (let tentativa = 0; ; tentativa++) {
    try {
      return await fn();
    } catch (err) {
      if (!isTransitorio(err) || tentativa >= retries) throw err;
      await sleep(1000 * 2 ** tentativa + Math.random() * 300);
    }
  }
}

// ─── Chamada ao Gemini isolada por modelo (permite trocar de modelo em fallback) ──

const MAX_RODADAS_FUNCAO = 4; // evita loop infinito se o modelo encadear chamadas de função

async function gerarResposta(modelName, systemPrompt, history, userMessage, phone, clienteId) {
  const model = getClient().getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt,
    tools: TOOLS,
  });

  const chat = model.startChat({ history });

  let response = (await chat.sendMessage(userMessage)).response;
  let handover = false;

  // Encadeia rodadas de function calling (ex.: agendar_reuniao + salvar_memoria na mesma
  // resposta) até o modelo devolver texto puro, em vez de assumir que 1 rodada basta.
  for (let rodada = 0; rodada < MAX_RODADAS_FUNCAO; rodada++) {
    const fnCalls = response.functionCalls ? response.functionCalls() : [];
    if (!fnCalls || fnCalls.length === 0) break;

    const toolResponses = [];
    for (const fn of fnCalls) {
      const fnResult = await executarFuncao(fn.name, fn.args, phone, clienteId);
      if (fn.name === 'solicitar_humano' && fnResult.handover) handover = true;
      toolResponses.push({
        functionResponse: { name: fn.name, response: { result: fnResult } },
      });
    }

    response = (await chat.sendMessage(toolResponses)).response;
  }

  // Garante que o cliente nunca fique sem resposta: se o modelo não devolveu texto
  // (ex.: só encadeou funções sem comentar o resultado), usa um fallback.
  let finalText = '';
  try {
    finalText = response.text() || '';
  } catch (_) { /* resposta sem parte de texto */ }
  if (!finalText.trim()) {
    finalText = 'Combinado! Se precisar de mais alguma coisa, é só me chamar por aqui. 🙂';
  }

  return { text: finalText, handover };
}

// ─── Processamento principal ───────────────────────────────────────────────

async function processMessage(phone, userMessage) {
  // Carrega contexto do DB (cliente, histórico CRM, memórias, agenda)
  const contexto = await conversaService.buildContexto(phone);

  // Se em modo humano, IA não responde
  if (contexto.conversa.modo === 'humano_ativo') return null;

  const systemPrompt = buildSystemPrompt(contexto);

  // Histórico: usa cache em memória se existir, senão reconstrói do DB
  if (!historyCache.has(phone)) {
    const histDb = await conversaService.buildGeminiHistory(phone, 20);
    historyCache.set(phone, histDb);
  }
  const history = historyCache.get(phone);

  // Cadeia de modelos: se o principal estiver sobrecarregado (503) mesmo após
  // retries, tenta o modelo de fallback antes de desistir e passar pra humano.
  const modelosParaTentar = [
    process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite',
    process.env.GEMINI_MODEL_FALLBACK || 'gemini-2.5-flash',
  ].filter((m, i, arr) => arr.indexOf(m) === i); // remove duplicata se ambos apontarem pro mesmo modelo

  let resultado;
  let ultimoErro;
  for (const modelName of modelosParaTentar) {
    try {
      resultado = await withRetry(() =>
        gerarResposta(modelName, systemPrompt, history, userMessage, phone, contexto.cliente?.id ?? null)
      );
      break;
    } catch (err) {
      ultimoErro = err;
      if (!isTransitorio(err)) throw err;
      console.warn(`[Gemini] Modelo "${modelName}" indisponível (503), tentando próximo da cadeia...`);
    }
  }
  if (!resultado) throw ultimoErro;

  // Atualiza cache do histórico
  history.push({ role: 'user', parts: [{ text: userMessage }] });
  history.push({ role: 'model', parts: [{ text: resultado.text }] });
  if (history.length > 60) historyCache.set(phone, history.slice(-60));

  return resultado;
}

function limparCache(phone) {
  historyCache.delete(phone);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

module.exports = { processMessage, limparCache };
