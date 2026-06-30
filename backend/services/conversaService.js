const db = require('../config/db');

// ─── Conversa ──────────────────────────────────────────────────────────────

async function obterOuCriarConversa(phone) {
  const conn = await db.getConnection();
  try {
    let [rows] = await conn.query('SELECT * FROM whatsapp_conversas WHERE phone = ?', [phone]);
    if (rows.length === 0) {
      const digits = phone.replace(/\D/g, '').slice(-11);
      const [cls] = await conn.query(
        `SELECT id, nome FROM clientes
         WHERE REPLACE(REPLACE(REPLACE(REPLACE(telefone,' ',''),'-',''),'(',''),')','') LIKE ?`,
        [`%${digits}`]
      );
      const clienteId = cls[0]?.id ?? null;
      const nomeContato = cls[0]?.nome ?? null;
      await conn.query(
        `INSERT INTO whatsapp_conversas (phone, cliente_id, nome_contato, modo) VALUES (?, ?, ?, 'ia_ativa')`,
        [phone, clienteId, nomeContato]
      );
      [rows] = await conn.query('SELECT * FROM whatsapp_conversas WHERE phone = ?', [phone]);
    }
    return rows[0];
  } finally {
    conn.release();
  }
}

async function atualizarModo(phone, modo, vendedorId = null) {
  await db.query(
    `UPDATE whatsapp_conversas SET modo = ?, vendedor_responsavel_id = ? WHERE phone = ?`,
    [modo, vendedorId, phone]
  );
}

async function listarConversas() {
  const [rows] = await db.query(`
    SELECT
      wc.id, wc.phone, wc.nome_contato, wc.modo, wc.ultima_mensagem_em,
      wc.cliente_id, c.empresa,
      u.nome AS vendedor_nome,
      (SELECT conteudo FROM whatsapp_mensagens wm WHERE wm.conversa_id = wc.id ORDER BY wm.criado_em DESC LIMIT 1) AS ultima_mensagem,
      (SELECT remetente FROM whatsapp_mensagens wm WHERE wm.conversa_id = wc.id ORDER BY wm.criado_em DESC LIMIT 1) AS ultimo_remetente
    FROM whatsapp_conversas wc
    LEFT JOIN clientes c ON c.id = wc.cliente_id
    LEFT JOIN usuarios u ON u.id = wc.vendedor_responsavel_id
    ORDER BY COALESCE(wc.ultima_mensagem_em, wc.criado_em) DESC
  `);
  return rows;
}

async function obterConversaPorId(id) {
  const [rows] = await db.query('SELECT * FROM whatsapp_conversas WHERE id = ?', [id]);
  return rows[0] || null;
}

// ─── Mensagens ─────────────────────────────────────────────────────────────

async function salvarMensagem(phone, direcao, remetente, conteudo, whatsappMsgId = null) {
  const conversa = await obterOuCriarConversa(phone);
  await db.query(
    `INSERT INTO whatsapp_mensagens (conversa_id, direcao, remetente, conteudo, whatsapp_msg_id) VALUES (?, ?, ?, ?, ?)`,
    [conversa.id, direcao, remetente, conteudo, whatsappMsgId]
  );
  await db.query(
    `UPDATE whatsapp_conversas SET ultima_mensagem_em = NOW() WHERE id = ?`,
    [conversa.id]
  );
  return conversa;
}

async function listarMensagens(conversaId, limit = 60) {
  const [rows] = await db.query(
    `SELECT id, direcao, remetente, conteudo, criado_em
     FROM whatsapp_mensagens WHERE conversa_id = ?
     ORDER BY criado_em ASC`,
    [conversaId]
  );
  // Return last N messages
  return rows.slice(-limit);
}

// Returns messages formatted for Gemini history (only cliente/ia turns)
async function buildGeminiHistory(phone, limit = 30) {
  const conversa = await obterOuCriarConversa(phone);
  const msgs = await listarMensagens(conversa.id, limit * 2);
  const history = [];
  for (const m of msgs) {
    if (m.remetente === 'cliente') history.push({ role: 'user', parts: [{ text: m.conteudo }] });
    else if (m.remetente === 'ia') history.push({ role: 'model', parts: [{ text: m.conteudo }] });
  }
  // Gemini requires history to start with 'user' role and alternate
  const clean = [];
  let lastRole = null;
  for (const h of history) {
    if (h.role !== lastRole) { clean.push(h); lastRole = h.role; }
  }
  return clean.slice(-limit);
}

// ─── Contexto para a IA ────────────────────────────────────────────────────

