// Rotas PÚBLICAS (sem token): recebem envios do site (currículos, orçamentos e exclusões).
const express = require('express');
const router = express.Router();
const curriculoController = require('../controllers/curriculoController');
const orcamentoController = require('../controllers/orcamentoController');
const exclusaoContaController = require('../controllers/exclusaoContaController');

router.post('/curriculos', curriculoController.criar);
router.post('/orcamentos', orcamentoController.criar);
router.post('/exclusao-conta', exclusaoContaController.criar);

module.exports = router;
