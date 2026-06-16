import { Router } from 'express';
import { body } from 'express-validator';
import * as filmeController from '../controllers/filmeController.js';
import { autenticar } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { validar } from '../middlewares/validationMiddleware.js';

const router = Router();


router.get('/', filmeController.listar);


router.delete('/excluirNomeCadastro', autenticar, filmeController.excluirNomeCadastro);


router.get('/:id', filmeController.obter);


router.post('/', autenticar, upload.single('capa'), [
  body('titulo').trim().notEmpty().withMessage('Título é obrigatório.'),
  body('diretor').trim().notEmpty().withMessage('Diretor é obrigatório.'),
  body('anoLancamento').isInt({ min: 1888 }).withMessage('Ano de lançamento inválido.'),
  validar,
], filmeController.criar);


router.put('/:id', autenticar, upload.single('capa'), filmeController.atualizar);


router.delete('/:id', autenticar, filmeController.remover);

export default router;
