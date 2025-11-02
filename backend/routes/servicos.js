// routes/servicos.js - Rotas relacionadas a serviços
// Define os endpoints HTTP para operações CRUD de serviços

const express = require('express');
const router = express.Router();
const servicosController = require('../controllers/servicosController');

// GET /servicos - Lista todos os serviços
router.get('/', servicosController.listar);

// GET /servicos/:id - Busca um serviço específico por ID
router.get('/:id', servicosController.buscarPorId);

// POST /servicos - Cria um novo serviço
router.post('/', servicosController.criar);

// PUT /servicos/:id - Atualiza um serviço existente
router.put('/:id', servicosController.atualizar);

// DELETE /servicos/:id - Remove um serviço
router.delete('/:id', servicosController.remover);

module.exports = router;

