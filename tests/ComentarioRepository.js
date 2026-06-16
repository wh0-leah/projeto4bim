import { Comentario } from '../src/models/Comentario.js';
export class ComentarioRepository {
  
  static collection = [];

  static adicionar(comentario) {
    if (!(comentario instanceof Comentario)) throw new Error('Objeto deve ser instância de Comentario.');
    const existe = this.collection.find(
      c => c.usuarioId === comentario.usuarioId && c.conteudoId === comentario.conteudoId
    );
    if (existe) throw new Error('Usuário já avaliou este conteúdo.');
    this.collection.push(comentario);
    return comentario;
  }

  
  static buscarPorId(id) {
    return this.collection.find(c => c.id === id) || null;
  }

  
  static listarPorConteudo(conteudoId) {
    return this.collection
      .filter(c => c.conteudoId === conteudoId)
      .map(c => c.toJSON())
      .sort((a, b) => new Date(b.dataComentario) - new Date(a.dataComentario));
  }

  static calcularMedia(conteudoId) {
    const comentarios = this.collection.filter(c => c.conteudoId === conteudoId);
    if (comentarios.length === 0) return 0;
    const soma = comentarios.reduce((acc, c) => acc + c.nota, 0);
    return Math.round((soma / comentarios.length) * 10) / 10;
  }

  static remover(id) {
    const index = this.collection.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Avaliação não encontrada.');
    this.collection.splice(index, 1);
    return true;
  }

  static limpar() {
    this.collection = [];
  }
}
