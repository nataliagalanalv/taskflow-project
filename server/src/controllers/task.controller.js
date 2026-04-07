const taskService = require('../services/task.service');

const getTasks = (req, res) => {
    const tasks = taskService.obtenerTodas();
    res.json(tasks);
};

const createTask = (req, res) => {
    const { title, priority, type } = req.body;

    // Validación defensiva
    if (!title || title.trim() === "") {
        return res.status(400).json({ error: 'El título es obligatorio' });
    }

    const nuevaTarea = taskService.crearTarea({ title, priority, type });
    res.status(201).json(nuevaTarea);
};

const deleteTask = (req, res, next) => {
    try {
        const { id } = req.params;
        taskService.eliminarTarea(id);
        res.status(204).send(); // 204 significa "Borrado con éxito, sin contenido"
    } catch (error) {
        next(error); 
    }
};

module.exports = {
    getTasks,
    createTask,
    deleteTask
};