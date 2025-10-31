// routes/clientes.js - Rotas relacionadas a clientes
// Define os endpoints HTTP para operações CRUD de clientes

const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');

// GET /clientes - Lista todos os clientes
router.get('/', clientesController.listar);

// GET /clientes/:id - Busca um cliente específico por ID
router.get('/:id', clientesController.buscarPorId);

// POST /clientes - Cria um novo cliente
router.post('/', clientesController.criar);

// PUT /clientes/:id - Atualiza um cliente existente
router.put('/:id', clientesController.atualizar);

// DELETE /clientes/:id - Remove um cliente
router.delete('/:id', clientesController.remover);

module.exports = router;

