import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET || 'fallback_secret_change_in_production';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Gera um token JWT para o usuário
 * @param {object} payload - dados do usuário (id, email, role)
 * @returns {string} token JWT
 */
export function gerarToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

/**
 * Verifica e decodifica um token JWT
 * @param {string} token
 * @returns {object} payload decodificado
 */
export function verificarToken(token) {
  return jwt.verify(token, SECRET);
}
