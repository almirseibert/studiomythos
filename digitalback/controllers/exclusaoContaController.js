const dbPool = require('../config/db');

const APPS_VALIDOS = ['meu-lava-rapido', 'missao-cumprida', 'gestao-de-frota', 'check-list'];

const exclusaoContaController = {
  // POST /api/publico/exclusao-conta  (público, sem token)
  criar: async (req, res) => {
    const b = req.body || {};
    if (!b.nome?.trim() || !b.email?.trim()) {
      return res.status(400).json({ success: false, error: 'Nome e e-mail são obrigatórios.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(b.email)) {
      return res.status(400).json({ success: false, error: 'E-mail inválido.' });
    }
    const app = APPS_VALIDOS.includes(b.app) ? b.app : 'meu-lava-rapido';
    try {
      await dbPool.query(
        `INSERT INTO exclusoes_conta (app, nome, email, motivo) VALUES (?, ?, ?, ?)`,
        [app, b.nome.trim(), b.email.trim().toLowerCase(), b.motivo?.trim() || null]
      );
      res.status(201).json({ success: true, mensagem: 'Solicitação recebida. Processaremos em até 15 dias úteis.' });
    } catch (error) {
      console.error('Erro ao salvar solicitação de exclusão:', error);
      res.status(500).json({ success: false, error: 'Erro ao registrar a solicitação.' });
    }
  },

  // GET /api/admin/exclusoes-conta
  listar: async (req, res) => {
    try {
      const [rows] = await dbPool.query(
        `SELECT id, app, nome, email, motivo, status, data_criacao
         FROM exclusoes_conta ORDER BY data_criacao DESC`
      );
      res.json({ success: true, data: rows });
    } catch (error) {
      console.error('Erro ao listar exclusões:', error);
      res.status(500).json({ success: false, error: 'Erro ao buscar solicitações.' });
    }
  },

  // PUT /api/admin/exclusoes-conta/:id/status
  atualizarStatus: async (req, res) => {
    const STATUS_VALIDOS = ['Pendente', 'Em andamento', 'Concluído', 'Cancelado'];
    const { status } = req.body || {};
    if (!STATUS_VALIDOS.includes(status)) {
      return res.status(400).json({ success: false, error: 'Status inválido.' });
    }
    try {
      await dbPool.query('UPDATE exclusoes_conta SET status = ? WHERE id = ?', [status, req.params.id]);
      res.json({ success: true, mensagem: 'Status atualizado.' });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      res.status(500).json({ success: false, error: 'Erro ao atualizar o status.' });
    }
  },
};

module.exports = exclusaoContaController;
