// agendamentos.js - Lógica de gerenciamento de agendamentos
// Gerencia a listagem, criação, edição e exclusão de agendamentos

let agendamentos = [];
let clientes = [];
let servicos = [];
let usuarios = [];
let modoEdicao = false;
let agendamentoEditandoId = null;

// API base URL
const API_BASE = 'http://localhost:3000';

// Usuário padrão (em produção, viria do login)
const USUARIO_PADRAO_ID = 1;

/**
 * Carrega todos os dados necessários (clientes, serviços, agendamentos)
 */
async function carregarDados() {
  try {
    const [clientesRes, servicosRes, agendamentosRes] = await Promise.all([
      fetch(`${API_BASE}/clientes`),
      fetch(`${API_BASE}/servicos`),
      fetch(`${API_BASE}/agendamentos`)
    ]);
    
    if (!clientesRes.ok || !servicosRes.ok || !agendamentosRes.ok) {
      throw new Error('Erro ao carregar dados');
    }
    
    clientes = await clientesRes.json();
    servicos = await servicosRes.json();
    agendamentos = await agendamentosRes.json();
    
    preencherSelects();
    exibirAgendamentos();
  } catch (error) {
    console.error('Erro:', error);
    mostrarMensagem('Erro ao carregar dados. Verifique se o backend está rodando.', 'error');
    clientes = [];
    servicos = [];
    agendamentos = [];
    preencherSelects();
    exibirAgendamentos();
  }
}

/**
 * Preenche os selects de cliente e serviço
 */
function preencherSelects() {
  const selectCliente = document.getElementById('agendamento-cliente');
  const selectServico = document.getElementById('agendamento-servico');
  
  if (selectCliente) {
    selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';
    clientes.forEach(cliente => {
      const option = document.createElement('option');
      option.value = cliente.id;
      option.textContent = cliente.nome;
      selectCliente.appendChild(option);
    });
  }
  
  if (selectServico) {
    selectServico.innerHTML = '<option value="">Selecione um serviço</option>';
    servicos.forEach(servico => {
      const option = document.createElement('option');
      option.value = servico.id;
      option.textContent = `${servico.nome} - R$ ${servico.preco.toFixed(2)}`;
      selectServico.appendChild(option);
    });
  }
}

/**
 * Exibe os agendamentos na tabela
 */
