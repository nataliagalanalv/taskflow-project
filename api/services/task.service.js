
const connectDB = require('../db');
const Task = require('../models/task.model');

const obtenerTodas = async () => {
    await connectDB();
    return await Task.find().sort({ createdAt: -1 });
};

const crearTarea = async (data) => {
    await connectDB();
    const tarea = new Task(data);
    return await tarea.save();
};

const eliminarTarea = async (id) => {
    await connectDB();
    const resultado = await Task.findByIdAndDelete(id);
    if (!resultado) throw new Error('NOT_FOUND');
    return true;
};

const actualizarTarea = async (id, data) => {
    await connectDB();
    const tarea = await Task.findByIdAndUpdate(id, data, { new: true });
    if (!tarea) throw new Error('NOT_FOUND');
    return tarea;
};

const completarTarea = async (id) => {
    return actualizarTarea(id, { completed: true });
};

module.exports = { obtenerTodas, crearTarea, actualizarTarea, completarTarea, eliminarTarea };

   