const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');
const taskRoutes = require('./routes/task.routes'); // Importamos las nuevas rutas

const app = express();

// Middlewares
app.use(cors()); // Permite la comunicación con el Frontend
app.use(express.json()); // Permite leer datos JSON en las peticiones

// Montaje de rutas
// Ahora tus tareas estarán en http://localhost:3000/api/v1/tasks
app.use('/api/v1/tasks', taskRoutes);

// Ruta base de cortesía
app.get('/', (req, res) => {
    res.send('✅ API de WeekyCheck funcionando correctamente');
});

// Middleware de manejo de errores genérico 
app.use((err, req, res, next) => {
    // 1. Mapeo semántico de errores
    if (err.message === 'NOT_FOUND') {
        return res.status(404).json({
            error: 'Recurso no encontrado',
            message: 'La tarea que intentas manipular no existe.'
        });
    }

    // 2. Control de errores de validación )
    if (err.message === 'VALIDATION_ERROR') {
        return res.status(400).json({
            error: 'Datos incorrectos',
            message: 'El formato de la tarea no es válido.'
        });
    }

    // 3. Fallo no controlado (Error 500)
    // Registramos la traza técnica en nuestra consola (para nosotros)
    console.error('❌ TRAZA DEL ERROR:', err.stack);

    // Devolvemos un mensaje genérico al cliente (para el usuario)
    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Algo salió mal en nuestros servidores. Inténtalo más tarde.'
    });
});


// Arrancar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
});