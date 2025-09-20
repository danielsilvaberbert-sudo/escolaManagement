document.getElementById('formDisciplina').addEventListener('submit', async (e) => {
  e.preventDefault();
  const disciplina = document.getElementById('disciplina').value;

  const token = localStorage.getItem('token'); // JWT

  const res = await fetch('/api/disciplinas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ disciplina })
  });

  const data = await res.json();
  alert(data.message || data.error);
});

async function carregarInstrutores() {
  const token = localStorage.getItem('token');

  const res = await fetch('/api/users/instrutores', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const instrutores = await res.json();

  const select = document.getElementById('instrutorSelect');
  instrutores.forEach(instrutor => {
    const option = document.createElement('option');
    option.value = instrutor.username;
    option.textContent = instrutor.nome;
    select.appendChild(option);
  });
}

carregarInstrutores();