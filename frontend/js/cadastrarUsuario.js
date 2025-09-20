document.getElementById('formCadastro').addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());

      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const json = await res.json();

      if (json.success) {
        // redireciona para a página de listagem
        window.location.href = json.redirect;
      } else {
        alert(JSON.stringify(json));
      }
    });