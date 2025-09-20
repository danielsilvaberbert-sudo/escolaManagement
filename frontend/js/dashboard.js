async function loadDashboard() {
  try {
    const res = await fetch('/api/auth/dashboardDados', {
        credentials: 'include' // <- importante para enviar cookies HTTP-only
        });
        console.log(res);
    if (!res.ok) throw new Error('Não autorizado');

    const data = await res.json();
    const user = data.user;

    document.getElementById('welcomeMsg').textContent = `Bem-vindo, ${user.nome}!`;

    if (user.tipo === 'Administrador') {
      document.getElementById('adminContent').classList.remove('d-none');
    }

    if (data.disciplinas?.length > 0) {
      document.getElementById('instrutorContent').classList.remove('d-none');
      const list = document.getElementById('disciplinasList');
      list.innerHTML = ''; // limpa antes de preencher

      data.disciplinas.forEach(disc => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.textContent = disc;

        const btn = document.createElement('button');
        btn.className = 'btn btn-sm btn-primary';
        btn.textContent = 'Fazer Chamada';

        btn.addEventListener('click', () => {
          // Armazena a disciplina selecionada no localStorage ou sessionStorage
          localStorage.setItem('disciplinaSelecionada', disc);
          // Redireciona para a página de frequência
          window.location.href = `/api/frequencia?disciplina=${encodeURIComponent(disc)}`;
        });

        li.appendChild(btn);
        list.appendChild(li);
      });
    }

  } catch (err) {
    const alert = document.getElementById('alert');
    alert.textContent = err.message;
    alert.classList.remove('d-none');
    setTimeout(() => window.location.href = '/', 2000);
  }
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  fetch('/api/auth/logout', { method: 'POST' })
    .finally(() => window.location.href = '/');
});

window.addEventListener('DOMContentLoaded', loadDashboard);
