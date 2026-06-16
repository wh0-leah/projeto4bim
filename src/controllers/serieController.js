import * as serieService from '../services/serieService.js';

export async function criar(req, res, next) {
  try {
    const dados = {
      titulo: req.body.titulo,
      criador: req.body.criador,
      generos: Array.isArray(req.body.generos) ? req.body.generos : JSON.parse(req.body.generos || '[]'),
      elenco: Array.isArray(req.body.elenco) ? req.body.elenco : JSON.parse(req.body.elenco || '[]'),
      temporadas: req.body.temporadas,
      anoInicio: req.body.anoInicio,
      anoFim: req.body.anoFim,
      status: req.body.status,
      sinopse: req.body.sinopse,
      classificacao: req.body.classificacao,
      trailer: req.body.trailer,
    };
    const serie = await serieService.criarSerie(dados, req.usuario.id, req.file);
    res.status(201).json(serie);
  } catch (err) { next(err); }
}

export async function listar(req, res, next) {
  try {
    const resultado = await serieService.listarSeries(req.query);
    res.json(resultado);
  } catch (err) { next(err); }
}

export async function obter(req, res, next) {
  try {
    const serie = await serieService.obterSerie(req.params.id);
    res.json(serie);
  } catch (err) { next(err); }
}

export async function atualizar(req, res, next) {
  try {
    const dados = { ...req.body };
    if (req.body.generos && typeof req.body.generos === 'string') dados.generos = JSON.parse(req.body.generos);
    if (req.body.elenco && typeof req.body.elenco === 'string') dados.elenco = JSON.parse(req.body.elenco);
    const serie = await serieService.atualizarSerie(req.params.id, dados, req.usuario.id, req.usuario.role, req.file);
    res.json(serie);
  } catch (err) { next(err); }
}

export async function remover(req, res, next) {
  try {
    const resultado = await serieService.removerSerie(req.params.id, req.usuario.id, req.usuario.role);
    res.json(resultado);
  } catch (err) { next(err); }
}
