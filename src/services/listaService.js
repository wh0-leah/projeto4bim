import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/database.js';

export async function criarLista({ nome, publica = false }, usuarioId) {
  return prisma.listaAssistir.create({
    data: { id: uuidv4(), nome, publica, usuarioId },
    include: { itens: true },
  });
}

export async function listarListasDoUsuario(usuarioId) {
  return prisma.listaAssistir.findMany({
    where: { usuarioId },
    include: {
      itens: {
        include: {
          filme: { select: { id: true, titulo: true, capa: true } },
          serie: { select: { id: true, titulo: true, banner: true } },
        },
      },
      _count: { select: { itens: true } },
    },
    orderBy: { dataCriacao: 'desc' },
  });
}

export async function obterLista(id, usuarioId) {
  const lista = await prisma.listaAssistir.findUnique({
    where: { id },
    include: {
      itens: {
        include: {
          filme: { select: { id: true, titulo: true, capa: true, generos: true, mediaAvaliacao: true } },
          serie: { select: { id: true, titulo: true, banner: true, generos: true, mediaAvaliacao: true } },
        },
        orderBy: { dataAdicionado: 'desc' },
      },
    },
  });
  if (!lista) throw new Error('Lista não encontrada.');
  if (!lista.publica && lista.usuarioId !== usuarioId) throw new Error('Acesso negado.');
  return lista;
}

export async function adicionarItemNaLista({ listaId, filmeId, serieId }, usuarioId) {
  const lista = await prisma.listaAssistir.findUnique({ where: { id: listaId } });
  if (!lista) throw new Error('Lista não encontrada.');
  if (lista.usuarioId !== usuarioId) throw new Error('Sem permissão.');

  
  const jaExiste = await prisma.itemLista.findFirst({
    where: { listaId, filmeId: filmeId || undefined, serieId: serieId || undefined },
  });
  if (jaExiste) throw new Error('Item já está na lista.');

  return prisma.itemLista.create({
    data: { id: uuidv4(), listaId, filmeId: filmeId || null, serieId: serieId || null },
    include: {
      filme: { select: { id: true, titulo: true, capa: true } },
      serie: { select: { id: true, titulo: true, banner: true } },
    },
  });
}

export async function atualizarStatusItem(itemId, { status, favoritado }, usuarioId) {
  const item = await prisma.itemLista.findUnique({
    where: { id: itemId },
    include: { lista: true },
  });
  if (!item) throw new Error('Item não encontrado.');
  if (item.lista.usuarioId !== usuarioId) throw new Error('Sem permissão.');

  return prisma.itemLista.update({
    where: { id: itemId },
    data: {
      status: status !== undefined ? status : item.status,
      favoritado: favoritado !== undefined ? favoritado : item.favoritado,
    },
  });
}

export async function removerItemDaLista(itemId, usuarioId) {
  const item = await prisma.itemLista.findUnique({
    where: { id: itemId },
    include: { lista: true },
  });
  if (!item) throw new Error('Item não encontrado.');
  if (item.lista.usuarioId !== usuarioId) throw new Error('Sem permissão.');
  await prisma.itemLista.delete({ where: { id: itemId } });
  return { mensagem: 'Item removido da lista.' };
}

export async function removerLista(id, usuarioId) {
  const lista = await prisma.listaAssistir.findUnique({ where: { id } });
  if (!lista) throw new Error('Lista não encontrada.');
  if (lista.usuarioId !== usuarioId) throw new Error('Sem permissão.');
  await prisma.listaAssistir.delete({ where: { id } });
  return { mensagem: 'Lista removida com sucesso.' };
}

export async function obterFavoritos(usuarioId) {
  return prisma.itemLista.findMany({
    where: {
      lista: { usuarioId },
      favoritado: true,
    },
    include: {
      filme: { select: { id: true, titulo: true, capa: true, generos: true, mediaAvaliacao: true } },
      serie: { select: { id: true, titulo: true, banner: true, generos: true, mediaAvaliacao: true } },
    },
    orderBy: { dataAdicionado: 'desc' },
  });
}
