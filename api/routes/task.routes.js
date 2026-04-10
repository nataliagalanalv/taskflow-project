const express = require('express');
const router = express.Router();
const taskController = require('./controllers/task.controller');

// Definir rutas y conectarlas al controlador
router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.delete('/:id', taskController.deleteTask);
router.put('/:id', taskController.updateTask);

module.exports = router;