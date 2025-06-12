const { startServer } = require('./src/app');

// Iniciar o servidor
startServer().catch(error => {
  console.error('Erro fatal ao iniciar o servidor:', error);
  process.exit(1);
});