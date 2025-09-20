const express = require('express');
const router = express.Router();
const path = require('path');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const googleSheetsService = require('../services/googleSheetsService');

router.get(
  '/',
  authenticate,
  authorize(['Instrutor', 'Administrador']),
  async (req, res) => {
    try {
      const instrutorLogado = req.user.nome; // Nome vindo do token JWT
      const rows = await googleSheetsService.getValues('Disciplinas!A2:B'); 
      // Coluna A = Instrutor, Coluna B = Disciplina

      const disciplinas = rows
        .map(r => r[1])
        .filter(Boolean);

      res.json([...new Set(disciplinas)]); // remove duplicadas

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar disciplinas' });
    }
  }
);

router.get(
  '/cadastrar',
  authenticate,             // usuário precisa estar logado
  authorize(['Administrador']), // só administradores podem acessar
  (req, res) => {
    const filePath = path.join(__dirname, '../../frontend/pages/cadastrarDisciplinas.html');
    res.sendFile(filePath);
  }
);

router.post(
  '/',
  authenticate,
  authorize(['Administrador']),
  async (req, res) => {
    try {
      const { disciplina, instrutor } = req.body;

      if (!disciplina || !instrutor) {
        return res.status(400).json({ error: 'Disciplina e Instrutor são obrigatórios' });
      }

      await googleSheetsService.salvarDisciplina({ instrutor, disciplina });

      res.json({ success: true, message: 'Disciplina cadastrada com sucesso!' });
    } catch (error) {
      console.error('Erro ao cadastrar disciplina:', error);
      res.status(500).json({ error: 'Erro ao cadastrar disciplina' });
    }
  }
);

module.exports = router;
