document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const disciplinaSelecionada = urlParams.get('disciplina');
  const disciplina = disciplinaSelecionada ? decodeURIComponent(disciplinaSelecionada) : '';
  document.getElementById('disciplina').value = disciplina;

  if (!disciplina) {
    alert('Nenhuma disciplina selecionada');
    window.location.href = '/api/dashboard';
    return;
  }

  // Declara alunos fora do try para ficar disponível no listener
  let alunos = [];

  try {
    const res = await fetch(`/api/alunosDisciplina?disciplina=${encodeURIComponent(disciplina)}`, {
      credentials: 'include'
    });

    if (!res.ok) throw new Error('Erro ao carregar alunos');

    alunos = await res.json();
    const alunosListDiv = document.getElementById('alunosList');
    alunosListDiv.innerHTML = '';

    alunos.forEach(aluno => {
      const div = document.createElement('div');
      div.classList.add('form-check');

      div.innerHTML = `
        <input class="form-check-input" type="checkbox" value="${aluno}" id="aluno_${aluno}">
        <label class="form-check-label" for="aluno_${aluno}">${aluno}</label>
      `;

      alunosListDiv.appendChild(div);
    });

  } catch (err) {
    const alertDiv = document.getElementById('alert');
    alertDiv.classList.remove('d-none');
    alertDiv.classList.add('alert-danger');
    alertDiv.textContent = err.message;
  }

  // Salvar frequência
  document.getElementById('salvarBtn').addEventListener('click', async () => {
    const dataAula = document.getElementById('dataAula').value;

    const presencas = alunos.map(aluno => ({
      aluno,
      presente: document.getElementById(`aluno_${aluno}`).checked
    }));

    try {
      const res = await fetch('/api/frequencia/salvar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ disciplina, data: dataAula, presencas })
      });

      const dataRes = await res.json();
      const alertDiv = document.getElementById('alert');
      alertDiv.classList.remove('d-none');

      if (res.ok) {
        alertDiv.classList.remove('alert-danger');
        alertDiv.classList.add('alert-success');
        alertDiv.textContent = dataRes.message;
      } else {
        alertDiv.classList.remove('alert-success');
        alertDiv.classList.add('alert-danger');
        alertDiv.textContent = dataRes.error;
      }

    } catch (err) {
      const alertDiv = document.getElementById('alert');
      alertDiv.classList.remove('d-none');
      alertDiv.classList.add('alert-danger');
      alertDiv.textContent = err.message;
    }
  });
});
