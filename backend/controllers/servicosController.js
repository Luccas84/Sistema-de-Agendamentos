// controllers/servicosController.js - Lógica de negócio para serviços
// Este controller gerencia todas as operações relacionadas a serviços no banco de dados

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Lista todos os serviços cadastrados
 */
async function listar(req, res) {
  try {
    const servicos = await prisma.servico.findMany({
      orderBy: { nome: 'asc' }
    });
    res.json(servicos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar serviços: ' + error.message });
  }
}

/**
 * Busca um serviço específico por ID
 */
async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const servico = await prisma.servico.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!servico) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }
    
    res.json(servico);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar serviço: ' + error.message });
  }
}

/**
 * Cria um novo serviço
 */
async function criar(req, res) {
  try {
    const { nome, preco, duracao } = req.body;
    
    if (!nome || !preco || !duracao) {
      return res.status(400).json({ error: 'Nome, preço e duração são obrigatórios' });
    }
    
    const servico = await prisma.servico.create({
      data: {
        nome,
        preco: parseFloat(preco),
        duracao: parseInt(duracao)
      }
    });
    
    res.status(201).json(servico);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar serviço: ' + error.message });
  }
}

/**
 * Atualiza um serviço existente
 */
async function atualizar(req, res) {
  try {
    const { id } = req.params;
    const { nome, preco, duracao } = req.body;
    
    const servico = await prisma.servico.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        preco: parseFloat(preco),
        duracao: parseInt(duracao)
      }
    });
    
    res.json(servico);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao atualizar serviço: ' + error.message });
  }
}

/**
 * Remove um serviço
 */
async function remover(req, res) {
  try {
    const { id } = req.params;
    
    await prisma.servico.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Serviço removido com sucesso' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao remover serviço: ' + error.message });
  }
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover
};

