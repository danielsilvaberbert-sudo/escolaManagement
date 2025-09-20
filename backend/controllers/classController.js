// backend/controllers/classController.js
const GoogleSheetsService = require('../services/googleSheetsService');

const classController = {
  // Obter todas as turmas
  async getAllClasses(req, res) {
    try {
      const classes = await GoogleSheetsService.getData('classes');
      res.json(classes);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar turmas' });
    }
  },

  // Criar nova turma
  async createClass(req, res) {
    try {
      const { title, year, teacherId, active = 'S' } = req.body;
      
      if (!title || !year) {
        return res.status(400).json({ error: 'Título e ano são obrigatórios' });
      }

      const newClass = {
        id: Date.now().toString(),
        title,
        year,
        teacherId,
        active,
        createdAt: new Date().toISOString()
      };

      await GoogleSheetsService.addData('classes', newClass);
      res.status(201).json(newClass);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar turma' });
    }
  },

  // Obter turma por ID
  async getClassById(req, res) {
    try {
      const { id } = req.params;
      const classes = await GoogleSheetsService.getData('classes');
      const classItem = classes.find(c => c.id === id);
      
      if (!classItem) {
        return res.status(404).json({ error: 'Turma não encontrada' });
      }
      
      res.json(classItem);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar turma' });
    }
  },

  // Atualizar turma
  async updateClass(req, res) {
    try {
      const { id } = req.params;
      const { title, year, teacherId, active } = req.body;
      const classes = await GoogleSheetsService.getData('classes');
      const classIndex = classes.findIndex(c => c.id === id);
      
      if (classIndex === -1) {
        return res.status(404).json({ error: 'Turma não encontrada' });
      }

      const updatedClass = {
        ...classes[classIndex],
        title: title || classes[classIndex].title,
        year: year || classes[classIndex].year,
        teacherId: teacherId || classes[classIndex].teacherId,
        active: active || classes[classIndex].active,
        updatedAt: new Date().toISOString()
      };

      await GoogleSheetsService.updateData('classes', classIndex, updatedClass);
      res.json(updatedClass);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar turma' });
    }
  },

  // Deletar turma
  async deleteClass(req, res) {
    try {
      const { id } = req.params;
      const classes = await GoogleSheetsService.getData('classes');
      const classIndex = classes.findIndex(c => c.id === id);
      
      if (classIndex === -1) {
        return res.status(404).json({ error: 'Turma não encontrada' });
      }

      await GoogleSheetsService.deleteData('classes', classIndex);
      res.json({ message: 'Turma removida com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao remover turma' });
    }
  }
};

module.exports = classController;