import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/database.js';
import { uploadArquivo } from '../config/supabase.js';
import { Serie } from '../models/index.js';

export async function criarSerie(dados, usuarioId, arquivo = null) {
  const serieObj = new Serie({ id: uuidv4(), ...dados, usuarioCriadoPorId: usuarioId });

  let bannerUrl = null;
  if (arquivo) {
    const path = `banners/series/${serieObj.id}-${Date.now()}.${arquivo.originalname.split('.').pop()}`;
    bannerUrl = await uploadArquivo(arquivo.buffer, path, arquivo.mimetype);
  }

  return prisma.serie.create({
    data: {
      id: serieObj.id,
      titulo: serieObj.titulo,
      criador: serieObj.criador,
      generos: serieObj.generos,
      elenco: serieObj.elenco,
      temporadas: serieObj.temporadas,
      anoInicio: serieObj.anoInicio,
      anoFim: serieObj.anoFim,
      status: serieObj.status,
      sinopse: serieObj.sinopse,
      classificacao: serieObj.classificacao,
      banner: bannerUrl,
      trailer: serieObj.trailer,
      usuarioCriadoPorId: usuarioId,
    },
    include: { usuarioCriadoPor: { select: { id: true, nome: true } } },
  });
}

export async function listarSeries({ titulo, criador, ator, genero, status, page = 1, limit = 20 } = {}) {
  const skip = (Number(page) - 1) * Number(limit);
  const where = {};

  if (titulo) where.titulo = { contains: titulo, mode: 'insensitive' };
  if (criador) where.criador = { contains: criador, mode: 'insensitive' };
  if (genero) where.generos = { has: genero };
  if (ator) where.elenco = { has: ator };
  if (status) where.status = status;

  const [series, total] = await Promise.all([
    prisma.serie.findMany({
      where, skip, take: Number(limit),
      orderBy: { mediaAvaliacao: 'desc' },
      include: { usuarioCriadoPor: { select: { id: true, nome: true } } },
    }),
    prisma.serie.count({ where }),
  ]);

  return { series, total, page: Number(page), totalPages: Math.ceil(total / limit) };
}

export async function obterSerie(id) {
  const serie = await prisma.serie.findUnique({
    where: { id },
    include: {
      usuarioCriadoPor: { select: { id: true, nome: true } },
      avaliacoes: {
        include: { usuario: { select: { id: true, nome: true, avatar: true } } },
        orderBy: { dataAvaliacao: 'desc' },
        take: 10,
      },
    },
  });
  if (!serie) throw new Error('Série não encontrada.');
  return serie;
}

export async function atualizarSerie(id, dados, usuarioId, role, arquivo = null) {
  const serie = await prisma.serie.findUnique({ where: { id } });
  if (!serie) throw new Error('Série não encontrada.');
  if (serie.usuarioCriadoPorId !== usuarioId && role !== 'ADMIN') {
    throw new Error('Sem permissão para editar esta série.');
  }

  let bannerUrl = serie.banner;
  if (arquivo) {
    const path = `banners/series/${id}-${Date.now()}.${arquivo.originalname.split('.').pop()}`;
    bannerUrl = await uploadArquivo(arquivo.buffer, path, arquivo.mimetype);
  }

  return prisma.serie.update({ where: { id }, data: { ...dados, banner: bannerUrl } });
}

export async function removerSerie(id, usuarioId, role) {
  const serie = await prisma.serie.findUnique({ where: { id } });
  if (!serie) throw new Error('Série não encontrada.');
  if (serie.usuarioCriadoPorId !== usuarioId && role !== 'ADMIN') {
    throw new Error('Sem permissão para remover esta série.');
  }
  await prisma.serie.delete({ where: { id } });
  return { mensagem: 'Série removida com sucesso.' };
}

export async function recalcularMedia(serieId) {
  const avaliacoes = await prisma.avaliacao.findMany({ where: { serieId } });
  if (avaliacoes.length === 0) return;
  const media = avaliacoes.reduce((s, a) => s + a.nota, 0) / avaliacoes.length;
  await prisma.serie.update({ where: { id: serieId }, data: { mediaAvaliacao: Math.round(media * 10) / 10 } });
}
