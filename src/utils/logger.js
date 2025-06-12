const winston = require('winston');
const path = require('path');

// Configuração do logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'moduloSession' },
  transports: [
    // Logs de erro em arquivo separado
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/error.log'), 
      level: 'error' 
    }),
    // Logs combinados
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/combined.log') 
    }),
    // Logs de acesso
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/access.log'),
      level: 'info'
    })
  ]
});

// Adicionar console transport em ambiente de desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;