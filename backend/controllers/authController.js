// backend/controllers/authController.js
const GoogleSheetsService = require('../services/googleSheetsService');
const jwt = require('jsonwebtoken');

const authController = {
  async login(req, res) {
    try {
      const { usuario, senha } = req.body;

      if (!usuario || !senha) {
        return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
      }

      const result = await GoogleSheetsService.verifyLogin(usuario, senha);
      if (!result.success) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Cria o token JWT
      const token = jwt.sign(result.user, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Salva o token em cookie HTTP-only
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // true se usar HTTPS
        sameSite: 'strict'
      });

      res.json({ success: true });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro no servidor' });
    }
  }
}

module.exports = authController;
