import { Router } from 'express';
import { body } from 'express-validator';
import * as listaController from '../controllers/listaController.js';
import { autenticar } from '../middlewares/authMiddleware.js';
import { validar } from '../middlewares/validationMiddleware.js';

const router = Router();

router.use(autenticar);

router.get('/', listaController.listar);

router.get('/favoritos', listaController.favoritos);

router.get('/:id', listaController.obter);

router.post('/', [
  body('nome').trim().notEmpty().withMessage('Nome da lista é obrigatório.'),
  validar,
], listaController.criar);

router.delete('/:id', listaController.remover);

router.post('/:id/itens', [
  body('filmeId').optional().isUUID().withMessage('filmeId inválido.'),
  body('serieId').optional().isUUID().withMessage('serieId inválido.'),
  validar,
], listaController.adicionarItem);

router.put('/:id/itens/:itemId', listaController.atualizarItem);

router.delete('/:id/itens/:itemId', listaController.removerItem);

export default router;
