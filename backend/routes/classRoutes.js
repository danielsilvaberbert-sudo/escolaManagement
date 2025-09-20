// backend/routes/classRoutes.js
const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Rotas para turmas
router.get('/', authenticate, classController.getAllClasses);
router.post('/', authenticate, authorize(['admin']), classController.createClass);
router.get('/:id', authenticate, classController.getClassById);
router.put('/:id', authenticate, authorize(['admin']), classController.updateClass);
router.delete('/:id', authenticate, authorize(['admin']), classController.deleteClass);

module.exports = router;
