// routes/agendamentos.js - Rotas relacionadas a agendamentos
// Define os endpoints HTTP para operações CRUD de agendamentos

const express = require('express');
const router = express.Router();
const agendamentosController = require('../controllers/agendamentosController');

// GET /agendamentos - Lista todos os agendamentos
router.get('/', agendamentosController.listar);

// GET /agendamentos/:id - Busca um agendamento específico por ID
router.get('/:id', agendamentosController.buscarPorId);

// POST /agendamentos - Cria um novo agendamento
router.post('/', agendamentosController.criar);

// PUT /agendamentos/:id - Atualiza um agendamento existente
router.put('/:id', agendamentosController.atualizar);

// DELETE /agendamentos/:id - Remove um agendamento
router.delete('/:id', agendamentosController.remover);

module.exports = router;

