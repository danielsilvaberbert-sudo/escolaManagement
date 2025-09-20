async function carregarUsuarios() {
      try {
        const res = await fetch('/api/usuarios/list');
        const usuarios = await res.json();

        const tbody = document.getElementById('userTable');
        tbody.innerHTML = '';

        if (usuarios.length === 0) {
          tbody.innerHTML = `<tr><td colspan="2" class="text-center">Nenhum usuário encontrado</td></tr>`;
          return;
        }

        usuarios.forEach(u => {
          const row = `<tr>
            <td>${u.nome}</td>
            <td>${u.tipo}</td>
          </tr>`;
          tbody.innerHTML += row;
        });
      } catch (err) {
        console.error('Erro ao carregar usuários:', err);
        document.getElementById('userTable').innerHTML = 
          `<tr><td colspan="2" class="text-danger">Erro ao carregar usuários</td></tr>`;
      }
    }

    carregarUsuarios();