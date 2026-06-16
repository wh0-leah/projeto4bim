import { Serie } from '../src/models/Serie.js';

export class SerieRepository {
  
  static collection = [];

  
  static adicionar(serie) {
    if (!(serie instanceof Serie)) throw new Error('Objeto deve ser instância de Serie.');
    this.collection.push(serie);
    return serie;
  }

  
  static buscarPorId(id) {
    return this.collection.find(s => s.id === id) || null;
  }

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
 
  static remover(id) {
    const index = this.collection.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Série não encontrada.');
    this.collection.splice(index, 1);
    return true;
  }
  
  static limpar() {
    this.collection = [];
  }
}
