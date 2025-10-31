// api.js - Cliente HTTP para comunicação com a API backend
// Centraliza todas as requisições HTTP usando fetch API

const API_BASE_URL = 'http://localhost:3000';

/**
 * Função genérica para fazer requisições HTTP
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisição');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Clientes API
 */
const clientesAPI = {
  listar: () => request('/clientes'),
  buscar: (id) => request(`/clientes/${id}`),
  criar: (dados) => request('/clientes', { method: 'POST', body: JSON.stringify(dados) }),
  atualizar: (id, dados) => request(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
  remover: (id) => request(`/clientes/${id}`, { method: 'DELETE' })
};

/**
 * Serviços API
 */
const servicosAPI = {
  listar: () => request('/servicos'),
  buscar: (id) => request(`/servicos/${id}`),
  criar: (dados) => request('/servicos', { method: 'POST', body: JSON.stringify(dados) }),
  atualizar: (id, dados) => request(`/servicos/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
  remover: (id) => request(`/servicos/${id}`, { method: 'DELETE' })
};

/**
 * Agendamentos API
 */
const agendamentosAPI = {
  listar: () => request('/agendamentos'),
  buscar: (id) => request(`/agendamentos/${id}`),
  criar: (dados) => request('/agendamentos', { method: 'POST', body: JSON.stringify(dados) }),
  atualizar: (id, dados) => request(`/agendamentos/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
  remover: (id) => request(`/agendamentos/${id}`, { method: 'DELETE' })
};

// Exporta as APIs para uso nos outros arquivos JS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { clientesAPI, servicosAPI, agendamentosAPI };
}

