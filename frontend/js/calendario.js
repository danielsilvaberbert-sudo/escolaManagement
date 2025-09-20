document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/disciplinasInstrutor', {
      credentials: 'include'
    });

    if (!res.ok) throw new Error('Erro ao carregar disciplinas');

    const disciplinas = await res.json();
    const selectDisciplina = document.getElementById('disciplina');

    disciplinas.forEach(d => {
      const option = document.createElement('option');
      option.value = d;
      option.textContent = d;
      selectDisciplina.appendChild(option);
    });

  } catch (err) {
    console.error(err);
    alert('Erro ao carregar disciplinas do instrutor');
  }
});

document.getElementById('salvarBtn').addEventListener('click', async () => {
  const disciplina = document.getElementById('disciplina').value.trim();
  const diasSemana = [...document.querySelectorAll('input[type=checkbox]:checked')]
                      .map(chk => parseInt(chk.value));
  const dataInicio = document.getElementById('dataInicio').value;
  const dataFim = document.getElementById('dataFim').value;

  if (!disciplina || diasSemana.length === 0 || !dataInicio || !dataFim) {
    alert('Preencha todos os campos!');
    return;
  }

  try {
    const res = await fetch('/api/calendario/salvar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ disciplina, diasSemana, dataInicio, dataFim })
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
    console.error(err);
    alert('Erro ao salvar calendário');
  }
});
