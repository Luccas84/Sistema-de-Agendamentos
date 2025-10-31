// controllers/clientesController.js - Lógica de negócio para clientes
// Este controller gerencia todas as operações relacionadas a clientes no banco de dados

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Lista todos os clientes cadastrados
 */
async function listar(req, res) {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { nome: 'asc' }
    });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar clientes: ' + error.message });
  }
}

/**
 * Busca um cliente específico por ID
 */
async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const cliente = await prisma.cliente.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cliente: ' + error.message });
  }
}

/**
 * Cria um novo cliente
 */
async function criar(req, res) {
  try {
    const { nome, telefone, email } = req.body;
    
    if (!nome || !telefone) {
      return res.status(400).json({ error: 'Nome e telefone são obrigatórios' });
    }
    
    const cliente = await prisma.cliente.create({
      data: {
        nome,
        telefone,
        email: email || null
      }
    });
    
    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar cliente: ' + error.message });
  }
}

/**
 * Atualiza um cliente existente
 */
async function atualizar(req, res) {
  try {
    const { id } = req.params;
    const { nome, telefone, email } = req.body;
    
    const cliente = await prisma.cliente.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        telefone,
        email: email || null
      }
    });
    
    res.json(cliente);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao atualizar cliente: ' + error.message });
  }
}

/**
 * Remove um cliente
 */
async function remover(req, res) {
  try {
    const { id } = req.params;
    
    await prisma.cliente.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Cliente removido com sucesso' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao remover cliente: ' + error.message });
  }
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover
};

