const taskService = require('../services/task.service');

const getTasks = (req, res) => {
    const tasks = taskService.obtenerTodas();
    res.json(tasks);
};

const createTask = (req, res) => {
    const { title, priority, type } = req.body;

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
        res.status(204).send(); 
    } catch (error) {
        next(error); 
    }
};

const updateTask = (req, res, next) => {
    try {
        const { id } = req.params;
        const tareaActualizada = taskService.actualizarTarea(id, req.body);
        res.json(tareaActualizada);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTasks,
    createTask,
    deleteTask,
    updateTask
};