const jwt = require('jsonwebtoken');
const axios = require('axios');
const logger = require('../utils/logger');

// URL do serviço de autenticação
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3000/api/auth';

// Middleware para verificar autenticação com JWT
const isAuthenticated = async (req, res, next) => {
  try {
    // Verificar se existe um token no header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Não autenticado' });
    }
    
    // Extrair o token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Não autenticado' });
    }
    
    try {
      // Verificar token com o serviço de autenticação
      const response = await axios.get(`${AUTH_SERVICE_URL}/check`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Se o token for válido, o serviço retorna os dados do usuário
      req.user = response.data.user;
      
      // Continuar para o próximo middleware ou rota
      next();
    } catch (error) {
      // Se o serviço de autenticação retornar erro, o token é inválido
      if (error.response) {
        return res.status(error.response.status).json({ message: error.response.data.message });
      }
      
      throw error;
    }
  } catch (error) {
    logger.error('Erro no middleware de autenticação:', { error: error.message });
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Middleware para registrar logs de acesso
const logAccess = (action) => {
  return async (req, res, next) => {
    try {
      // Capturar informações da requisição
      const ip = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];
      const userId = req.user ? req.user.id : null;
      
      // Registrar log
      logger.info(`Acesso: ${action}`, {
        user_id: userId,
        action,
        ip_address: ip,
        user_agent: userAgent,
        details: {
          method: req.method,
          path: req.path,
          params: req.params,
          query: req.query
        }
      });
      
      next();
    } catch (error) {
      logger.error('Erro no middleware de log de acesso:', { error: error.message });
      next(); // Continua mesmo em caso de erro
    }
  };
};

module.exports = {
  isAuthenticated,
  logAccess
};