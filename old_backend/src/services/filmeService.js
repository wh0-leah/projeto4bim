import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/database.js';
import { uploadArquivo } from '../config/supabase.js';
import { Filme } from '../models/index.js';

/**
 * Cria um novo filme
 */
export async function criarFilme(dados, usuarioId, arquivo = null) {
  // Instância OOP para validação (Critério 2)
  const filmeObj = new Filme({ id: uuidv4(), ...dados, usuarioCriadoPorId: usuarioId });

  let capaUrl = null;
  if (arquivo) {
    const path = `capas/filmes/${filmeObj.id}-${Date.now()}.${arquivo.originalname.split('.').pop()}`;
    capaUrl = await uploadArquivo(arquivo.buffer, path, arquivo.mimetype);
  }

  return prisma.filme.create({
    data: {
      id: filmeObj.id,
      titulo: filmeObj.titulo,
      diretor: filmeObj.diretor,
      generos: filmeObj.generos,
      elenco: filmeObj.elenco,
      anoLancamento: filmeObj.anoLancamento,
      duracao: filmeObj.duracao,
      sinopse: filmeObj.sinopse,
      classificacao: filmeObj.classificacao,
      capa: capaUrl,
      trailer: filmeObj.trailer,
      usuarioCriadoPorId: usuarioId,
    },
    include: { usuarioCriadoPor: { select: { id: true, nome: true } } },
  });
}

/**
 * Lista filmes com filtros opcionais
 */
export async function listarFilmes({ titulo, diretor, ator, genero, page = 1, limit = 20 } = {}) {
  const skip = (Number(page) - 1) * Number(limit);
  const where = {};

  if (titulo) where.titulo = { contains: titulo, mode: 'insensitive' };
  if (diretor) where.diretor = { contains: diretor, mode: 'insensitive' };
  if (genero) where.generos = { has: genero };
  if (ator) where.elenco = { has: ator };

  const [filmes, total] = await Promise.all([
    prisma.filme.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { mediaAvaliacao: 'desc' },
      include: { usuarioCriadoPor: { select: { id: true, nome: true } } },
    }),
    prisma.filme.count({ where }),
  ]);

  return { filmes, total, page: Number(page), totalPages: Math.ceil(total / limit) };
}

/**
 * Busca um filme por ID
 */
export async function obterFilme(id) {
  const filme = await prisma.filme.findUnique({
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
  if (!filme) throw new Error('Filme não encontrado.');
  return filme;
}

/**
 * Atualiza um filme
 */
export async function atualizarFilme(id, dados, usuarioId, role, arquivo = null) {
  const filme = await prisma.filme.findUnique({ where: { id } });
  if (!filme) throw new Error('Filme não encontrado.');
  if (filme.usuarioCriadoPorId !== usuarioId && role !== 'ADMIN') {
    throw new Error('Sem permissão para editar este filme.');
  }

  let capaUrl = filme.capa;
  if (arquivo) {
    const path = `capas/filmes/${id}-${Date.now()}.${arquivo.originalname.split('.').pop()}`;
    capaUrl = await uploadArquivo(arquivo.buffer, path, arquivo.mimetype);
  }

  return prisma.filme.update({
    where: { id },
    data: { ...dados, capa: capaUrl },
  });
}

/**
 * Remove um filme
 */
export async function removerFilme(id, usuarioId, role) {
  const filme = await prisma.filme.findUnique({ where: { id } });
  if (!filme) throw new Error('Filme não encontrado.');
  if (filme.usuarioCriadoPorId !== usuarioId && role !== 'ADMIN') {
    throw new Error('Sem permissão para remover este filme.');
  }
  await prisma.filme.delete({ where: { id } });
  return { mensagem: 'Filme removido com sucesso.' };
}

/**
 * Atualiza a média de avaliação do filme
 */
export async function recalcularMedia(filmeId) {
  const avaliacoes = await prisma.avaliacao.findMany({ where: { filmeId } });
  if (avaliacoes.length === 0) return;
  const media = avaliacoes.reduce((s, a) => s + a.nota, 0) / avaliacoes.length;
  await prisma.filme.update({ where: { id: filmeId }, data: { mediaAvaliacao: Math.round(media * 10) / 10 } });
}
