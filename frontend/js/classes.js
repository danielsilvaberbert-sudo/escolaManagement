// frontend/js/classes.js
class Classes {
  static async getAll() {
    try {
      const response = await Auth.fetchWithAuth('/api/classes');
      return await response.json();
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  }

  static async create(classData) {
    try {
      const response = await Auth.fetchWithAuth('/api/classes', {
        method: 'POST',
        body: JSON.stringify(classData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  }

  static async renderClassList() {
    try {
      const classes = await this.getAll();
      const user = Auth.getCurrentUser();
      
      return `
        <div class="card shadow">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h4>Turmas</h4>
            ${user.role === 'admin' ? 
              `<button class="btn btn-primary" onclick="Classes.showCreateModal()">
                <i class="fas fa-plus"></i> Nova Turma
              </button>` : ''
            }
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Ano</th>
                    <th>Status</th>
                    <th>Professor</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  ${classes.map(cls => `
                    <tr>
                      <td>${cls.title}</td>
                      <td>${cls.year}</td>
                      <td>
                        <span class="badge ${cls.active === 'S' ? 'bg-success' : 'bg-secondary'}">
                          ${cls.active === 'S' ? 'Ativa' : 'Inativa'}
                        </span>
                      </td>
                      <td>${cls.teacherName || '--'}</td>
                      <td>
                        <button class="btn btn-sm btn-info" onclick="Classes.viewClass('${cls.id}')">
                          <i class="fas fa-eye"></i>
                        </button>
                        ${user.role === 'admin' ? `
                        <button class="btn btn-sm btn-warning" onclick="Classes.showEditModal('${cls.id}')">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="Classes.deleteClass('${cls.id}')">
                          <i class="fas fa-trash"></i>
                        </button>
                        ` : ''}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    } catch (error) {
      return `
        <div class="alert alert-danger">
          Erro ao carregar turmas: ${error.message}
        </div>
      `;
    }
  }

  static async showCreateModal() {
    const teachers = await this.getTeachers();
    
    const modal = `
      <div class="modal fade" id="createClassModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Nova Turma</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="createClassForm">
                <div class="mb-3">
                  <label class="form-label">Título</label>
                  <input type="text" class="form-control" name="title" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Ano</label>
                  <input type="number" class="form-control" name="year" min="2000" max="2100" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Professor</label>
                  <select class="form-select" name="teacherId">
                    <option value="">Selecione...</option>
                    ${teachers.map(t => `
                      <option value="${t.id}">${t.name}</option>
                    `).join('')}
                  </select>
                </div>
                <div class="mb-3 form-check">
                  <input type="checkbox" class="form-check-input" name="active" checked>
                  <label class="form-check-label">Ativa</label>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" onclick="Classes.createClass()">Salvar</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modal);
    const modalInstance = new bootstrap.Modal(document.getElementById('createClassModal'));
    modalInstance.show();
    
    document.getElementById('createClassModal').addEventListener('hidden.bs.modal', () => {
      document.getElementById('createClassModal').remove();
    });
  }

  static async createClass() {
    try {
      const form = document.getElementById('createClassForm');
      const formData = {
        title: form.title.value,
        year: form.year.value,
        teacherId: form.teacherId.value || null,
        active: form.active.checked ? 'S' : 'N'
      };
      
      await this.create(formData);
      
      // Close modal and refresh list
      bootstrap.Modal.getInstance(document.getElementById('createClassModal')).hide();
      router.navigateTo('/classes');
    } catch (error) {
      alert(`Erro ao criar turma: ${error.message}`);
    }
  }
}

// Adiciona ao escopo global para acesso nos eventos HTML
window.Classes = Classes;