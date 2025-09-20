// backend/routes/userRoutes.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const userController = require('../controllers/userController'); // Verifique este caminho
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const googleSheetsService = require('../services/googleSheetsService');

// Rota POST corrigida
router.get(
  '/instrutores',
  authenticate,
  authorize(['Administrador']),
  async (req, res) => {
    try {
      const instrutores = await googleSheetsService.getInstrutores();
      res.json(instrutores);
    } catch (error) {
      console.error('Erro ao buscar instrutores:', error);
      res.status(500).json({ error: 'Erro ao buscar instrutores' });
    }
  }
);

router.get(
  '/',
  authenticate,
  authorize(['Administrador']), // só Administradores podem ver usuários
  (req, res) => {
    const filePath = path.join(__dirname, '../../frontend/pages/listar-usuarios.html');
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Exemplo de injetar dados no HTML se precisar
    html = html.replace(
      'id="usuario-logado"',
      `id="usuario-logado" data-nome="${req.user.nome}" data-tipo="${req.user.tipo}"`
    );

    res.send(html);
  }
);

router.get('/list', userController.list);
router.post('/', userController.create);

// Rota para cadastrar usuário
router.get(
  '/cadastrar',
  authenticate,
  authorize(['Administrador']),
  (req, res) => {
    const filePath = path.join(__dirname, '../../frontend/pages/cadastrarUsuario.html');
    const html = fs.readFileSync(filePath, 'utf8');
    res.send(html);
  }
);

module.exports = router;