import { validationResult } from 'express-validator';

/**
 * Middleware para checar erros de validação do express-validator
 */
export function validar(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      erro: 'Dados inválidos.',
      detalhes: errors.array().map(e => ({ campo: e.path, mensagem: e.msg })),
    });
  }
  next();
}
