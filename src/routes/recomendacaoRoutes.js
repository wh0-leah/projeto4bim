import { Router } from 'express';
import * as recController from '../controllers/recomendacaoController.js';
import { autenticar } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', autenticar, recController.recomendacoes);

router.get('/trending', recController.trending);

export default router;
