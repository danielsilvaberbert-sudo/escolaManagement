// backend/controllers/frequenciaController.js
const googleSheetsService = require('../services/googleSheetsService');

const frequenciaController = {
  async salvarFrequencia(req, res) {
    try {
      const { disciplina, data, presencas } = req.body;
      if (!disciplina || !data || !presencas) return res.status(400).json({ error: 'Preencha todos os campos' });

      const result = await googleSheetsService.salvarFrequencia({ disciplina, data, presencas });
      res.json({ success: true, message: 'Frequência salva com sucesso', data: result });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = frequenciaController;