async function buildContexto(phone) {
  const digits = phone.replace(/\D/g, '').slice(-11);
  const conn = await db.getConnection();
  try {
    const [cls] = await conn.query(
      `SELECT c.*, u.nome AS vendedor_nome
       FROM clientes c LEFT JOIN usuarios u ON u.id = c.vendedor_id
       WHERE REPLACE(REPLACE(REPLACE(REPLACE(c.telefone,' ',''),'-',''),'(',''),')','') LIKE ?`,
      [`%${digits}`]
    );
    const cliente = cls[0] || null;

    let interacoes = [];
    if (cliente) {
      const [ints] = await conn.query(
        `SELECT tipo, descricao, DATE_FORMAT(data_criacao,'%d/%m/%Y %H:%i') AS data
         FROM interacoes WHERE cliente_id = ? ORDER BY data_criacao DESC LIMIT 8`,
        [cliente.id]
      );
      interacoes = ints;
    }

    const [memorias] = await conn.query(
      `SELECT tipo, conteudo, DATE_FORMAT(criado_em,'%d/%m/%Y') AS data
       FROM whatsapp_memoria_ia WHERE phone = ? ORDER BY criado_em DESC LIMIT 20`,
      [phone]
    );

    const [agendamentos] = await conn.query(
      `SELECT titulo, DATE_FORMAT(data_hora,'%d/%m/%Y %H:%i') AS data_hora, status, descricao
       FROM whatsapp_agendamentos WHERE phone = ? AND status != 'cancelado'
       ORDER BY data_hora ASC LIMIT 5`,
      [phone]
    );

    const conversa = await obterOuCriarConversa(phone);

    return { cliente, interacoes, memorias, agendamentos, conversa };
  } finally {
    conn.release();
  }
}

// ─── Memória da IA ─────────────────────────────────────────────────────────

async function salvarMemoria(phone, tipo, conteudo) {
  await db.query(
    `INSERT INTO whatsapp_memoria_ia (phone, tipo, conteudo) VALUES (?, ?, ?)`,
    [phone, tipo, conteudo]
  );
}

async function listarMemorias(phone) {
  const [rows] = await db.query(
    `SELECT * FROM whatsapp_memoria_ia WHERE phone = ? ORDER BY criado_em DESC`,
    [phone]
  );
  return rows;
}

async function deletarMemoria(id) {
  await db.query('DELETE FROM whatsapp_memoria_ia WHERE id = ?', [id]);
}

// ─── Agendamentos ──────────────────────────────────────────────────────────

async function criarAgendamento(phone, titulo, dataHora, descricao, clienteId = null, vendedorId = null) {
  const [r] = await db.query(
    `INSERT INTO whatsapp_agendamentos (phone, cliente_id, titulo, descricao, data_hora, vendedor_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [phone, clienteId, titulo, descricao || null, dataHora, vendedorId]
  );
  return r.insertId;
}

async function listarAgendamentos(filtros = {}) {
  let sql = `
    SELECT wa.*, c.nome AS cliente_nome, c.empresa, u.nome AS vendedor_nome,
      DATE_FORMAT(wa.data_hora,'%d/%m/%Y %H:%i') AS data_hora_fmt
    FROM whatsapp_agendamentos wa
    LEFT JOIN clientes c ON c.id = wa.cliente_id
    LEFT JOIN usuarios u ON u.id = wa.vendedor_id
    WHERE 1=1
  `;
  const params = [];
  if (filtros.status) { sql += ' AND wa.status = ?'; params.push(filtros.status); }
  if (filtros.phone)  { sql += ' AND wa.phone = ?';  params.push(filtros.phone); }
  sql += ' ORDER BY wa.data_hora ASC';
  const [rows] = await db.query(sql, params);
  return rows;
}

async function atualizarAgendamento(id, campos) {
  const pares = Object.entries(campos).map(([k]) => `${k} = ?`).join(', ');
  await db.query(
    `UPDATE whatsapp_agendamentos SET ${pares} WHERE id = ?`,
    [...Object.values(campos), id]
  );
}

// ─── Vinculação ao CRM ─────────────────────────────────────────────────────

async function vincularClienteCRM(phone, clienteId) {
  const digits = phone.replace(/\D/g, '').slice(-11);
  const [cls] = await db.query('SELECT nome FROM clientes WHERE id = ?', [clienteId]);
  if (!cls[0]) throw new Error('Cliente não encontrado');
  await db.query(
    `UPDATE whatsapp_conversas SET cliente_id = ?, nome_contato = ? WHERE phone = ?`,
    [clienteId, cls[0].nome, phone]
  );
  // Update agendamentos e memorias foreign key
  await db.query(
    `UPDATE whatsapp_agendamentos SET cliente_id = ? WHERE phone = ? AND cliente_id IS NULL`,
    [clienteId, phone]
  );
}

module.exports = {
  obterOuCriarConversa, atualizarModo, listarConversas, obterConversaPorId,
  salvarMensagem, listarMensagens, buildGeminiHistory,
  buildContexto,
  salvarMemoria, listarMemorias, deletarMemoria,
  criarAgendamento, listarAgendamentos, atualizarAgendamento,
  vincularClienteCRM,
};
