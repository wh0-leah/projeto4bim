/*
  MODELO IMPORTADO:
  Pega o modelo 'Serie' que possui informações específicas como diretores, temporadas,
  episódios e status da série.
*/
import { Serie } from '../src/models/Serie.js';

/*
  REPOSITÓRIO DE SÉRIES EM MEMÓRIA:
  Semelhante ao de filmes, mas com regras e filtros específicos para séries,
  como filtrar se a série já acabou (finalizada) ou ainda está lançando episódios.
*/
export class SerieRepository {
  // Array onde guardamos as séries temporariamente
  static collection = [];

  // Salva uma nova série no repositório se for um objeto válido de 'Serie'
  static adicionar(serie) {
    if (!(serie instanceof Serie)) throw new Error('Objeto deve ser instância de Serie.');
    this.collection.push(serie);
    return serie;
  }

  // Encontra uma série pelo ID
  static buscarPorId(id) {
    return this.collection.find(s => s.id === id) || null;
  }

  /*
    MÉTODO DE LISTAGEM COM FILTROS DE SÉRIE:
    Filtra as séries na nossa lista por gênero, diretor, elenco, título e status.
    Devolve em ordem decrescente de nota média de avaliação.
  */
  static listar({ genero, diretor, ator, titulo, status } = {}) {
    return this.collection
      .filter(s => !titulo || s.titulo.toLowerCase().includes(titulo.toLowerCase()))
      .filter(s => !diretor || s.temDiretor(diretor))
      .filter(s => !genero || s.generos.some(g => g.toLowerCase().includes(genero.toLowerCase())))
      .filter(s => !ator || s.temAtor(ator))
      .filter(s => !status || s.status === status)
      .map(s => s.toJSON())
      .sort((a, b) => b.mediaAvaliacao - a.mediaAvaliacao);
  }

  // Tira uma série da lista pelo ID, falhando caso o ID não pertença a nenhuma série
  static remover(id) {
    const index = this.collection.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Série não encontrada.');
    this.collection.splice(index, 1);
    return true;
  }

  // Esvazia as séries cadastradas
  static limpar() {
    this.collection = [];
  }
}
