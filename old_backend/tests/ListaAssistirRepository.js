/*
  MODELO IMPORTADO:
  Traz a classe 'ListaAssistir' (que é a nossa playlist de filmes e séries a assistir).
*/
import { ListaAssistir } from '../src/models/ListaAssistir.js';

/*
  REPOSITÓRIO DE PLAYLISTS/LISTAS DE ASSISTIR EM MEMÓRIA:
  Permite salvar e gerenciar as listas de reprodução dos usuários.
*/
export class ListaAssistirRepository {
  // Nosso array temporário de listas salvas
  static collection = [];

  // Salva a lista inteira se ela for uma instância válida de ListaAssistir
  static adicionar(lista) {
    if (!(lista instanceof ListaAssistir)) throw new Error('Objeto deve ser instância de ListaAssistir.');
    this.collection.push(lista);
    return lista;
  }

  // Busca uma lista específica através do ID único dela
  static buscarPorId(id) {
    return this.collection.find(l => l.id === id) || null;
  }

  // Busca e retorna todas as playlists que pertencem a um usuário específico
  static listarDoUsuario(usuarioId) {
    return this.collection
      .filter(l => l.usuarioId === usuarioId)
      .map(l => l.toJSON());
  }

  // Deleta uma playlist inteira da lista usando o ID dela
  static remover(id) {
    const index = this.collection.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Lista não encontrada.');
    this.collection.splice(index, 1);
    return true;
  }

  // Reseta as playlists registradas
  static limpar() {
    this.collection = [];
  }
}
