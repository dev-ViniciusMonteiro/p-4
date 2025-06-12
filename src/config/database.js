const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuração da conexão com o banco de dados
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Função para inicializar o banco de dados e criar tabelas se não existirem
async function initDatabase() {
  try {
    // Verifica se a conexão está funcionando
    await pool.query('SELECT 1');
    console.log('Conexão com o banco de dados estabelecida com sucesso');
    
    // Cria a tabela de sessões se não existir
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessoes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        paciente_id INT NOT NULL,
        psicologo_id INT NOT NULL,
        data_sessao DATE NOT NULL,
        hora_inicio TIME NOT NULL,
        hora_fim TIME,
        tipo_sessao ENUM('Avaliação', 'Terapia Individual', 'Neuropsicológica', 'Outro') NOT NULL,
        resumo TEXT,
        evolucao TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
        FOREIGN KEY (psicologo_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Tabela de sessões verificada/criada');
    
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
    throw error;
  }
}

module.exports = {
  pool,
  initDatabase
};