const express = require('express');
const router = express.Router();
const path = require('path');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const googleSheetsService = require('../services/googleSheetsService');

router.post(
  '/',
  authenticate,
  authorize(['Administrador', 'Instrutor']),
  async (req, res) => {
    try {
      const { nome, dataNascimento, pai, mae, email, status } = req.body;

      if (!nome || !dataNascimento || !pai || !mae || !email || !status) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      await googleSheetsService.salvarAluno({ nome, dataNascimento, pai, mae, email, status });

      res.json({ success: true, message: 'Aluno cadastrado com sucesso!' });
    } catch (err) {
      console.error('Erro ao cadastrar aluno:', err);
      res.status(500).json({ error: 'Erro ao cadastrar aluno' });
    }
  }
);

router.get(
  '/',
  authenticate,             // usuário precisa estar logado
  authorize(['Administrador']), // só administradores podem acessar
  (req, res) => {
    const filePath = path.join(__dirname, '../../frontend/pages/cadastrarAluno.html');
    res.sendFile(filePath);
  }
);

module.exports = router;
