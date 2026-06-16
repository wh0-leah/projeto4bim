import * as listaService from '../services/listaService.js';

export async function criar(req, res, next) {
  try {
    const lista = await listaService.criarLista(req.body, req.usuario.id);
    res.status(201).json(lista);
  } catch (err) { next(err); }
}

export async function listar(req, res, next) {
  try {
    const listas = await listaService.listarListasDoUsuario(req.usuario.id);
    res.json(listas);
  } catch (err) { next(err); }
}

export async function obter(req, res, next) {
  try {
    const lista = await listaService.obterLista(req.params.id, req.usuario.id);
    res.json(lista);
  } catch (err) { next(err); }
}

export async function adicionarItem(req, res, next) {
  try {
    const item = await listaService.adicionarItemNaLista({ listaId: req.params.id, ...req.body }, req.usuario.id);
    res.status(201).json(item);
  } catch (err) { next(err); }
}

export async function atualizarItem(req, res, next) {
  try {
    const item = await listaService.atualizarStatusItem(req.params.itemId, req.body, req.usuario.id);
    res.json(item);
  } catch (err) { next(err); }
}

export async function removerItem(req, res, next) {
  try {
    const resultado = await listaService.removerItemDaLista(req.params.itemId, req.usuario.id);
    res.json(resultado);
  } catch (err) { next(err); }
}

export async function remover(req, res, next) {
  try {
    const resultado = await listaService.removerLista(req.params.id, req.usuario.id);
    res.json(resultado);
  } catch (err) { next(err); }
}

export async function favoritos(req, res, next) {
  try {
    const itens = await listaService.obterFavoritos(req.usuario.id);
    res.json(itens);
  } catch (err) { next(err); }
}
