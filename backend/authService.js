import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';
import { autenticar } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { validar } from '../middlewares/validationMiddleware.js';

const router = Router();


router.post('/cadastrar', [
  body('nome').trim().isLength({ min: 2 }).withMessage('Nome deve ter ao menos 2 caracteres.'),
  body('email').isEmail().normalizeEmail().withMessage('E-mail inválido.'),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter ao menos 6 caracteres.'),
  validar,
], authController.cadastrar);


router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('E-mail inválido.'),
  body('senha').notEmpty().withMessage('Senha é obrigatória.'),
  validar,
], authController.login);

router.post('/logout', authController.logout);


router.get('/perfil', autenticar, authController.perfil);


router.put('/perfil', autenticar, upload.single('avatar'), authController.atualizarPerfil);


router.put('/senha', autenticar, [
  body('senhaAtual').notEmpty().withMessage('Senha atual é obrigatória.'),
  body('novaSenha').isLength({ min: 6 }).withMessage('Nova senha deve ter ao menos 6 caracteres.'),
  validar,
], authController.alterarSenha);

export default router;
