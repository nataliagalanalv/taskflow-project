const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/task.routes');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas API
app.use('/api/v1/tasks', taskRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API de WeekyCheck funcionando correctamente' });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    if (err.message === 'NOT_FOUND') {
        return res.status(404).json({
            error: 'Recurso no encontrado',
            message: 'La tarea que intentas manipular no existe.'
        });
    }

    if (err.message === 'VALIDATION_ERROR') {
        return res.status(400).json({
            error: 'Datos incorrectos',
            message: 'El formato de la tarea no es válido.'
        });
    }

    console.error('❌ TRAZA DEL ERROR:', err.stack);

    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Algo salió mal en nuestros servidores. Inténtalo más tarde.'
    });
});

// Exportar para Vercel (serverless function)
module.exports = app;
