// Rotas de PROJETOS (admin) — montadas atrás de verificarToken + exigirAdmin.
// Gerenciam os cards da Central de Aplicativos e o upload dos arquivos do site.
const express = require('express');
const multer = require('multer');
const router = express.Router();
const projetoController = require('../controllers/projetoController');

// Upload em memória (o controller grava no disco). Limite 50 MB.
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 },
});

router.get('/', projetoController.listar);
router.post('/', upload.single('arquivo'), projetoController.criar);
router.put('/:id', upload.single('arquivo'), projetoController.atualizar);
router.delete('/:id', projetoController.remover);

module.exports = router;
