const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');
const taskRoutes = require('./routes/task.routes'); // Importamos las nuevas rutas
const app = express();
const path = require('path');
const frontendPath = path.join(__dirname, '../../weekyCheck');

// Middlewares
app.use(cors()); // Permite la comunicación con el Frontend
app.use(express.json()); // Permite leer datos JSON en las peticiones
app.use(express.static(frontendPath));

app.use('/api/v1/tasks', taskRoutes);

// Ruta base para verificar que el servidor está funcionando
// app.get('/', (req, res) => {
    // res.send('✅ API de WeekyCheck funcionando correctamente');
// });

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
    console.error('❌ TRAZA DEL ERROR:', err.stack);

    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Algo salió mal en nuestros servidores. Inténtalo más tarde.'
    });
});


// Solo arrancamos el puerto si NO estamos en Vercel (entorno local)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor local corriendo en: http://localhost:${PORT}`);
    });
}

// ESTA LÍNEA ES LA QUE VERCEL BUSCA PARA HACER FUNCIONAR TU API
module.exports = app;