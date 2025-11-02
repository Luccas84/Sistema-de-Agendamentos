// server.js - Servidor principal do backend
// Este arquivo configura e inicia o servidor Express com todas as rotas

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importa as rotas
const clientesRoutes = require('./routes/clientes');
const servicosRoutes = require('./routes/servicos');
const agendamentosRoutes = require('./routes/agendamentos');

// Cria a aplicação Express
const app = express();
const PORT = 3000;

// Middlewares globais
app.use(cors()); // Permite requisições de outros domínios (frontend)
app.use(bodyParser.json()); // Converte requisições JSON em objetos JavaScript
app.use(bodyParser.urlencoded({ extended: true })); // Para formulários HTML

// Rotas da API
app.use('/clientes', clientesRoutes);
app.use('/servicos', servicosRoutes);
app.use('/agendamentos', agendamentosRoutes);

// Rota de teste para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.json({ 
    message: 'API do Sistema de Agendamentos está funcionando!',
    endpoints: {
      clientes: '/clientes',
      servicos: '/servicos',
      agendamentos: '/agendamentos'
    }
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}/clientes`);
  console.log(`📡 API disponível em http://localhost:${PORT}/servicos`);
  console.log(`📡 API disponível em http://localhost:${PORT}/agendamentos`);
});

