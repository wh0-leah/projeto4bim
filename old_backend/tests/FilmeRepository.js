/*
  MODELO IMPORTADO:
  Trazemos a definição de como é um 'Filme' (seus atributos como título, diretor, ano)
  para que possamos criar filmes válidos para os testes.
*/
import { Filme } from '../src/models/Filme.js';

/*
  REPOSITÓRIO DE FILMES EM MEMÓRIA:
  Guarda e organiza a nossa lista de filmes. Tem funções para adicionar,
  buscar pelo ID, listar com vários filtros e apagar filmes do catálogo.
*/
export class FilmeRepository {
  // Array que funciona como a nossa estante/banco de dados provisório de filmes
  static collection = [];

  // Adiciona um filme à nossa estante, verificando antes se ele é uma instância válida da classe Filme
  static adicionar(filme) {
    if (!(filme instanceof Filme)) throw new Error('Objeto deve ser instância de Filme.');
    this.collection.push(filme);
    return filme;
  }

  // Procura um filme na lista pelo seu ID único
  static buscarPorId(id) {
    return this.collection.find(f => f.id === id) || null;
  }

  /*
    MÉTODO DE LISTAGEM COM FILTROS:
    Retorna os filmes cadastrados aplicando os filtros informados (como gênero, diretor, ator ou parte do título).
    No final, ordena a lista colocando os filmes mais bem avaliados primeiro.
  */
  static listar({ genero, diretor, ator, titulo } = {}) {
    return this.collection
      .filter(f => !titulo || f.titulo.toLowerCase().includes(titulo.toLowerCase()))
      .filter(f => !diretor || f.diretor.toLowerCase().includes(diretor.toLowerCase()))
      .filter(f => !genero || f.generos.some(g => g.toLowerCase().includes(genero.toLowerCase())))
      .filter(f => !ator || f.temAtor(ator))
      .map(f => f.toJSON())
      .sort((a, b) => b.mediaAvaliacao - a.mediaAvaliacao);
  }

  // Remove um filme da nossa lista. Se o filme com o ID informado não existir, avisa que deu erro
  static remover(id) {
    const index = this.collection.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Filme não encontrado.');
    this.collection.splice(index, 1);
    return true;
  }

  // Esvazia completamente a estante de filmes para começar um teste limpo
  static limpar() {
    this.collection = [];
  }
}
