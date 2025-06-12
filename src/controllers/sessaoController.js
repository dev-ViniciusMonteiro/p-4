const sessaoModel = require('../models/sessaoModel');
const logger = require('../utils/logger');

// Controller para gerenciamento de sessões
class SessaoController {
  // Criar nova sessão
  async createSessao(req, res) {
    try {
      // Obter ID do psicólogo autenticado
      const psicologoId = req.user.id;
      
      // Validar campos obrigatórios
      const { paciente_id, data_sessao, hora_inicio, tipo_sessao } = req.body;
      
      if (!paciente_id || !data_sessao || !hora_inicio || !tipo_sessao) {
        return res.status(400).json({ 
          message: 'Campos obrigatórios: paciente_id, data_sessao, hora_inicio, tipo_sessao' 
        });
      }
      
      // Criar sessão com vínculo ao psicólogo e paciente
      const sessaoData = {
        paciente_id,
        psicologo_id: psicologoId,
        data_sessao,
        hora_inicio,
        hora_fim: req.body.hora_fim,
        tipo_sessao,
        resumo: req.body.resumo,
        evolucao: req.body.evolucao
      };
      
      const novaSessao = await sessaoModel.create(sessaoData);
      
      logger.info('Sessão criada com sucesso', { 
        userId: psicologoId, 
        sessaoId: novaSessao.id,
        pacienteId: paciente_id
      });
      
      res.status(201).json({
        message: 'Sessão cadastrada com sucesso',
        sessao: novaSessao
      });
    } catch (error) {
      logger.error('Erro ao criar sessão:', { error: error.message });
      res.status(500).json({ message: 'Erro ao cadastrar sessão' });
    }
  }

  // Listar sessões com paginação e filtros
  async listSessoes(req, res) {
    try {
      const psicologoId = req.user.id;
      const { page = 1, limit = 10, paciente_id, data_inicio, data_fim } = req.query;
      
      const sessoes = await sessaoModel.findAll(psicologoId, {
        page: parseInt(page),
        limit: parseInt(limit),
        pacienteId: paciente_id,
        dataInicio: data_inicio,
        dataFim: data_fim
      });
      
      res.status(200).json(sessoes);
    } catch (error) {
      logger.error('Erro ao listar sessões:', { error: error.message });
      res.status(500).json({ message: 'Erro ao listar sessões' });
    }
  }

  // Listar sessões de um paciente específico
  async listSessoesPaciente(req, res) {
    try {
      const psicologoId = req.user.id;
      const pacienteId = req.params.pacienteId;
      
      const sessoes = await sessaoModel.findByPaciente(pacienteId, psicologoId);
      
      res.status(200).json(sessoes);
    } catch (error) {
      logger.error('Erro ao listar sessões do paciente:', { error: error.message });
      res.status(500).json({ message: 'Erro ao listar sessões do paciente' });
    }
  }

  // Obter sessão por ID
  async getSessao(req, res) {
    try {
      const psicologoId = req.user.id;
      const sessaoId = req.params.id;
      
      const sessao = await sessaoModel.findById(sessaoId, psicologoId);
      
      if (!sessao) {
        return res.status(404).json({ message: 'Sessão não encontrada' });
      }
      
      res.status(200).json(sessao);
    } catch (error) {
      logger.error('Erro ao buscar sessão:', { error: error.message });
      res.status(500).json({ message: 'Erro ao buscar sessão' });
    }
  }

  // Atualizar sessão
  async updateSessao(req, res) {
    try {
      const psicologoId = req.user.id;
      const sessaoId = req.params.id;
      
      // Verificar se a sessão existe
      const sessaoExistente = await sessaoModel.findById(sessaoId, psicologoId);
      
      if (!sessaoExistente) {
        return res.status(404).json({ message: 'Sessão não encontrada' });
      }
      
      // Atualizar dados da sessão
      const sessaoAtualizada = await sessaoModel.update(sessaoId, psicologoId, req.body);
      
      logger.info('Sessão atualizada com sucesso', { 
        userId: psicologoId, 
        sessaoId 
      });
      
      res.status(200).json({
        message: 'Sessão atualizada com sucesso',
        sessao: sessaoAtualizada
      });
    } catch (error) {
      logger.error('Erro ao atualizar sessão:', { error: error.message });
      
      if (error.message === 'Sessão não encontrada ou não pertence ao psicólogo') {
        return res.status(404).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Erro ao atualizar sessão' });
    }
  }

  // Excluir sessão
  async deleteSessao(req, res) {
    try {
      const psicologoId = req.user.id;
      const sessaoId = req.params.id;
      
      await sessaoModel.delete(sessaoId, psicologoId);
      
      logger.info('Sessão excluída com sucesso', { 
        userId: psicologoId, 
        sessaoId 
      });
      
      res.status(200).json({ message: 'Sessão excluída com sucesso' });
    } catch (error) {
      logger.error('Erro ao excluir sessão:', { error: error.message });
      
      if (error.message === 'Sessão não encontrada ou não pertence ao psicólogo') {
        return res.status(404).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Erro ao excluir sessão' });
    }
  }

  // Registrar evolução de uma sessão
  async registrarEvolucao(req, res) {
    try {
      const psicologoId = req.user.id;
      const sessaoId = req.params.id;
      const { evolucao } = req.body;
      
      if (!evolucao) {
        return res.status(400).json({ message: 'O campo evolução é obrigatório' });
      }
      
      const resultado = await sessaoModel.registrarEvolucao(sessaoId, psicologoId, evolucao);
      
      logger.info('Evolução da sessão registrada com sucesso', { 
        userId: psicologoId, 
        sessaoId 
      });
      
      res.status(200).json({
        message: 'Evolução da sessão registrada com sucesso',
        sessao: resultado
      });
    } catch (error) {
      logger.error('Erro ao registrar evolução da sessão:', { error: error.message });
      
      if (error.message === 'Sessão não encontrada ou não pertence ao psicólogo') {
        return res.status(404).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Erro ao registrar evolução da sessão' });
    }
  }
}

module.exports = new SessaoController();