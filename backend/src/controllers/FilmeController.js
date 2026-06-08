// =============================================================
// CONTROLLER: FilmeController
// Critério 3 (Entrega 2): Resiliência no fluxo da aplicação
// Cada função usa try/catch para interceptar erros lançados
// pelos modelos (validações com throw new Error) e repositórios,
// devolvendo a mensagem exata de erro como resposta JSON.
// =============================================================

import { Filme } from '../models/index.js';
import { FilmeRepository } from '../../tests/index.js';

/*
  CRIAR FILME:
  Instancia o modelo Filme com os dados recebidos. O construtor do Filme
  já executa validações severas nos setters (título obrigatório, ao menos 1 diretor,
  ao menos 1 gênero, ano entre 1888 e atual+2, etc). Se qualquer validação falhar,
  o throw new Error() é capturado pelo catch e retornado para a tela.
*/
export async function criar(req, res, next) {
  try {
    const { id, titulo, diretores, generos, elenco, anoLancamento, duracao, sinopse, classificacao, capa, trailer } = req.body;

    // O construtor do Filme valida todos os campos via setters (Critério 2)
    const filme = new Filme({
      id, titulo, diretores, generos, elenco, anoLancamento,
      duracao, sinopse, classificacao, capa, trailer,
    });

    // O repositório valida se é instância válida de Filme
    const salvo = FilmeRepository.adicionar(filme);
    res.status(201).json({ sucesso: true, dados: salvo.toJSON() });
  } catch (err) {
    // Captura erros como: 'Título é obrigatório.', 'Informe ao menos um diretor.', etc.
    res.status(400).json({ sucesso: false, erro: err.message });
  }
}

/*
  LISTAR FILMES COM FILTROS:
  Retorna filmes filtrados por título, gênero, diretor ou ator.
  O try/catch garante que erros de filtragem sejam capturados.
*/
export async function listar(req, res, next) {
  try {
    const filtros = {
      titulo: req.query.titulo,
      genero: req.query.genero,
      diretor: req.query.diretor,
      ator: req.query.ator,
    };
    const filmes = FilmeRepository.listar(filtros);
    res.json({ sucesso: true, dados: filmes });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

/*
  OBTER FILME POR ID:
  Busca um filme específico. Se não existir, lança erro com mensagem descritiva.
*/
export async function obter(req, res, next) {
  try {
    const filme = FilmeRepository.buscarPorId(req.params.id);
    if (!filme) throw new Error('Filme não encontrado.');
    res.json({ sucesso: true, dados: filme.toJSON() });
  } catch (err) {
    const status = err.message.includes('não encontrado') ? 404 : 500;
    res.status(status).json({ sucesso: false, erro: err.message });
  }
}

/*
  REMOVER FILME:
  Remove um filme pelo ID. O repositório lança erro se o ID não existir.
*/
export async function remover(req, res, next) {
  try {
    FilmeRepository.remover(req.params.id);
    res.json({ sucesso: true, mensagem: 'Filme removido com sucesso.' });
  } catch (err) {
    const status = err.message.includes('não encontrado') ? 404 : 500;
    res.status(status).json({ sucesso: false, erro: err.message });
  }
}
