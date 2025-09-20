// frontend/js/loginController.js
import { Auth } from './auth.js';
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;
      
      try {
        // Mostrar loading
        const loginBtn = document.getElementById('loginButton');
        loginBtn.disabled = true;
        
        await Auth.login(username, password);
        
        // Redirecionar após login bem-sucedido
        window.location.href = '/api/auth/dashboard';
      } catch (error) {
        // Mostrar erro para o usuário
        const alertDiv = document.getElementById('loginAlert');
        if (alertDiv) {
          alertDiv.textContent = error.message;
          alertDiv.classList.remove('d-none');
        }
      } finally {
        const loginBtn = document.getElementById('loginButton');
        if (loginBtn) loginBtn.disabled = false;
      }
    });
  }
});