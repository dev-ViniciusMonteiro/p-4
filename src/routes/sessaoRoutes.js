const express = require('express');
const router = express.Router();
const sessaoController = require('../controllers/sessaoController');
const { isAuthenticated, logAccess } = require('../middlewares/authMiddleware');

// Todas as rotas requerem autenticação
router.use(isAuthenticated);

// Rota para criar uma nova sessão
router.post('/', logAccess('criar_sessao'), sessaoController.createSessao);

// Rota para listar sessões com paginação e filtros
router.get('/', logAccess('listar_sessoes'), sessaoController.listSessoes);

// Rota para listar sessões de um paciente específico
router.get('/paciente/:pacienteId', logAccess('listar_sessoes_paciente'), sessaoController.listSessoesPaciente);

// Rota para obter uma sessão específica por ID
router.get('/:id', logAccess('visualizar_sessao'), sessaoController.getSessao);

// Rota para atualizar uma sessão
router.put('/:id', logAccess('atualizar_sessao'), sessaoController.updateSessao);

// Rota para excluir uma sessão
router.delete('/:id', logAccess('excluir_sessao'), sessaoController.deleteSessao);

// Rota para registrar evolução de uma sessão
router.post('/:id/evolucao', logAccess('registrar_evolucao'), sessaoController.registrarEvolucao);

module.exports = router;