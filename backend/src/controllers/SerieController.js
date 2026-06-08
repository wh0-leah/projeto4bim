// =============================================================
// CONTROLLER: SerieController
// Critério 3 (Entrega 2): Resiliência no fluxo da aplicação
// Todos os métodos possuem try/catch que capturam os erros de
// validação lançados pelo modelo Serie (título, diretores, gêneros,
// temporadas, status, média) e retornam a mensagem para o frontend.
// =============================================================

import { Serie } from '../models/index.js';
import { SerieRepository } from '../../tests/index.js';

/*
  CRIAR SÉRIE:
  Instancia o modelo Serie, que roda validações rigorosas nos setters:
  - Título obrigatório
  - Ao menos 1 diretor e 1 gênero
  - Temporadas >= 1
  - Status deve ser 'EM_ANDAMENTO', 'FINALIZADA' ou 'CANCELADA'
  - Média de avaliação entre 0 e 10
  Se qualquer validação falhar, o catch captura e retorna o erro.
*/
export async function criar(req, res, next) {
  try {
    const {
      id, titulo, diretores, generos, elenco, temporadas,
      anoInicio, anoFim, status, sinopse, classificacao, capa, trailer,
    } = req.body;

    // Construtor valida cada campo via setters com throw new Error()
    const serie = new Serie({
      id, titulo, diretores, generos, elenco, temporadas,
      anoInicio, anoFim, status, sinopse, classificacao, capa, trailer,
    });

    const salva = SerieRepository.adicionar(serie);
    res.status(201).json({ sucesso: true, dados: salva.toJSON() });
  } catch (err) {
    // Ex: 'Título é obrigatório.', 'Status inválido. Use: EM_ANDAMENTO, FINALIZADA, CANCELADA'
    res.status(400).json({ sucesso: false, erro: err.message });
  }
}

/*
  LISTAR SÉRIES COM FILTROS:
  Aceita filtros por título, gênero, diretor, ator e status da série.
*/
export async function listar(req, res, next) {
  try {
    const filtros = {
      titulo: req.query.titulo,
      genero: req.query.genero,
      diretor: req.query.diretor,
      ator: req.query.ator,
      status: req.query.status,
    };
    const series = SerieRepository.listar(filtros);
    res.json({ sucesso: true, dados: series });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

/*
  OBTER SÉRIE POR ID:
  Busca uma série específica pelo ID. Lança erro 404 se não existir.
*/
export async function obter(req, res, next) {
  try {
    const serie = SerieRepository.buscarPorId(req.params.id);
    if (!serie) throw new Error('Série não encontrada.');
    res.json({ sucesso: true, dados: serie.toJSON() });
  } catch (err) {
    const status = err.message.includes('não encontrad') ? 404 : 500;
    res.status(status).json({ sucesso: false, erro: err.message });
  }
}

/*
  REMOVER SÉRIE:
  Remove uma série pelo ID. O repositório lança erro se não encontrar.
*/
export async function remover(req, res, next) {
  try {
    SerieRepository.remover(req.params.id);
    res.json({ sucesso: true, mensagem: 'Série removida com sucesso.' });
  } catch (err) {
    const status = err.message.includes('não encontrad') ? 404 : 500;
    res.status(status).json({ sucesso: false, erro: err.message });
  }
}
