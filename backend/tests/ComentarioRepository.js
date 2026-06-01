/*
  MODELO IMPORTADO:
  Traw a classe 'Comentario' para podermos criar as notas e opiniões (críticas)
  que os usuários dão aos filmes e séries.
*/
import { Comentario } from '../src/models/Comentario.js';

/*
  REPOSITÓRIO DE COMENTÁRIOS EM MEMÓRIA:
  Guarda todos os comentários e notas. Possui regras cruciais de validação,
  como não permitir que a mesma pessoa dê duas notas diferentes para o mesmo filme/série.
*/
export class ComentarioRepository {
  // Lista temporária que armazena todas as avaliações dadas no sistema
  static collection = [];

  /*
    ADICIONAR COMENTÁRIO COM TRAVA DE SEGURANÇA:
    Adiciona o comentário ao array, mas antes roda uma busca para ver se esse usuário
    já comentou esse mesmo conteúdo. Se já comentou, impede o processo para evitar trapaça.
  */
  static adicionar(comentario) {
    if (!(comentario instanceof Comentario)) throw new Error('Objeto deve ser instância de Comentario.');
    const existe = this.collection.find(
      c => c.usuarioId === comentario.usuarioId && c.conteudoId === comentario.conteudoId
    );
    if (existe) throw new Error('Usuário já avaliou este conteúdo.');
    this.collection.push(comentario);
    return comentario;
  }

  // Acha um comentário específico baseado no ID
  static buscarPorId(id) {
    return this.collection.find(c => c.id === id) || null;
  }

  // Retorna todas as opiniões dadas a um filme/série específico, ordenadas das mais recentes para as mais antigas
  static listarPorConteudo(conteudoId) {
    return this.collection
      .filter(c => c.conteudoId === conteudoId)
      .map(c => c.toJSON())
      .sort((a, b) => new Date(b.dataComentario) - new Date(a.dataComentario));
  }

  /*
    CALCULAR A MÉDIA DE NOTA DE UM FILME/SÉRIE:
    Soma todas as notas recebidas por um filme ou série e divide pela quantidade de avaliações.
    O resultado é arredondado com uma casa decimal (ex: 8.5). Se não houver notas, retorna 0.
  */
  static calcularMedia(conteudoId) {
    const comentarios = this.collection.filter(c => c.conteudoId === conteudoId);
    if (comentarios.length === 0) return 0;
    const soma = comentarios.reduce((acc, c) => acc + c.nota, 0);
    return Math.round((soma / comentarios.length) * 10) / 10;
  }

  // Apaga o comentário da lista usando o ID
  static remover(id) {
    const index = this.collection.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Avaliação não encontrada.');
    this.collection.splice(index, 1);
    return true;
  }

  // Apaga todos os comentários gravados na memória
  static limpar() {
    this.collection = [];
  }
}
