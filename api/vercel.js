const app = require('./index');

// Handler para Vercel Functions (Serverless)
// Vercel proporciona objetos req/res compatibles con Node.js HTTP
module.exports = async (req, res) => {
  // Process request with Express
  return app(req, res);
};
