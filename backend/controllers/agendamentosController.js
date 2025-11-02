// controllers/agendamentosController.js - Lógica de negócio para agendamentos
// Este controller gerencia todas as operações relacionadas a agendamentos no banco de dados

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Lista todos os agendamentos cadastrados
 * Inclui informações relacionadas de cliente, serviço e usuário
 */
async function listar(req, res) {
  try {
    const agendamentos = await prisma.agendamento.findMany({
      include: {
        cliente: true,
        servico: true,
        usuario: true
      },
      orderBy: { data: 'asc' }
    });
    res.json(agendamentos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar agendamentos: ' + error.message });
  }
}

/**
 * Busca um agendamento específico por ID
 */
async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: parseInt(id) },
      include: {
        cliente: true,
        servico: true,
        usuario: true
      }
    });
    
    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    
    res.json(agendamento);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar agendamento: ' + error.message });
  }
}

/**
 * Cria um novo agendamento
 */
async function criar(req, res) {
  try {
    const { data, status, clienteId, servicoId, usuarioId } = req.body;
    
    if (!data || !clienteId || !servicoId || !usuarioId) {
      return res.status(400).json({ 
        error: 'Data, cliente, serviço e usuário são obrigatórios' 
      });
    }
    
    const agendamento = await prisma.agendamento.create({
      data: {
        data: new Date(data),
        status: status || 'pendente',
        clienteId: parseInt(clienteId),
        servicoId: parseInt(servicoId),
        usuarioId: parseInt(usuarioId)
      },
      include: {
        cliente: true,
        servico: true,
        usuario: true
      }
    });
    
    res.status(201).json(agendamento);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar agendamento: ' + error.message });
  }
}

/**
 * Atualiza um agendamento existente
 * Permite atualizar data e status
 */
async function atualizar(req, res) {
  try {
    const { id } = req.params;
    const { data, status, clienteId, servicoId } = req.body;
    
    const updateData = {};
    if (data) updateData.data = new Date(data);
    if (status) updateData.status = status;
    if (clienteId) updateData.clienteId = parseInt(clienteId);
    if (servicoId) updateData.servicoId = parseInt(servicoId);
    
    const agendamento = await prisma.agendamento.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        cliente: true,
        servico: true,
        usuario: true
      }
    });
    
    res.json(agendamento);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao atualizar agendamento: ' + error.message });
  }
}

/**
 * Remove um agendamento
 */
async function remover(req, res) {
  try {
    const { id } = req.params;
    
    await prisma.agendamento.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Agendamento removido com sucesso' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao remover agendamento: ' + error.message });
  }
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover
};

