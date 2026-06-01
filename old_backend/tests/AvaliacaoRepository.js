/*
  MODELO IMPORTADO:
  Traz a classe 'Avaliacao' para podermos criar as notas e opiniões (críticas)
  que os usuários dão aos filmes e séries.
*/
import { Avaliacao } from '../src/models/Avaliacao.js';

/*
  REPOSITÓRIO DE AVALIAÇÕES EM MEMÓRIA:
  Guarda todos os comentários e notas. Possui regras cruciais de validação,
  como não permitir que a mesma pessoa dê duas notas diferentes para o mesmo filme/série.
*/
export class AvaliacaoRepository {
  // Lista temporária que armazena todas as avaliações dadas no sistema
  static collection = [];

  /*
    ADICIONAR AVALIAÇÃO COM TRAVA DE SEGURANÇA:
    Adiciona a avaliação ao array, mas antes roda uma busca para ver se esse usuário
    já avaliou esse mesmo conteúdo. Se já avaliou, impede o processo para evitar trapaça.
  */
  static adicionar(avaliacao) {
    if (!(avaliacao instanceof Avaliacao)) throw new Error('Objeto deve ser instância de Avaliacao.');
    const existe = this.collection.find(
      a => a.usuarioId === avaliacao.usuarioId && a.conteudoId === avaliacao.conteudoId
    );
    if (existe) throw new Error('Usuário já avaliou este conteúdo.');
    this.collection.push(avaliacao);
    return avaliacao;
  }

  // Acha um comentário específico baseado no ID da avaliação
  static buscarPorId(id) {
    return this.collection.find(a => a.id === id) || null;
  }

  // Retorna todas as opiniões dadas a um filme/série específico, ordenadas das mais recentes para as mais antigas
  static listarPorConteudo(conteudoId) {
    return this.collection
      .filter(a => a.conteudoId === conteudoId)
      .map(a => a.toJSON())
      .sort((a, b) => new Date(b.dataAvaliacao) - new Date(a.dataAvaliacao));
  }

  /*
    CALCULAR A MÉDIA DE NOTA DE UM FILME/SÉRIE:
    Soma todas as notas recebidas por um filme ou série e divide pela quantidade de avaliações.
    O resultado é arredondado com uma casa decimal (ex: 8.5). Se não houver notas, retorna 0.
  */
  static calcularMedia(conteudoId) {
    const avaliacoes = this.collection.filter(a => a.conteudoId === conteudoId);
    if (avaliacoes.length === 0) return 0;
    const soma = avaliacoes.reduce((acc, a) => acc + a.nota, 0);
    return Math.round((soma / avaliacoes.length) * 10) / 10;
  }

  // Apaga a avaliação da lista usando o ID
  static remover(id) {
    const index = this.collection.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Avaliação não encontrada.');
    this.collection.splice(index, 1);
    return true;
  }

  // Apaga todas as avaliações gravadas na memória
  static limpar() {
    this.collection = [];
  }
}
