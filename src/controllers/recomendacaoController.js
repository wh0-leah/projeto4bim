import * as recService from '../services/recomendacaoService.js';

export async function recomendacoes(req, res, next) {
  try {
    const resultado = await recService.gerarRecomendacoes(req.usuario.id, Number(req.query.limit) || 10);
    res.json(resultado);
  } catch (err) { next(err); }
}

export async function trending(req, res, next) {
  try {
    const resultado = await recService.obterTrending(Number(req.query.limit) || 10);
    res.json(resultado);
  } catch (err) { next(err); }
}
