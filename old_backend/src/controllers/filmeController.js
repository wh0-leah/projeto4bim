import * as filmeService from '../services/filmeService.js';

export async function criar(req, res, next) {
  try {
    const dados = {
      titulo: req.body.titulo,
      diretor: req.body.diretor,
      generos: Array.isArray(req.body.generos) ? req.body.generos : JSON.parse(req.body.generos || '[]'),
      elenco: Array.isArray(req.body.elenco) ? req.body.elenco : JSON.parse(req.body.elenco || '[]'),
      anoLancamento: req.body.anoLancamento,
      duracao: req.body.duracao,
      sinopse: req.body.sinopse,
      classificacao: req.body.classificacao,
      trailer: req.body.trailer,
    };
    const filme = await filmeService.criarFilme(dados, req.usuario.id, req.file);
    res.status(201).json(filme);
  } catch (err) { next(err); }
}

export async function listar(req, res, next) {
  try {
    const resultado = await filmeService.listarFilmes(req.query);
    res.json(resultado);
  } catch (err) { next(err); }
}

export async function obter(req, res, next) {
  try {
    const filme = await filmeService.obterFilme(req.params.id);
    res.json(filme);
  } catch (err) { next(err); }
}

export async function atualizar(req, res, next) {
  try {
    const dados = { ...req.body };
    if (req.body.generos && typeof req.body.generos === 'string') dados.generos = JSON.parse(req.body.generos);
    if (req.body.elenco && typeof req.body.elenco === 'string') dados.elenco = JSON.parse(req.body.elenco);
    const filme = await filmeService.atualizarFilme(req.params.id, dados, req.usuario.id, req.usuario.role, req.file);
    res.json(filme);
  } catch (err) { next(err); }
}

export async function remover(req, res, next) {
  try {
    const resultado = await filmeService.removerFilme(req.params.id, req.usuario.id, req.usuario.role);
    res.json(resultado);
  } catch (err) { next(err); }
}
