const API_URL = 'http://localhost:3000';

async function login(email, senha) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao fazer login');
    }
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = 'index.html';
  } catch (error) {
    alert(error.message);
    console.error('Erro no login:', error);
  }
}

async function register(nome, email, senha) {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    });
    
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = 'index.html';
    } else {
      alert(data.error);
    }
  } catch (error) {
    alert('Erro ao criar conta');
  }
}

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  await login(email, senha);
});

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  await register(nome, email, senha);
});

// Adicionar função para mostrar/ocultar senha
document.querySelectorAll('.toggle-password').forEach(button => {
  button.addEventListener('click', e => {
    const input = e.currentTarget.parentNode.querySelector('input');
    const icon = e.currentTarget.querySelector('i');
    
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  });
});
