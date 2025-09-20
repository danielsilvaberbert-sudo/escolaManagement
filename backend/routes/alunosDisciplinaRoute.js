// backend/routes/alunosDisciplinaRoute.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const googleSheetsService = require('../services/googleSheetsService');

router.get('/', authenticate, async (req, res) => {
  try {
    const disciplina = req.query.disciplina;
    if (!disciplina) return res.status(400).json({ error: 'Disciplina é obrigatória' });

    const alunos = await googleSheetsService.getAlunosDisciplina(disciplina);
    res.json(alunos);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
