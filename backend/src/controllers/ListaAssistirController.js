// =============================================================
// CONTROLLER: ListaAssistirController
// Critério 3 (Entrega 2): Resiliência no fluxo da aplicação
// Usa try/catch em cada operação para capturar erros dos modelos
// (nome obrigatório, item duplicado, item não encontrado) e dos
// repositórios (lista não encontrada, tipo inválido).
// =============================================================

import { ListaAssistir } from '../models/index.js';
import { ListaAssistirRepository } from '../../tests/index.js';

/*
  CRIAR LISTA DE ASSISTIR:
  Instancia o modelo ListaAssistir, que valida o nome (obrigatório).
  Se a validação falhar, o catch captura e retorna o erro para a tela.
*/
export async function criar(req, res, next) {
  try {
    const { id, nome, usuarioId, publica } = req.body;

    // O setter de 'nome' valida se não é vazio (Critério 2)
    const lista = new ListaAssistir({ id, nome, usuarioId, publica });

    const salva = ListaAssistirRepository.adicionar(lista);
    res.status(201).json({ sucesso: true, dados: salva.toJSON() });
  } catch (err) {
    // Ex: 'Nome da lista é obrigatório.'
    res.status(400).json({ sucesso: false, erro: err.message });
  }
}

/*
  LISTAR PLAYLISTS DO USUÁRIO:
  Retorna todas as listas de um usuário específico.
*/
export async function listarDoUsuario(req, res, next) {
  try {
    const { usuarioId } = req.params;
    if (!usuarioId) throw new Error('Parâmetro "usuarioId" é obrigatório.');
    const listas = ListaAssistirRepository.listarDoUsuario(usuarioId);
    res.json({ sucesso: true, dados: listas });
  } catch (err) {
    res.status(400).json({ sucesso: false, erro: err.message });
  }
}

/*
  OBTER LISTA POR ID:
  Busca uma lista específica. Retorna erro 404 se não existir.
*/
export async function obter(req, res, next) {
  try {
    const lista = ListaAssistirRepository.buscarPorId(req.params.id);
    if (!lista) throw new Error('Lista não encontrada.');
    res.json({ sucesso: true, dados: lista.toJSON() });
  } catch (err) {
    const status = err.message.includes('não encontrad') ? 404 : 500;
    res.status(status).json({ sucesso: false, erro: err.message });
  }
}

/*
  ADICIONAR ITEM À LISTA:
  Busca a lista pelo ID, depois chama o método adicionarItem() do modelo,
  que valida se o item já existe na lista (throw new Error se duplicado).
*/
export async function adicionarItem(req, res, next) {
  try {
    const lista = ListaAssistirRepository.buscarPorId(req.params.id);
    if (!lista) throw new Error('Lista não encontrada.');

    const { conteudoId, tipo, titulo, capa } = req.body;

    // O método do modelo valida duplicação: 'Título já está na lista.'
    lista.adicionarItem({ conteudoId, tipo, titulo, capa });

    res.status(201).json({ sucesso: true, dados: lista.toJSON() });
  } catch (err) {
    // Ex: 'Título já está na lista.' ou 'Lista não encontrada.'
    const status = err.message.includes('não encontrad') ? 404 : 400;
    res.status(status).json({ sucesso: false, erro: err.message });
  }
}

/*
  REMOVER ITEM DA LISTA:
  Remove um item da lista pelo conteudoId. O modelo lança erro se o item
  não existir na lista.
*/
export async function removerItem(req, res, next) {
  try {
    const lista = ListaAssistirRepository.buscarPorId(req.params.id);
    if (!lista) throw new Error('Lista não encontrada.');

    // O método do modelo valida: 'Item não encontrado na lista.'
    lista.removerItem(req.params.conteudoId);

    res.json({ sucesso: true, dados: lista.toJSON() });
  } catch (err) {
    const status = err.message.includes('não encontrad') ? 404 : 400;
    res.status(status).json({ sucesso: false, erro: err.message });
  }
}

/*
  MARCAR ITEM COMO ASSISTIDO:
  Atualiza o status de um item para 'ASSISTIDO'. O modelo lança erro
  se o item não existir na lista.
*/
export async function marcarAssistido(req, res, next) {
  try {
    const lista = ListaAssistirRepository.buscarPorId(req.params.id);
    if (!lista) throw new Error('Lista não encontrada.');

    lista.marcarComoAssistido(req.params.conteudoId);

    res.json({ sucesso: true, dados: lista.toJSON() });
  } catch (err) {
    const status = err.message.includes('não encontrad') ? 404 : 400;
    res.status(status).json({ sucesso: false, erro: err.message });
  }
}

/*
  REMOVER LISTA:
  Deleta uma lista inteira pelo ID. O repositório lança erro se não existir.
*/
export async function remover(req, res, next) {
  try {
    ListaAssistirRepository.remover(req.params.id);
    res.json({ sucesso: true, mensagem: 'Lista removida com sucesso.' });
  } catch (err) {
    const status = err.message.includes('não encontrad') ? 404 : 500;
    res.status(status).json({ sucesso: false, erro: err.message });
  }
}
