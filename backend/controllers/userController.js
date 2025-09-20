// backend/controllers/userController.js
const GoogleSheetsService = require('../services/googleSheetsService');

const userController = {
  // Método para criar usuário (que deve ser chamado pela rota POST)
  async createUser(req, res) {
    try {
      const { name, username, password, role } = req.body;
      
      // Validação básica
      if (!name || !username || !password || !role) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      // Lógica para criar usuário
      const newUser = {
        id: Date.now().toString(),
        name,
        username,
        password, // Na prática, você deve hash esta senha
        role,
        createdAt: new Date().toISOString()
      };

      await GoogleSheetsService.addData('users', newUser);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
   // Criar usuário
  async create(req, res) {
    try {
      const { nome, username, senha, tipo } = req.body;

      if (!nome || !username || !senha || !tipo) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      await GoogleSheetsService.addUser(nome, username, senha, tipo);

      // envia um JSON informando o frontend para redirecionar
      res.json({ success: true, redirect: '/usuarios' });
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
  },

  async list(req, res) {
    try {
      const users = await GoogleSheetsService.getUsers();
      res.json(users);
    } catch (err) {
      console.error("Erro ao listar usuários:", err);
      res.status(500).json({ error: 'Erro no servidor' });
    }
  }
};

module.exports = userController;