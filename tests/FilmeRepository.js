import { Filme } from '../src/models/Filme.js';

export class FilmeRepository {
  
  static collection = [];

  
  static adicionar(filme) {
    if (!(filme instanceof Filme)) throw new Error('Objeto deve ser instância de Filme.');
    this.collection.push(filme);
    return filme;
  }
  
  static buscarPorId(id) {
    return this.collection.find(f => f.id === id) || null;
  }

  static listar({ genero, diretor, ator, titulo } = {}) {
    return this.collection
      .filter(f => !titulo || f.titulo.toLowerCase().includes(titulo.toLowerCase()))
      .filter(f => !diretor || f.temDiretor(diretor))
      .filter(f => !genero || f.generos.some(g => g.toLowerCase().includes(genero.toLowerCase())))
      .filter(f => !ator || f.temAtor(ator))
      .map(f => f.toJSON())
      .sort((a, b) => b.mediaAvaliacao - a.mediaAvaliacao);
  }
  
  static remover(id) {
    const index = this.collection.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Filme não encontrado.');
    this.collection.splice(index, 1);
    return true;
  }

  static limpar() {
    this.collection = [];
  }
}
