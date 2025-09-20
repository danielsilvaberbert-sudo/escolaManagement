const express = require('express');
const router = express.Router();
const path = require('path');
const { salvarCalendario } = require('../controllers/calendarioController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.post(
  '/salvar',
  authenticate,
  authorize(['Administrador', 'Instrutor']),
  salvarCalendario
);

router.get(
  '/',
  authenticate,             // usuário precisa estar logado
  authorize(['Administrador']), // só administradores podem acessar
  (req, res) => {
    const filePath = path.join(__dirname, '../../frontend/pages/calendario.html');
    res.sendFile(filePath);
  }
);
module.exports = router;
