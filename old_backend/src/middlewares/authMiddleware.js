import { verificarToken } from '../config/jwt.js';
import prisma from '../config/database.js';

/**
 * Middleware de autenticação via JWT
 * Rotas protegidas devem usar este middleware
 */
export async function autenticar(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ erro: 'Token de autenticação não fornecido.' });
    }

    const token = authHeader.split(' ')[1];
    const payload = verificarToken(token);

    // Verifica se o usuário ainda existe e está ativo
    const usuario = await prisma.usuario.findUnique({ where: { id: payload.id } });
    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ erro: 'Usuário não encontrado ou inativo.' });
    }

    req.usuario = { id: usuario.id, email: usuario.email, role: usuario.role };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ erro: 'Token expirado. Faça login novamente.' });
    }
    return res.status(401).json({ erro: 'Token inválido.' });
  }
}

/**
 * Middleware de autorização por role
 * @param {...string} roles - roles permitidas
 */
export function autorizar(...roles) {
  return (req, res, next) => {
    if (!req.usuario) return res.status(401).json({ erro: 'Não autenticado.' });
    if (!roles.includes(req.usuario.role)) {
      return res.status(403).json({ erro: 'Acesso negado. Permissão insuficiente.' });
    }
    next();
  };
}
