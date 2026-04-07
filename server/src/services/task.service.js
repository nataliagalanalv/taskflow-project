// Base de datos simulada en memoria
let tasks = [];

const obtenerTodas = () => {
    return tasks;
};

const crearTarea = (data) => {
    const nuevaTarea = {
        id: Date.now().toString(), // Generamos un ID único
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

module.exports = {
    obtenerTodas,
    crearTarea,
    eliminarTarea
};