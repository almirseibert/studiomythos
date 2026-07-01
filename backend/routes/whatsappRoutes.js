const express = require('express');
const router = express.Router();
const whatsappService = require('../services/whatsappService');
const geminiService = require('../services/geminiService');
const conversaService = require('../services/conversaService');

const SUPER_ADMIN = 'almir.seibert@gmail.com';
const isAdmin = (u) => u && (u.papel === 'admin' || u.email === SUPER_ADMIN);

// ─── Bot ────────────────────────────────────────────────────────────────────

router.get('/status', (req, res) => {
  res.json({ success: true, data: whatsappService.getStatus() });
});

router.get('/qr', async (req, res) => {
  const img = await whatsappService.getQRImage();
  if (!img) return res.status(404).json({ success: false, error: 'QR Code indisponível. Bot já conectado ou ainda não iniciado.' });
  res.json({ success: true, qr: img });
});

router.post('/restart', async (req, res) => {
  try {
    await whatsappService.restart();
    res.json({ success: true, message: 'Bot reiniciando...' });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ─── Conversas ──────────────────────────────────────────────────────────────

router.get('/conversas', async (req, res) => {
  try {
    const admin = isAdmin(req.usuario);
    const vendedorId = admin ? null : (req.usuario?.id || null);
    res.json({ success: true, data: await conversaService.listarConversas(vendedorId, admin) });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// Inicia ou recupera uma conversa pelo número de telefone (usado ao clicar no telefone de um lead)
router.post('/conversas/iniciar', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ success: false, error: 'phone obrigatório' });
  try {
    const digits = phone.replace(/\D/g, '');
    const phoneId = `${digits.startsWith('55') ? digits : '55' + digits}@c.us`;
    const conversa = await conversaService.obterOuCriarConversa(phoneId);
    // Assume atendimento humano para que o vendedor possa digitar imediatamente
    await conversaService.atualizarModo(phoneId, 'humano_ativo', req.usuario?.id || null);
    const [atualizada] = await require('../config/db').query('SELECT * FROM whatsapp_conversas WHERE id = ?', [conversa.id]);
    res.json({ success: true, data: atualizada[0] });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/conversas/:id', async (req, res) => {
  try {
    const conversa = await conversaService.obterConversaPorId(req.params.id);
    if (!conversa) return res.status(404).json({ success: false, error: 'Conversa não encontrada' });
    const mensagens = await conversaService.listarMensagens(conversa.id, 100);
    res.json({ success: true, data: { conversa, mensagens } });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// Vendedor envia mensagem pelo painel
router.post('/conversas/:id/mensagem', async (req, res) => {
  const { mensagem } = req.body;
  if (!mensagem) return res.status(400).json({ success: false, error: 'mensagem é obrigatória' });
  try {
    const conversa = await conversaService.obterConversaPorId(req.params.id);
    if (!conversa) return res.status(404).json({ success: false, error: 'Conversa não encontrada' });
    await whatsappService.sendMessage(conversa.phone, mensagem, req.usuario?.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// Vendedor assume o atendimento
router.post('/conversas/:id/assumir', async (req, res) => {
  try {
    const conversa = await conversaService.obterConversaPorId(req.params.id);
    if (!conversa) return res.status(404).json({ success: false, error: 'Conversa não encontrada' });
    await conversaService.atualizarModo(conversa.phone, 'humano_ativo', req.usuario?.id);
    geminiService.limparCache(conversa.phone);
    res.json({ success: true, message: 'Atendimento assumido pelo vendedor' });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// Devolve conversa para a IA
router.post('/conversas/:id/devolver', async (req, res) => {
  try {
    const conversa = await conversaService.obterConversaPorId(req.params.id);
    if (!conversa) return res.status(404).json({ success: false, error: 'Conversa não encontrada' });
    await conversaService.atualizarModo(conversa.phone, 'ia_ativa', null);
    geminiService.limparCache(conversa.phone);
    res.json({ success: true, message: 'Conversa devolvida para a IA' });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// Vincula conversa a um cliente do CRM
router.post('/conversas/:id/vincular', async (req, res) => {
  const { cliente_id } = req.body;
  if (!cliente_id) return res.status(400).json({ success: false, error: 'cliente_id é obrigatório' });
  try {
    const conversa = await conversaService.obterConversaPorId(req.params.id);
    if (!conversa) return res.status(404).json({ success: false, error: 'Conversa não encontrada' });
    await conversaService.vincularClienteCRM(conversa.phone, cliente_id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ─── Agendamentos ───────────────────────────────────────────────────────────

router.get('/agendamentos', async (req, res) => {
  try {
    const filtros = {};
    if (req.query.status) filtros.status = req.query.status;
    if (req.query.phone)  filtros.phone  = req.query.phone;
    if (!isAdmin(req.usuario) && req.usuario?.id) filtros.vendedor_id = req.usuario.id;
    res.json({ success: true, data: await conversaService.listarAgendamentos(filtros) });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.patch('/agendamentos/:id', async (req, res) => {
  const campos = {};
  if (req.body.status)    campos.status    = req.body.status;
  if (req.body.titulo)    campos.titulo    = req.body.titulo;
  if (req.body.descricao) campos.descricao = req.body.descricao;
  if (req.body.data_hora) campos.data_hora = req.body.data_hora;
  if (!Object.keys(campos).length) return res.status(400).json({ success: false, error: 'Nenhum campo enviado' });
  try {
    await conversaService.atualizarAgendamento(req.params.id, campos);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ─── Memórias da IA ─────────────────────────────────────────────────────────

router.get('/memorias/:phone', async (req, res) => {
  try {
    const phone = decodeURIComponent(req.params.phone);
    const phoneId = phone.includes('@') ? phone : `${phone.replace(/\D/g, '')}@c.us`;
    res.json({ success: true, data: await conversaService.listarMemorias(phoneId) });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.delete('/memorias/:id', async (req, res) => {
  try {
    await conversaService.deletarMemoria(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

module.exports = router;
