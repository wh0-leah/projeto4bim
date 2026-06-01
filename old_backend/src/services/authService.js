import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/database.js';
import { gerarToken } from '../config/jwt.js';
import { Usuario } from '../models/index.js';

/**
 * Cadastra um novo usuário
 */
export async function cadastrar({ nome, email, senha }) {
  const emailExiste = await prisma.usuario.findUnique({ where: { email } });
  if (emailExiste) throw new Error('E-mail já cadastrado.');

  const senhaHash = await bcrypt.hash(senha, 12);

  // Instancia o modelo OOP antes de persistir (Critério 2)
  const usuarioObj = new Usuario({
    id: uuidv4(),
    nome,
    email,
    senhaHash,
  });

  const usuarioDB = await prisma.usuario.create({
    data: {
      id: usuarioObj.id,
      nome: usuarioObj.nome,
      email: usuarioObj.email,
      senhaHash: usuarioObj.getSenhaHash(),
    },
  });

  const token = gerarToken({ id: usuarioDB.id, email: usuarioDB.email, role: usuarioDB.role });
  return { usuario: { id: usuarioDB.id, nome: usuarioDB.nome, email: usuarioDB.email, role: usuarioDB.role }, token };
}

/**
 * Realiza login do usuário
 */
export async function login({ email, senha }) {
  const usuarioDB = await prisma.usuario.findUnique({ where: { email } });
  if (!usuarioDB || !usuarioDB.ativo) throw new Error('E-mail ou senha inválidos.');

  const senhaValida = await bcrypt.compare(senha, usuarioDB.senhaHash);
  if (!senhaValida) throw new Error('E-mail ou senha inválidos.');

  const token = gerarToken({ id: usuarioDB.id, email: usuarioDB.email, role: usuarioDB.role });
  return {
    usuario: { id: usuarioDB.id, nome: usuarioDB.nome, email: usuarioDB.email, role: usuarioDB.role, avatar: usuarioDB.avatar },
    token,
  };
}

/**
 * Retorna perfil do usuário autenticado
 */
export async function obterPerfil(usuarioId) {
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    select: { id: true, nome: true, email: true, avatar: true, bio: true, role: true, dataCadastro: true },
  });
  if (!usuario) throw new Error('Usuário não encontrado.');
  return usuario;
}

/**
 * Atualiza perfil do usuário
 */
export async function atualizarPerfil(usuarioId, { nome, bio, avatar }) {
  return prisma.usuario.update({
    where: { id: usuarioId },
    data: { nome, bio, avatar },
    select: { id: true, nome: true, email: true, avatar: true, bio: true, role: true },
  });
}

/**
 * Altera senha do usuário
 */
export async function alterarSenha(usuarioId, { senhaAtual, novaSenha }) {
  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
  const senhaValida = await bcrypt.compare(senhaAtual, usuario.senhaHash);
  if (!senhaValida) throw new Error('Senha atual incorreta.');
  const novoHash = await bcrypt.hash(novaSenha, 12);
  await prisma.usuario.update({ where: { id: usuarioId }, data: { senhaHash: novoHash } });
  return { mensagem: 'Senha alterada com sucesso.' };
}
