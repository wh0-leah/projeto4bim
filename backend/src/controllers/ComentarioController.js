// =============================================================
// CONTROLLER: ComentarioController
// Critério 3 (Entrega 2): Resiliência no fluxo da aplicação
// Usa try/catch para capturar erros de validação do modelo Comentario
// (nota entre 0-10) e do repositório (avaliação duplicada).
// =============================================================

import { Comentario } from '../models/index.js';
import { ComentarioRepository } from '../../tests/index.js';

/*
  CRIAR COMENTÁRIO/AVALIAÇÃO:
  Instancia o modelo Comentario, que valida a nota (deve ser entre 0 e 10).
  O repositório também valida se o usuário já avaliou o mesmo conteúdo.
  Ambos os erros são capturados pelo try/catch e reenviados para a tela.
*/
export async function criar(req, res, next) {
  try {
    const { id, nota, critica, usuarioId, conteudoId } = req.body;

    // O setter de 'nota' valida se está entre 0 e 10 (Critério 2)
    const comentario = new Comentario({ id, nota, critica, usuarioId, conteudoId });

    // O repositório verifica avaliação duplicada (mesmo usuário + conteúdo)
    const salvo = ComentarioRepository.adicionar(comentario);
    res.status(201).json({ sucesso: true, dados: salvo.toJSON() });
  } catch (err) {
    // Ex: 'Nota deve estar entre 0 e 10.' ou 'Usuário já avaliou este conteúdo.'
    res.status(400).json({ sucesso: false, erro: err.message });
  }
}

/*
  LISTAR COMENTÁRIOS DE UM CONTEÚDO:
  Retorna todos os comentários/avaliações de um filme ou série, ordenados do mais recente.
*/
export async function listarPorConteudo(req, res, next) {
  try {
    const { conteudoId } = req.params;
    if (!conteudoId) throw new Error('Parâmetro "conteudoId" é obrigatório.');
    const comentarios = ComentarioRepository.listarPorConteudo(conteudoId);
    res.json({ sucesso: true, dados: comentarios });
  } catch (err) {
    res.status(400).json({ sucesso: false, erro: err.message });
  }
}

/*
  CALCULAR MÉDIA DE UM CONTEÚDO:
  Calcula a média aritmética das notas dadas a um filme ou série.
*/
export async function calcularMedia(req, res, next) {
  try {
    const { conteudoId } = req.params;
    if (!conteudoId) throw new Error('Parâmetro "conteudoId" é obrigatório.');
    const media = ComentarioRepository.calcularMedia(conteudoId);
    res.json({ sucesso: true, dados: { conteudoId, media } });
  } catch (err) {
    res.status(400).json({ sucesso: false, erro: err.message });
  }
}

/*
  REMOVER COMENTÁRIO:
  Remove um comentário pelo ID. Retorna erro 404 se não encontrado.
*/
export async function remover(req, res, next) {
  try {
    ComentarioRepository.remover(req.params.id);
    res.json({ sucesso: true, mensagem: 'Avaliação removida com sucesso.' });
  } catch (err) {
    const status = err.message.includes('não encontrad') ? 404 : 500;
    res.status(status).json({ sucesso: false, erro: err.message });
  }
}
