// servicos.js - Lógica de gerenciamento de serviços
// Gerencia a listagem, criação, edição e exclusão de serviços

let servicos = [];
let modoEdicao = false;
let servicoEditandoId = null;

// API base URL
const API_BASE = 'http://localhost:3000';

/**
 * Carrega a lista de serviços do backend
 */
async function carregarServicos() {
  try {
    const response = await fetch(`${API_BASE}/servicos`);
    if (!response.ok) throw new Error('Erro ao carregar serviços');
    
    servicos = await response.json();
    exibirServicos();
  } catch (error) {
    console.error('Erro:', error);
    mostrarMensagem('Erro ao carregar serviços. Verifique se o backend está rodando.', 'error');
    servicos = [];
    exibirServicos();
  }
}

/**
 * Exibe os serviços na tabela
 */
function exibirServicos() {
  const tbody = document.getElementById('servicos-tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  if (servicos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-state"><i class=\'bx bx-briefcase-alt-2\'></i><p>Nenhum serviço cadastrado</p></td></tr>';
    return;
  }
  
  servicos.forEach(servico => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${servico.nome}</td>
      <td>R$ ${servico.preco.toFixed(2).replace('.', ',')}</td>
      <td>${servico.duracao} min</td>
      <td>
        <button class="btn btn-secondary" onclick="editarServico(${servico.id})"><i class='bx bx-edit'></i> Editar</button>
        <button class="btn btn-danger" onclick="confirmarExclusao(${servico.id})"><i class='bx bx-trash'></i> Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Submete o formulário de serviço (criar ou editar)
 */
async function salvarServico(event) {
  event.preventDefault();
  
  const nome = document.getElementById('servico-nome').value;
  const preco = document.getElementById('servico-preco').value;
  const duracao = document.getElementById('servico-duracao').value;
  
  if (!nome || !preco || !duracao) {
    mostrarMensagem('Todos os campos são obrigatórios!', 'error');
    return;
  }
  
  const dados = { 
    nome, 
    preco: parseFloat(preco), 
    duracao: parseInt(duracao) 
  };
  
  try {
    let response;
    if (modoEdicao && servicoEditandoId) {
      // Atualizar
      response = await fetch(`${API_BASE}/servicos/${servicoEditandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
    } else {
      // Criar
      response = await fetch(`${API_BASE}/servicos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
    }
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao salvar serviço');
    }
    
    mostrarMensagem(modoEdicao ? 'Serviço atualizado com sucesso!' : 'Serviço criado com sucesso!', 'success');
    limparFormulario();
    carregarServicos();
  } catch (error) {
    console.error('Erro:', error);
    mostrarMensagem(error.message || 'Erro ao salvar serviço', 'error');
  }
}

/**
 * Edita um serviço existente
 */
function editarServico(id) {
  const servico = servicos.find(s => s.id === id);
  if (!servico) return;
  
  modoEdicao = true;
  servicoEditandoId = id;
  
  document.getElementById('servico-nome').value = servico.nome;
  document.getElementById('servico-preco').value = servico.preco;
  document.getElementById('servico-duracao').value = servico.duracao;
  
  document.getElementById('btn-salvar-servico').textContent = 'Atualizar Serviço';
  document.getElementById('btn-cancelar-servico').style.display = 'inline-block';
  
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
  document.getElementById('form-servico').reset();
  modoEdicao = false;
  servicoEditandoId = null;
  document.getElementById('btn-salvar-servico').textContent = 'Cadastrar Serviço';
  document.getElementById('btn-cancelar-servico').style.display = 'none';
}

/**
 * Confirma e executa a exclusão de um serviço
 */
async function confirmarExclusao(id) {
  const servico = servicos.find(s => s.id === id);
  if (!servico) return;
  
  if (!confirm(`Tem certeza que deseja excluir o serviço "${servico.nome}"?`)) {
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/servicos/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao excluir serviço');
    }
    
    mostrarMensagem('Serviço excluído com sucesso!', 'success');
    carregarServicos();
  } catch (error) {
    console.error('Erro:', error);
    mostrarMensagem(error.message || 'Erro ao excluir serviço', 'error');
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

// Carrega serviços ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  carregarServicos();
});