function exibirAgendamentos() {
  const tbody = document.getElementById('agendamentos-tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  if (agendamentos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state"><i class=\'bx bx-calendar-x\'></i><p>Nenhum agendamento cadastrado</p></td></tr>';
    return;
  }
  
  agendamentos.forEach(agendamento => {
    const tr = document.createElement('tr');
    const dataFormatada = new Date(agendamento.data).toLocaleString('pt-BR');
    const statusClass = getStatusClass(agendamento.status);
    
    tr.innerHTML = `
      <td>${agendamento.cliente?.nome || 'N/A'}</td>
      <td>${agendamento.servico?.nome || 'N/A'}</td>
      <td>${dataFormatada}</td>
      <td><span class="status-badge ${statusClass}">${getStatusIcon(agendamento.status)} ${agendamento.status}</span></td>
      <td>${agendamento.usuario?.nome || 'N/A'}</td>
      <td>
        <button class="btn btn-secondary" onclick="editarAgendamento(${agendamento.id})"><i class='bx bx-edit'></i> Editar</button>
        <button class="btn btn-danger" onclick="confirmarExclusao(${agendamento.id})"><i class='bx bx-trash'></i> Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Retorna a classe CSS baseada no status
 */
function getStatusClass(status) {
  const statusClasses = {
    'pendente': 'status-pendente',
    'confirmado': 'status-confirmado',
    'cancelado': 'status-cancelado',
    'concluido': 'status-concluido'
  };
  return statusClasses[status] || '';
}

function getStatusIcon(status) {
  const statusIcons = {
    'pendente': '<i class=\'bx bx-time-five\'></i>',
    'confirmado': '<i class=\'bx bx-check-circle\'></i>',
    'cancelado': '<i class=\'bx bx-x-circle\'></i>',
    'concluido': '<i class=\'bx bx-check-double\'></i>'
  };
  return statusIcons[status] || '';
}

/**
 * Submete o formulário de agendamento (criar ou editar)
 */
async function salvarAgendamento(event) {
  event.preventDefault();
  
  const clienteId = document.getElementById('agendamento-cliente').value;
  const servicoId = document.getElementById('agendamento-servico').value;
  const data = document.getElementById('agendamento-data').value;
  const hora = document.getElementById('agendamento-hora').value;
  const status = document.getElementById('agendamento-status').value;
  
  if (!clienteId || !servicoId || !data || !hora) {
    mostrarMensagem('Todos os campos são obrigatórios!', 'error');
    return;
  }
  
  // Combina data e hora
  const dataHora = new Date(`${data}T${hora}`);
  
  const dados = {
    data: dataHora.toISOString(),
    status: status || 'pendente',
    clienteId: parseInt(clienteId),
    servicoId: parseInt(servicoId),
    usuarioId: USUARIO_PADRAO_ID // Em produção, viria da sessão
  };
  
  try {
    let response;
    if (modoEdicao && agendamentoEditandoId) {
      // Atualizar
      response = await fetch(`${API_BASE}/agendamentos/${agendamentoEditandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
    } else {
      // Criar
      response = await fetch(`${API_BASE}/agendamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
    }
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao salvar agendamento');
    }
    
    mostrarMensagem(modoEdicao ? 'Agendamento atualizado com sucesso!' : 'Agendamento criado com sucesso!', 'success');
    limparFormulario();
    carregarDados();
  } catch (error) {
    console.error('Erro:', error);
    mostrarMensagem(error.message || 'Erro ao salvar agendamento', 'error');
  }
}

/**
 * Edita um agendamento existente
 */
function editarAgendamento(id) {
  const agendamento = agendamentos.find(a => a.id === id);
  if (!agendamento) return;
  
  modoEdicao = true;
  agendamentoEditandoId = id;
  
  // Converte a data para o formato do input
  const dataHora = new Date(agendamento.data);
  const dataStr = dataHora.toISOString().split('T')[0];
  const horaStr = dataHora.toTimeString().slice(0, 5);
  
  document.getElementById('agendamento-cliente').value = agendamento.clienteId;
  document.getElementById('agendamento-servico').value = agendamento.servicoId;
  document.getElementById('agendamento-data').value = dataStr;
  document.getElementById('agendamento-hora').value = horaStr;
  document.getElementById('agendamento-status').value = agendamento.status;
  
  document.getElementById('btn-salvar-agendamento').textContent = 'Atualizar Agendamento';
  document.getElementById('btn-cancelar-agendamento').style.display = 'inline-block';
  
  // Scroll para o formulário
  document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Cancela a edição e limpa o formulário
 */
function cancelarEdicao() {
  limparFormulario();
}

/**
 * Limpa o formulário e reseta o modo de edição
 */
function limparFormulario() {
  document.getElementById('form-agendamento').reset();
  modoEdicao = false;
  agendamentoEditandoId = null;
  document.getElementById('btn-salvar-agendamento').textContent = 'Criar Agendamento';
  document.getElementById('btn-cancelar-agendamento').style.display = 'none';
}

/**
 * Confirma e executa a exclusão de um agendamento
 */
async function confirmarExclusao(id) {
  const agendamento = agendamentos.find(a => a.id === id);
  if (!agendamento) return;
  
  if (!confirm(`Tem certeza que deseja excluir este agendamento?`)) {
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/agendamentos/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao excluir agendamento');
    }
    
    mostrarMensagem('Agendamento excluído com sucesso!', 'success');
    carregarDados();
  } catch (error) {
    console.error('Erro:', error);
    mostrarMensagem(error.message || 'Erro ao excluir agendamento', 'error');
  }
}

/**
 * Mostra mensagem de feedback
 */
function mostrarMensagem(mensagem, tipo) {
  const mensagemDiv = document.getElementById('mensagem');
  if (!mensagemDiv) return;
  
  const icon = tipo === 'success' ? '<i class=\'bx bx-check-circle\'></i>' : '<i class=\'bx bx-error-circle\'></i>';
  mensagemDiv.className = `alert alert-${tipo === 'success' ? 'success' : 'error'}`;
  mensagemDiv.innerHTML = `${icon} ${mensagem}`;
  mensagemDiv.style.display = 'block';
  
  setTimeout(() => {
    mensagemDiv.style.display = 'none';
  }, 5000);
}

// Carrega dados ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  carregarDados();
});

