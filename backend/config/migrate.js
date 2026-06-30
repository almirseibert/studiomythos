const dbPool = require('./db');

/**
 * Migração leve e idempotente: garante que a tabela `clientes` tenha as
 * colunas novas (produto/proposta/serviços/contatos/detalhes) sem precisar
 * rodar o /api/setup destrutivo em produção.
 */
const COLUNAS_CLIENTES = [
  ['produto_oferecido', 'VARCHAR(255)'],
  ['valor_proposta', 'DECIMAL(10,2) DEFAULT 0.00'],
  ['servicos_oferecidos', 'TEXT'],
  ['contatos', 'TEXT'],
  ['detalhes_externos', 'TEXT'],
];

// Tabelas novas (currículos/candidaturas e orçamentos). Criadas de forma
// idempotente para que produção ganhe as tabelas sem rodar o /api/setup destrutivo.
const CRIAR_CURRICULOS = `CREATE TABLE IF NOT EXISTS curriculos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  telefone VARCHAR(40),
  data_nascimento DATE NULL,
  cpf VARCHAR(20),
  rg VARCHAR(20),
  sexo VARCHAR(20),
  estado_civil VARCHAR(30),
  nacionalidade VARCHAR(60),
  endereco VARCHAR(255),
  cidade VARCHAR(120),
  estado VARCHAR(60),
  cep VARCHAR(15),
  vaga_desejada VARCHAR(150),
  pretensao_salarial VARCHAR(60),
  disponibilidade VARCHAR(80),
  escolaridade VARCHAR(80),
  cnh VARCHAR(20),
  possui_veiculo TINYINT DEFAULT 0,
  linkedin VARCHAR(255),
  portfolio VARCHAR(255),
  experiencias TEXT,
  formacoes TEXT,
  cursos TEXT,
  habilidades TEXT,
  sobre TEXT,
  origem VARCHAR(40) DEFAULT 'Site',
  status ENUM('Novo','Em análise','Entrevista','Aprovado','Reprovado') DEFAULT 'Novo',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

const CRIAR_ORCAMENTOS = `CREATE TABLE IF NOT EXISTS orcamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150),
  telefone VARCHAR(40),
  tipo VARCHAR(80) DEFAULT 'Orçamento',
  descricao TEXT,
  dados TEXT,
  valor_estimado DECIMAL(10,2) DEFAULT 0.00,
  origem VARCHAR(40) DEFAULT 'Site',
  status ENUM('Novo','Em contato','Fechado','Cancelado') DEFAULT 'Novo',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

async function garantirColunas() {
  try {
    const [linhas] = await dbPool.query(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'clientes'`
    );
    const existentes = new Set(linhas.map(l => (l.COLUMN_NAME || l.column_name).toLowerCase()));
    for (const [coluna, definicao] of COLUNAS_CLIENTES) {
      if (!existentes.has(coluna.toLowerCase())) {
        await dbPool.query(`ALTER TABLE clientes ADD COLUMN ${coluna} ${definicao}`);
        console.log(`🛠️  Migração: coluna clientes.${coluna} adicionada.`);
      }
    }

    // Tabelas existentes (não destrutivo)
    await dbPool.query(CRIAR_CURRICULOS);
    await dbPool.query(CRIAR_ORCAMENTOS);
    console.log('🛠️  Migração: tabelas curriculos e orcamentos garantidas.');

    // ── Tabelas do WhatsApp Bot ─────────────────────────────────────────────
    await dbPool.query(`CREATE TABLE IF NOT EXISTS whatsapp_conversas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      phone VARCHAR(30) NOT NULL UNIQUE,
      nome_contato VARCHAR(150),
      cliente_id INT NULL,
      modo ENUM('ia_ativa','humano_ativo','aguardando') DEFAULT 'ia_ativa',
      vendedor_responsavel_id INT NULL,
      ultima_mensagem_em TIMESTAMP NULL,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
      FOREIGN KEY (vendedor_responsavel_id) REFERENCES usuarios(id) ON DELETE SET NULL
    )`);

    await dbPool.query(`CREATE TABLE IF NOT EXISTS whatsapp_mensagens (
      id INT AUTO_INCREMENT PRIMARY KEY,
      conversa_id INT NOT NULL,
      direcao ENUM('recebida','enviada') NOT NULL,
      remetente ENUM('cliente','ia','humano') NOT NULL,
      conteudo TEXT NOT NULL,
      whatsapp_msg_id VARCHAR(80),
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversa_id) REFERENCES whatsapp_conversas(id) ON DELETE CASCADE
    )`);

    await dbPool.query(`CREATE TABLE IF NOT EXISTS whatsapp_memoria_ia (
      id INT AUTO_INCREMENT PRIMARY KEY,
      phone VARCHAR(30) NOT NULL,
      tipo ENUM('fato','preferencia','interesse','objecao','nota') DEFAULT 'nota',
      conteudo TEXT NOT NULL,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_phone (phone)
    )`);

    await dbPool.query(`CREATE TABLE IF NOT EXISTS whatsapp_agendamentos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      phone VARCHAR(30) NOT NULL,
      cliente_id INT NULL,
      titulo VARCHAR(200) NOT NULL,
      descricao TEXT,
      data_hora DATETIME NOT NULL,
      status ENUM('agendado','confirmado','realizado','cancelado') DEFAULT 'agendado',
      vendedor_id INT NULL,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
      FOREIGN KEY (vendedor_id) REFERENCES usuarios(id) ON DELETE SET NULL,
      INDEX idx_phone (phone),
      INDEX idx_data (data_hora)
    )`);

    console.log('🛠️  Migração: tabelas WhatsApp Bot garantidas.');
  } catch (err) {
    // Sem banco acessível em dev a migração apenas é ignorada.
    console.error('⚠️  Migração de schema não aplicada:', err.code || err.message);
  }
}

module.exports = { garantirColunas };
