import { Router } from 'express';
import { body } from 'express-validator';
import * as avaliacaoController from '../controllers/avaliacaoController.js';
import { autenticar } from '../middlewares/authMiddleware.js';
import { validar } from '../middlewares/validationMiddleware.js';

const router = Router();


router.get('/', avaliacaoController.listar);


router.post('/', autenticar, [
  body('nota').isFloat({ min: 0, max: 10 }).withMessage('Nota deve estar entre 0 e 10.'),
  body('conteudoId').notEmpty().withMessage('ID do conteúdo é obrigatório.'),
  body('tipo').isIn(['FILME', 'SERIE']).withMessage('Tipo deve ser FILME ou SERIE.'),
  validar,
], avaliacaoController.criar);


router.put('/:id', autenticar, [
  body('nota').isFloat({ min: 0, max: 10 }).withMessage('Nota deve estar entre 0 e 10.'),
  validar,
], avaliacaoController.atualizar);


router.delete('/:id', autenticar, avaliacaoController.remover);


router.post('/:id/curtir', autenticar, avaliacaoController.curtir);

export default router;
