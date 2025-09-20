// backend/routes/frequenciaRoute.js
const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require('fs');
const frequenciaController = require('../controllers/frequenciaController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.post('/salvar', authenticate, authorize(['Administrador', 'Instrutor']), frequenciaController.salvarFrequencia);

router.get(
  '/',
  authenticate,
  authorize(['Administrador', 'Instrutor']),
  (req, res) => {
    const disciplina = req.query.disciplina || '';
    const filePath = path.join(__dirname, '../../frontend/pages/frequencia.html');
    let html = fs.readFileSync(filePath, 'utf8');
    html = html.replace(
      'id="disciplina" value=""',
      `id="disciplina" value="${disciplina}"`
    );
    res.send(html);
  }
);
module.exports = router;
