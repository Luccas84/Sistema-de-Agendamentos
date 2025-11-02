// login.js - Lógica de autenticação (simulada)
// Por enquanto, o login é simulado - futuramente será integrado com JWT

/**
 * Faz o login do usuário
 * ATENÇÃO: Esta é uma implementação simulada. Em produção, use autenticação JWT.
 */
function fazerLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const senha = document.getElementById('login-senha').value;
  const mensagemDiv = document.getElementById('mensagem-login');
  
  // Simulação simples - em produção, fazer requisição ao backend
  if (email && senha) {
    // Salva dados no localStorage (simulado)
    localStorage.setItem('usuarioLogado', JSON.stringify({
      email: email,
      nome: email.split('@')[0] // Usa parte do email como nome
    }));
    
    mostrarMensagem('Login realizado com sucesso! Redirecionando...', 'success');
    
    // Redireciona após 1 segundo
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } else {
    mostrarMensagem('Por favor, preencha todos os campos.', 'error');
  }
}

/**
 * Registra um novo usuário
 * ATENÇÃO: Esta é uma implementação simulada. Em produção, criar endpoint no backend.
 */
function fazerRegistro(event) {
  event.preventDefault();
  
  const nome = document.getElementById('reg-nome').value;
  const email = document.getElementById('reg-email').value;
  const senha = document.getElementById('reg-senha').value;
  const mensagemDiv = document.getElementById('mensagem-login');
  
  if (nome && email && senha && senha.length >= 6) {
    // Simulação - em produção, criar endpoint no backend
    localStorage.setItem('usuarioLogado', JSON.stringify({
      email: email,
      nome: nome
    }));
    
    mostrarMensagem('Registro realizado com sucesso! Redirecionando...', 'success');
    
    // Redireciona após 1 segundo
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } else {
    mostrarMensagem('Por favor, preencha todos os campos corretamente. Senha deve ter no mínimo 6 caracteres.', 'error');
  }
}

/**
 * Mostra mensagem de feedback
 */
function mostrarMensagem(mensagem, tipo) {
  const mensagemDiv = document.getElementById('mensagem-login');
  const icon = tipo === 'success' ? '<i class=\'bx bx-check-circle\'></i>' : '<i class=\'bx bx-error-circle\'></i>';
  mensagemDiv.className = `alert alert-${tipo === 'success' ? 'success' : 'error'}`;
  mensagemDiv.innerHTML = `${icon} ${mensagem}`;
  mensagemDiv.style.display = 'block';
  
  // Remove a mensagem após 5 segundos
  setTimeout(() => {
    mensagemDiv.style.display = 'none';
  }, 5000);
}

// Verifica se já está logado ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  const usuarioLogado = localStorage.getItem('usuarioLogado');
  if (usuarioLogado && window.location.pathname.includes('login.html')) {
    // Se já está logado, pode redirecionar ou deixar fazer logout
    console.log('Usuário já está logado');
  }
});

