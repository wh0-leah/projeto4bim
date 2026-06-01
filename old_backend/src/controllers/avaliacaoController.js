import * as avaliacaoService from '../services/avaliacaoService.js';

export async function criar(req, res, next) {
  try {
    const { nota, critica, conteudoId, tipo } = req.body;
    const avaliacao = await avaliacaoService.criarAvaliacao({ nota, critica, conteudoId, tipo, usuarioId: req.usuario.id });
    res.status(201).json(avaliacao);
  } catch (err) { next(err); }
}

export async function listar(req, res, next) {
  try {
    const { conteudoId, tipo } = req.query;
    const resultado = await avaliacaoService.listarAvaliacoes({ conteudoId, tipo, ...req.query });
    res.json(resultado);
  } catch (err) { next(err); }
}

export async function atualizar(req, res, next) {
  try {
    const avaliacao = await avaliacaoService.atualizarAvaliacao(req.params.id, req.body, req.usuario.id);
    res.json(avaliacao);
  } catch (err) { next(err); }
}

export async function remover(req, res, next) {
  try {
    const resultado = await avaliacaoService.removerAvaliacao(req.params.id, req.usuario.id, req.usuario.role);
    res.json(resultado);
  } catch (err) { next(err); }
}

export async function curtir(req, res, next) {
  try {
    const avaliacao = await avaliacaoService.curtirAvaliacao(req.params.id);
    res.json(avaliacao);
  } catch (err) { next(err); }
}
