import { verificarToken } from '../config/jwt.js';
import prisma from '../config/database.js';

function obterCookie(req, nome) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
  const cookie = cookies.find((item) => item.startsWith(`${nome}=`));
  if (!cookie) return null;

  return decodeURIComponent(cookie.split('=').slice(1).join('='));
}

export async function autenticar(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const tokenCookie = obterCookie(req, 'token');

    if ((!authHeader || !authHeader.startsWith('Bearer ')) && !tokenCookie) {
      return res.status(401).json({ erro: 'Token de autenticação não fornecido.' });
    }

    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : tokenCookie;
    const payload = verificarToken(token);

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

export function autorizar(...roles) {
  return (req, res, next) => {
    if (!req.usuario) return res.status(401).json({ erro: 'Não autenticado.' });
    if (!roles.includes(req.usuario.role)) {
      return res.status(403).json({ erro: 'Acesso negado. Permissão insuficiente.' });
    }
    next();
  };
}
