
let tasks = [];

const obtenerTodas = () => {
    return tasks;
};

const crearTarea = (data) => {
    const nuevaTarea = {
        id: Date.now().toString(), 
        ...data,
        completed: false,
        createdAt: new Date()
    };
    tasks.push(nuevaTarea);
    return nuevaTarea;
};

const eliminarTarea = (id) => {
    const existe = tasks.find(t => t.id === id);
    if (!existe) {
        throw new Error('NOT_FOUND');
    }
    tasks = tasks.filter(t => t.id !== id);
    return true;
};

const actualizarTarea = (id, data) => {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
        throw new Error('NOT_FOUND');
    }
    tasks[index] = { ...tasks[index], ...data };
    return tasks[index];
};

const completarTarea = (id) => {
    const tarea = tasks.find(t => t.id === id);
    if (!tarea) {
        throw new Error('NOT_FOUND');
    }
    tarea.completed = true;
    return tarea;
};


module.exports = {
    obtenerTodas,
    crearTarea,
    actualizarTarea,
    completarTarea,
    eliminarTarea
};