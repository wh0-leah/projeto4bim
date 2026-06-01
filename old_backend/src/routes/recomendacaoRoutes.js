import { Router } from 'express';
import * as recController from '../controllers/recomendacaoController.js';
import { autenticar } from '../middlewares/authMiddleware.js';

const router = Router();

// GET /api/recomendacoes — personalizadas (autenticado)
router.get('/', autenticar, recController.recomendacoes);

// GET /api/recomendacoes/trending — público
router.get('/trending', recController.trending);

export default router;
