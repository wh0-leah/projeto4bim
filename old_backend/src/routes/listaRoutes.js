import { Router } from 'express';
import { body } from 'express-validator';
import * as listaController from '../controllers/listaController.js';
import { autenticar } from '../middlewares/authMiddleware.js';
import { validar } from '../middlewares/validationMiddleware.js';

const router = Router();

// Todas as rotas de lista requerem autenticação
router.use(autenticar);

// GET /api/listas — listas do usuário logado
router.get('/', listaController.listar);

// GET /api/listas/favoritos — itens favoritados
router.get('/favoritos', listaController.favoritos);

// GET /api/listas/:id
router.get('/:id', listaController.obter);

// POST /api/listas
router.post('/', [
  body('nome').trim().notEmpty().withMessage('Nome da lista é obrigatório.'),
  validar,
], listaController.criar);

// DELETE /api/listas/:id
router.delete('/:id', listaController.remover);

// POST /api/listas/:id/itens — adicionar item
router.post('/:id/itens', [
  body('filmeId').optional().isUUID().withMessage('filmeId inválido.'),
  body('serieId').optional().isUUID().withMessage('serieId inválido.'),
  validar,
], listaController.adicionarItem);

// PUT /api/listas/:id/itens/:itemId — atualizar status/favorito
router.put('/:id/itens/:itemId', listaController.atualizarItem);

// DELETE /api/listas/:id/itens/:itemId — remover item
router.delete('/:id/itens/:itemId', listaController.removerItem);

export default router;
