import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET || 'fallback_secret_change_in_production';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export function gerarToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function verificarToken(token) {
  return jwt.verify(token, SECRET);
}
