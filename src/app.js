const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { initDatabase } = require('./config/database');
const sessaoRoutes = require('./routes/sessaoRoutes');
const logger = require('./utils/logger');

// Carregar variáveis de ambiente
require('dotenv').config();

// Criar aplicação Express
const app = express();

// Middlewares de segurança e configuração
app.use(helmet()); // Adiciona headers de segurança
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json()); // Parse de JSON
app.use(express.urlencoded({ extended: true })); // Parse de URL-encoded

// Rotas
app.use('/api/sessoes', sessaoRoutes);

// Rota de status
app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'online', module: 'session' });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  logger.error('Erro não tratado:', { error: err.message, stack: err.stack });
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// Inicializar banco de dados e iniciar servidor
const PORT = process.env.PORT || 3002;

async function startServer() {
  try {
    // Inicializar banco de dados
    await initDatabase();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor do módulo de sessões rodando na porta ${PORT}`);
      logger.info(`Servidor do módulo de sessões iniciado na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    logger.error('Erro ao iniciar servidor:', { error: error.message });
    process.exit(1);
  }
}

// Exportar app para testes
module.exports = { app, startServer };