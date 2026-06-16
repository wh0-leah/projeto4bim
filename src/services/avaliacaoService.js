import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/database.js';
import { Avaliacao } from '../models/index.js';
import { recalcularMedia as recalcularMediaFilme } from './filmeService.js';
import { recalcularMedia as recalcularMediaSerie } from './serieService.js';

export async function criarAvaliacao({ nota, critica, conteudoId, tipo, usuarioId }) {
  
  new Avaliacao({ id: 'tmp', nota, critica, usuarioId, conteudoId, tipo });

  const data = {
    id: uuidv4(),
    nota: Number(nota),
    critica,
    usuarioId,
  };

  if (tipo === 'FILME') {
    const filme = await prisma.filme.findUnique({ where: { id: conteudoId } });
    if (!filme) throw new Error('Filme não encontrado.');
    data.filmeId = conteudoId;
  } else if (tipo === 'SERIE') {
    const serie = await prisma.serie.findUnique({ where: { id: conteudoId } });
    if (!serie) throw new Error('Série não encontrada.');
    data.serieId = conteudoId;
  } else {
    throw new Error('Tipo inválido. Use FILME ou SERIE.');
  }

  const avaliacao = await prisma.avaliacao.create({
    data,
    include: { usuario: { select: { id: true, nome: true, avatar: true } } },
  });

  
  if (tipo === 'FILME') await recalcularMediaFilme(conteudoId);
  else await recalcularMediaSerie(conteudoId);

  return avaliacao;
}

export async function listarAvaliacoes({ conteudoId, tipo, page = 1, limit = 20 }) {
  const skip = (Number(page) - 1) * Number(limit);
  const where = tipo === 'FILME' ? { filmeId: conteudoId } : { serieId: conteudoId };

  const [avaliacoes, total] = await Promise.all([
    prisma.avaliacao.findMany({
      where, skip, take: Number(limit),
      orderBy: { dataAvaliacao: 'desc' },
      include: { usuario: { select: { id: true, nome: true, avatar: true } } },
    }),
    prisma.avaliacao.count({ where }),
  ]);

  return { avaliacoes, total, page: Number(page), totalPages: Math.ceil(total / limit) };
}

export async function atualizarAvaliacao(id, { nota, critica }, usuarioId) {
  const avaliacao = await prisma.avaliacao.findUnique({ where: { id } });
  if (!avaliacao) throw new Error('Avaliação não encontrada.');
  if (avaliacao.usuarioId !== usuarioId) throw new Error('Sem permissão para editar esta avaliação.');

  const atualizada = await prisma.avaliacao.update({
    where: { id },
    data: { nota: Number(nota), critica, editada: true },
    include: { usuario: { select: { id: true, nome: true, avatar: true } } },
  });

  if (avaliacao.filmeId) await recalcularMediaFilme(avaliacao.filmeId);
  else if (avaliacao.serieId) await recalcularMediaSerie(avaliacao.serieId);

  return atualizada;
}

export async function removerAvaliacao(id, usuarioId, role) {
  const avaliacao = await prisma.avaliacao.findUnique({ where: { id } });
  if (!avaliacao) throw new Error('Avaliação não encontrada.');
  if (avaliacao.usuarioId !== usuarioId && role !== 'ADMIN') throw new Error('Sem permissão.');

  await prisma.avaliacao.delete({ where: { id } });

  if (avaliacao.filmeId) await recalcularMediaFilme(avaliacao.filmeId);
  else if (avaliacao.serieId) await recalcularMediaSerie(avaliacao.serieId);

  return { mensagem: 'Avaliação removida com sucesso.' };
}

export async function curtirAvaliacao(id) {
  const avaliacao = await prisma.avaliacao.findUnique({ where: { id } });
  if (!avaliacao) throw new Error('Avaliação não encontrada.');
  return prisma.avaliacao.update({ where: { id }, data: { curtidas: avaliacao.curtidas + 1 } });
}
