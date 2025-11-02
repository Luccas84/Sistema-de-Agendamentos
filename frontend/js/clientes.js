// clientes.js - Lógica de gerenciamento de clientes
// Gerencia a listagem, criação, edição e exclusão de clientes

let clientes = [];
let modoEdicao = false;
let clienteEditandoId = null;

// API base URL - ajuste se necessário
const API_BASE = 'http://localhost:3000';

/**
 * Carrega a lista de clientes do backend
 */
async function carregarClientes() {
  try {
    const response = await fetch(`${API_BASE}/clientes`);
    if (!response.ok) throw new Error('Erro ao carregar clientes');
    
    clientes = await response.json();
    exibirClientes();
  } catch (error) {
    console.error('Erro:', error);
    mostrarMensagem('Erro ao carregar clientes. Verifique se o backend está rodando.', 'error');
    clientes = [];
    exibirClientes();
  }
}

/**
 * Exibe os clientes na tabela
 */
function exibirClientes() {
  const tbody = document.getElementById('clientes-tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  if (clientes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-state"><i class=\'bx bx-user-x\'></i><p>Nenhum cliente cadastrado</p></td></tr>';
    return;
  }
  
  clientes.forEach(cliente => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${cliente.nome}</td>
      <td>${cliente.telefone}</td>
      <td>${cliente.email || '-'}</td>
      <td>
        <button class="btn btn-secondary" onclick="editarCliente(${cliente.id})"><i class='bx bx-edit'></i> Editar</button>
        <button class="btn btn-danger" onclick="confirmarExclusao(${cliente.id})"><i class='bx bx-trash'></i> Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Submete o formulário de cliente (criar ou editar)
 */
async function salvarCliente(event) {
  event.preventDefault();
  
  const nome = document.getElementById('cliente-nome').value;
  const telefone = document.getElementById('cliente-telefone').value;
  const email = document.getElementById('cliente-email').value;
  
  if (!nome || !telefone) {
    mostrarMensagem('Nome e telefone são obrigatórios!', 'error');
    return;
  }
  
  const dados = { nome, telefone, email: email || null };
  
  try {
    let response;
    if (modoEdicao && clienteEditandoId) {
      // Atualizar
      response = await fetch(`${API_BASE}/clientes/${clienteEditandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
    } else {
      // Criar
      response = await fetch(`${API_BASE}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
    }
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao salvar cliente');
    }
    
    mostrarMensagem(modoEdicao ? 'Cliente atualizado com sucesso!' : 'Cliente criado com sucesso!', 'success');
    limparFormulario();
    carregarClientes();
  } catch (error) {
    console.error('Erro:', error);
    mostrarMensagem(error.message || 'Erro ao salvar cliente', 'error');
  }
}

/**
 * Edita um cliente existente
 */
function editarCliente(id) {
  const cliente = clientes.find(c => c.id === id);
  if (!cliente) return;
  
  modoEdicao = true;
  clienteEditandoId = id;
  
  document.getElementById('cliente-nome').value = cliente.nome;
  document.getElementById('cliente-telefone').value = cliente.telefone;
  document.getElementById('cliente-email').value = cliente.email || '';
  
  document.getElementById('btn-salvar-cliente').textContent = 'Atualizar Cliente';
  document.getElementById('btn-cancelar-cliente').style.display = 'inline-block';
  
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
  document.getElementById('form-cliente').reset();
  modoEdicao = false;
  clienteEditandoId = null;
  document.getElementById('btn-salvar-cliente').textContent = 'Cadastrar Cliente';
  document.getElementById('btn-cancelar-cliente').style.display = 'none';
}

/**
 * Confirma e executa a exclusão de um cliente
 */
async function confirmarExclusao(id) {
  const cliente = clientes.find(c => c.id === id);
  if (!cliente) return;
  
  if (!confirm(`Tem certeza que deseja excluir o cliente "${cliente.nome}"?`)) {
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/clientes/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao excluir cliente');
    }
    
    mostrarMensagem('Cliente excluído com sucesso!', 'success');
    carregarClientes();
  } catch (error) {
    console.error('Erro:', error);
    mostrarMensagem(error.message || 'Erro ao excluir cliente', 'error');
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

// Carrega clientes ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  carregarClientes();
});

