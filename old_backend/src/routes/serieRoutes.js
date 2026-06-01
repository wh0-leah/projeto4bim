import { Router } from 'express';
import { body } from 'express-validator';
import * as serieController from '../controllers/serieController.js';
import { autenticar } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { validar } from '../middlewares/validationMiddleware.js';

const router = Router();

// GET /api/series — público
router.get('/', serieController.listar);

// GET /api/series/:id — público
router.get('/:id', serieController.obter);

// POST /api/series — autenticado
router.post('/', autenticar, upload.single('banner'), [
  body('titulo').trim().notEmpty().withMessage('Título é obrigatório.'),
  body('criador').trim().notEmpty().withMessage('Criador é obrigatório.'),
  body('anoInicio').isInt({ min: 1900 }).withMessage('Ano de início inválido.'),
  validar,
], serieController.criar);

// PUT /api/series/:id — autenticado
router.put('/:id', autenticar, upload.single('banner'), serieController.atualizar);

// DELETE /api/series/:id — autenticado
router.delete('/:id', autenticar, serieController.remover);

export default router;
