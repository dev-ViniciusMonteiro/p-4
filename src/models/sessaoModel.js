const { pool } = require('../config/database');
const logger = require('../utils/logger');

class SessaoModel {
  // Criar uma nova sessão
  async create(sessaoData) {
    try {
      const [result] = await pool.query(
        `INSERT INTO sessoes (
          paciente_id, psicologo_id, data_sessao, hora_inicio, 
          hora_fim, tipo_sessao, resumo, evolucao
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sessaoData.paciente_id, sessaoData.psicologo_id, 
          sessaoData.data_sessao, sessaoData.hora_inicio, 
          sessaoData.hora_fim || null, sessaoData.tipo_sessao, 
          sessaoData.resumo || null, sessaoData.evolucao || null
        ]
      );
      
      return { id: result.insertId, ...sessaoData };
    } catch (error) {
      logger.error('Erro ao criar sessão:', { error: error.message, sessaoData });
      throw error;
    }
  }

  // Buscar sessão por ID
  async findById(id, psicologoId) {
    try {
      const [rows] = await pool.query(
        `SELECT s.*, p.nome as nome_paciente 
         FROM sessoes s
         JOIN pacientes p ON s.paciente_id = p.id
         WHERE s.id = ? AND s.psicologo_id = ?`,
        [id, psicologoId]
      );
      
      return rows[0];
    } catch (error) {
      logger.error('Erro ao buscar sessão por ID:', { error: error.message, id, psicologoId });
      throw error;
    }
  }

  // Listar sessões de um paciente específico
  async findByPaciente(pacienteId, psicologoId) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM sessoes 
         WHERE paciente_id = ? AND psicologo_id = ?
         ORDER BY data_sessao DESC, hora_inicio DESC`,
        [pacienteId, psicologoId]
      );
      
      return rows;
    } catch (error) {
      logger.error('Erro ao listar sessões do paciente:', { error: error.message, pacienteId, psicologoId });
      throw error;
    }
  }

  // Listar todas as sessões do psicólogo com paginação
  async findAll(psicologoId, { page = 1, limit = 10, pacienteId = null, dataInicio = null, dataFim = null }) {
    try {
      const offset = (page - 1) * limit;
      let query = `
        SELECT s.*, p.nome as nome_paciente 
        FROM sessoes s
        JOIN pacientes p ON s.paciente_id = p.id
        WHERE s.psicologo_id = ?
      `;
      
      const params = [psicologoId];
      
      // Filtrar por paciente se fornecido
      if (pacienteId) {
        query += ` AND s.paciente_id = ?`;
        params.push(pacienteId);
      }
      
      // Filtrar por período se fornecido
      if (dataInicio) {
        query += ` AND s.data_sessao >= ?`;
        params.push(dataInicio);
      }
      
      if (dataFim) {
        query += ` AND s.data_sessao <= ?`;
        params.push(dataFim);
      }
      
      // Adicionar ordenação e paginação
      query += ` ORDER BY s.data_sessao DESC, s.hora_inicio DESC LIMIT ? OFFSET ?`;
      params.push(parseInt(limit), offset);
      
      // Executar consulta paginada
      const [rows] = await pool.query(query, params);
      
      // Contar total de registros para metadados de paginação
      let countQuery = `
        SELECT COUNT(*) as total 
        FROM sessoes s
        WHERE s.psicologo_id = ?
      `;
      
      const countParams = [psicologoId];
      
      if (pacienteId) {
        countQuery += ` AND s.paciente_id = ?`;
        countParams.push(pacienteId);
      }
      
      if (dataInicio) {
        countQuery += ` AND s.data_sessao >= ?`;
        countParams.push(dataInicio);
      }
      
      if (dataFim) {
        countQuery += ` AND s.data_sessao <= ?`;
        countParams.push(dataFim);
      }
      
      const [countResult] = await pool.query(countQuery, countParams);
      
      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);
      
      return {
        data: rows,
        pagination: {
          total,
          totalPages,
          currentPage: page,
          limit
        }
      };
    } catch (error) {
      logger.error('Erro ao listar sessões:', { error: error.message, psicologoId });
      throw error;
    }
  }

  // Atualizar sessão
  async update(id, psicologoId, sessaoData) {
    try {
      let query = 'UPDATE sessoes SET ';
      const values = [];
      const updateFields = [];
      
      // Mapear campos a serem atualizados
      const fields = [
        'data_sessao', 'hora_inicio', 'hora_fim', 
        'tipo_sessao', 'resumo', 'evolucao'
      ];
      
      fields.forEach(field => {
        if (sessaoData[field] !== undefined) {
          updateFields.push(`${field} = ?`);
          values.push(sessaoData[field]);
        }
      });
      
      // Se não houver campos para atualizar, retorna
      if (updateFields.length === 0) {
        return { id, ...sessaoData };
      }
      
      query += updateFields.join(', ') + ' WHERE id = ? AND psicologo_id = ?';
      values.push(id, psicologoId);
      
      const [result] = await pool.query(query, values);
      
      if (result.affectedRows === 0) {
        throw new Error('Sessão não encontrada ou não pertence ao psicólogo');
      }
      
      return { id, ...sessaoData };
    } catch (error) {
      logger.error('Erro ao atualizar sessão:', { error: error.message, id, psicologoId, sessaoData });
      throw error;
    }
  }

  // Excluir sessão
  async delete(id, psicologoId) {
    try {
      const [result] = await pool.query(
        `DELETE FROM sessoes WHERE id = ? AND psicologo_id = ?`,
        [id, psicologoId]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('Sessão não encontrada ou não pertence ao psicólogo');
      }
      
      return { success: true };
    } catch (error) {
      logger.error('Erro ao excluir sessão:', { error: error.message, id, psicologoId });
      throw error;
    }
  }

  // Registrar evolução de uma sessão
  async registrarEvolucao(id, psicologoId, evolucao) {
    try {
      const [result] = await pool.query(
        `UPDATE sessoes SET evolucao = ? WHERE id = ? AND psicologo_id = ?`,
        [evolucao, id, psicologoId]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('Sessão não encontrada ou não pertence ao psicólogo');
      }
      
      return { success: true, id, evolucao };
    } catch (error) {
      logger.error('Erro ao registrar evolução da sessão:', { error: error.message, id, psicologoId });
      throw error;
    }
  }
}

module.exports = new SessaoModel();