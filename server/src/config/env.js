require('dotenv').config();

// Validación manual de seguridad
if (!process.env.PORT) {
    throw new Error('FATAL ERROR: El puerto (PORT) no está definido en el archivo .env');
}

module.exports = {
    PORT: process.env.PORT
};