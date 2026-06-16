import { ListaAssistir } from '../src/models/ListaAssistir.js';
export class ListaAssistirRepository {
  
  static collection = [];

  static adicionar(lista) {
    if (!(lista instanceof ListaAssistir)) throw new Error('Objeto deve ser instância de ListaAssistir.');
    this.collection.push(lista);
    return lista;
  }

  
  static buscarPorId(id) {
    return this.collection.find(l => l.id === id) || null;
  }

  static listarDoUsuario(usuarioId) {
    return this.collection
      .filter(l => l.usuarioId === usuarioId)
      .map(l => l.toJSON());
  }
  
  static remover(id) {
    const index = this.collection.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Lista não encontrada.');
    this.collection.splice(index, 1);
    return true;
  }
  
  static limpar() {
    this.collection = [];
  }
}
