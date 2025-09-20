// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const googleSheetsService = require('../services/googleSheetsService');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// Middleware para autenticar token JWT
function authenticateToken(req, res, next) {
  const token = req.cookies.token; // pega do cookie

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
}

// Rotas
router.post('/login', authController.login);

router.get('/dashboard', authenticateToken, async (req, res) => {
   try {

    // Caminho do HTML base
    const filePath = path.join(__dirname, '../../frontend/pages/dashboard.html');
    let html = fs.readFileSync(filePath, 'utf8');

    res.send(html);
  } catch (err) {
    res.status(500).send(`Erro ao carregar dashboard: ${err.message}`);
  }
});

router.get('/dashboardDados', authenticateToken, async (req, res) => {
  try {
    const data = await googleSheetsService.getDashboardData(req.user);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

module.exports = router;
