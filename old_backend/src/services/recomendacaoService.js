import prisma from '../config/database.js';

/**
 * Gera recomendações personalizadas com base em:
 * - Gêneros favoritos do usuário
 * - Conteúdos melhor avaliados pelo usuário
 * - Títulos favoritados
 */
export async function gerarRecomendacoes(usuarioId, limit = 10) {
  // 1. Busca as avaliações do usuário (nota >= 7)
  const avaliacoes = await prisma.avaliacao.findMany({
    where: { usuarioId, nota: { gte: 7 } },
    include: {
      filme: { select: { generos: true } },
      serie: { select: { generos: true } },
    },
  });

  // 2. Extrai os gêneros preferidos (Critério 3: métodos de arrays)
  const generosPreferidos = avaliacoes
    .flatMap(a => (a.filme?.generos || a.serie?.generos || []))
    .reduce((acc, g) => {
      acc[g] = (acc[g] || 0) + 1;
      return acc;
    }, {});

  const topGeneros = Object.entries(generosPreferidos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([g]) => g);

  // 3. IDs já avaliados para excluir das recomendações
  const filmeIdsAvaliados = avaliacoes.filter(a => a.filmeId).map(a => a.filmeId);
  const serieIdsAvaliadas = avaliacoes.filter(a => a.serieId).map(a => a.serieId);

  // 4. Busca filmes recomendados
  const filmesRec = await prisma.filme.findMany({
    where: {
      generos: topGeneros.length > 0 ? { hasSome: topGeneros } : undefined,
      id: { notIn: filmeIdsAvaliados },
      mediaAvaliacao: { gte: 6 },
    },
    orderBy: { mediaAvaliacao: 'desc' },
    take: Math.ceil(limit / 2),
    select: { id: true, titulo: true, capa: true, generos: true, mediaAvaliacao: true, anoLancamento: true },
  });

  // 5. Busca séries recomendadas
  const seriesRec = await prisma.serie.findMany({
    where: {
      generos: topGeneros.length > 0 ? { hasSome: topGeneros } : undefined,
      id: { notIn: serieIdsAvaliadas },
      mediaAvaliacao: { gte: 6 },
    },
    orderBy: { mediaAvaliacao: 'desc' },
    take: Math.floor(limit / 2),
    select: { id: true, titulo: true, banner: true, generos: true, mediaAvaliacao: true, anoInicio: true },
  });

  return {
    generosPreferidos: topGeneros,
    filmes: filmesRec.map(f => ({ ...f, tipo: 'FILME' })),
    series: seriesRec.map(s => ({ ...s, tipo: 'SERIE' })),
    total: filmesRec.length + seriesRec.length,
  };
}

/**
 * Retorna os títulos mais bem avaliados (trending)
 */
export async function obterTrending(limit = 10) {
  const [filmes, series] = await Promise.all([
    prisma.filme.findMany({
      where: { mediaAvaliacao: { gte: 7 } },
      orderBy: { mediaAvaliacao: 'desc' },
      take: limit,
      select: { id: true, titulo: true, capa: true, generos: true, mediaAvaliacao: true, anoLancamento: true },
    }),
    prisma.serie.findMany({
      where: { mediaAvaliacao: { gte: 7 } },
      orderBy: { mediaAvaliacao: 'desc' },
      take: limit,
      select: { id: true, titulo: true, banner: true, generos: true, mediaAvaliacao: true, anoInicio: true },
    }),
  ]);

  return {
    filmes: filmes.map(f => ({ ...f, tipo: 'FILME' })),
    series: series.map(s => ({ ...s, tipo: 'SERIE' })),
  };
}
