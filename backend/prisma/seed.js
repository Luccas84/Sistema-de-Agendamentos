// seed.js - Script para popular o banco de dados com dados iniciais
// Execute com: node prisma/seed.js (após configurar o banco)

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário padrão
  const usuario = await prisma.usuario.upsert({
    where: { email: 'admin@teste.com' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@teste.com',
      senha: 'senha123' // Em produção, deve ser criptografada
    }
  });
  console.log('✅ Usuário criado:', usuario);

  // Criar clientes de exemplo
  const cliente1 = await prisma.cliente.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nome: 'João Silva',
      telefone: '(11) 99999-9999',
      email: 'joao@email.com'
    }
  });
  console.log('✅ Cliente criado:', cliente1);

  const cliente2 = await prisma.cliente.upsert({
    where: { id: 2 },
    update: {},
    create: {
      nome: 'Maria Santos',
      telefone: '(11) 88888-8888',
      email: 'maria@email.com'
    }
  });
  console.log('✅ Cliente criado:', cliente2);

  // Criar serviços de exemplo
  const servico1 = await prisma.servico.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nome: 'Corte de Cabelo',
      preco: 30.00,
      duracao: 30
    }
  });
  console.log('✅ Serviço criado:', servico1);

  const servico2 = await prisma.servico.upsert({
    where: { id: 2 },
    update: {},
    create: {
      nome: 'Manicure',
      preco: 25.00,
      duracao: 45
    }
  });
  console.log('✅ Serviço criado:', servico2);

  const servico3 = await prisma.servico.upsert({
    where: { id: 3 },
    update: {},
    create: {
      nome: 'Pedicure',
      preco: 30.00,
      duracao: 45
    }
  });
  console.log('✅ Serviço criado:', servico3);

  // Criar agendamento de exemplo
  const agendamento1 = await prisma.agendamento.upsert({
    where: { id: 1 },
    update: {},
    create: {
      data: new Date('2024-12-20T10:00:00'),
      status: 'pendente',
      clienteId: cliente1.id,
      servicoId: servico1.id,
      usuarioId: usuario.id
    }
  });
  console.log('✅ Agendamento criado:', agendamento1);

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

