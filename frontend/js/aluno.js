document.getElementById('formAluno').addEventListener('submit', async (e) => {
      e.preventDefault();

      const aluno = {
        nome: document.getElementById('nome').value,
        dataNascimento: document.getElementById('dataNascimento').value,
        pai: document.getElementById('pai').value,
        mae: document.getElementById('mae').value,
        email: document.getElementById('email').value,
        status: document.getElementById('status').value
      };

      try {
        const res = await fetch('/api/alunos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(aluno)
        });

        const data = await res.json();
        const alertDiv = document.getElementById('alert');
        alertDiv.classList.remove('d-none');

        if (res.ok) {
          alertDiv.classList.remove('alert-danger');
          alertDiv.classList.add('alert-success');
          alertDiv.textContent = data.message;
          document.getElementById('formAluno').reset();
        } else {
          alertDiv.classList.remove('alert-success');
          alertDiv.classList.add('alert-danger');
          alertDiv.textContent = data.error;
        }
      } catch (err) {
        const alertDiv = document.getElementById('alert');
        alertDiv.classList.remove('d-none');
        alertDiv.classList.add('alert-danger');
        alertDiv.textContent = err.message;
      }
    });