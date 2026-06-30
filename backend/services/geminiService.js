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

  let prompt = `Você é Mythos, assistente virtual da Studio Mythos — software house especializada em produtos digitais de alto padrão.

SERVIÇOS DA STUDIO MYTHOS:
- Sites institucionais, landing pages e e-commerce
- Sistemas web sob medida: CRMs, ERPs, plataformas SaaS
- Aplicativos mobile iOS e Android
- Identidade visual e branding premium
- Suporte e manutenção técnica contínua
- Site: studiomythos.com.br | Horário humano: Seg-Sex, 9h–18h

REGRAS DE COMPORTAMENTO:
- Seja cordial, natural e profissional — nunca robótico ou genérico
- Respostas curtas e diretas (estilo WhatsApp) — máximo 3 parágrafos
- Use emojis com moderação: no máximo 2 por mensagem
- NUNCA invente preços, prazos ou promessas — tudo depende de escopo
- Quando não souber, diga que vai verificar com a equipe
- Ao detectar interesse em comprar → ofereça agendar uma reunião de diagnóstico gratuita
- Para coletar orçamento: nome completo, e-mail, tipo de projeto e descrição
- Quando o cliente pedir para falar com humano → use a função solicitar_humano

FUNÇÕES DISPONÍVEIS:
- agendar_reuniao: use quando o cliente aceitar marcar uma reunião/ligação
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
    prompt += `\n\n══ AGENDAMENTOS COM ESTE CONTATO ══`;
    for (const a of agendamentos) {
      prompt += `\n• ${a.titulo} em ${a.data_hora} (${a.status})${a.descricao ? ' — ' + a.descricao : ''}`;
    }
  }

  return prompt;
}

// ─── Ferramentas (Function Calling) ────────────────────────────────────────

const TOOLS = [{
  functionDeclarations: [
    {
      name: 'agendar_reuniao',
      description: 'Agenda uma reunião ou ligação com o cliente. Use quando o cliente aceitar marcar um horário.',
      parameters: {
        type: 'OBJECT',
        properties: {
          titulo:    { type: 'STRING', description: 'Título da reunião, ex: "Diagnóstico gratuito Studio Mythos"' },
          data_hora: { type: 'STRING', description: 'Data e hora no formato AAAA-MM-DD HH:MM' },
          descricao: { type: 'STRING', description: 'Detalhes adicionais sobre o que será discutido' },
        },
        required: ['titulo', 'data_hora'],
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
    const id = await conversaService.criarAgendamento(
      phone, args.titulo, args.data_hora, args.descricao || null, clienteId
    );
    return { sucesso: true, id, mensagem: `Reunião "${args.titulo}" agendada para ${args.data_hora}` };
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

  const model = getClient().getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
    tools: TOOLS,
  });

  const chat = model.startChat({ history });

  // 1ª chamada — pode resultar em função ou texto direto
  const result1 = await chat.sendMessage(userMessage);
  const response1 = result1.response;

  let finalText;
  let handover = false;

  const fnCalls = response1.functionCalls ? response1.functionCalls() : [];

  if (fnCalls && fnCalls.length > 0) {
    // Executa todas as funções solicitadas
    const toolResponses = [];
    for (const fn of fnCalls) {
      const fnResult = await executarFuncao(fn.name, fn.args, phone, contexto.cliente?.id ?? null);
      if (fn.name === 'solicitar_humano' && fnResult.handover) handover = true;
      toolResponses.push({
        functionResponse: { name: fn.name, response: { result: fnResult } },
      });
    }

    // Envia os resultados de volta para o Gemini gerar o texto final
    const result2 = await chat.sendMessage(toolResponses);
    finalText = result2.response.text();
  } else {
    finalText = response1.text();
  }

  // Atualiza cache do histórico
  history.push({ role: 'user', parts: [{ text: userMessage }] });
  history.push({ role: 'model', parts: [{ text: finalText }] });
  if (history.length > 60) historyCache.set(phone, history.slice(-60));

  return { text: finalText, handover };
}

function limparCache(phone) {
  historyCache.delete(phone);
}

module.exports = { processMessage, limparCache };
