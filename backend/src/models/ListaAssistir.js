// =============================================================
// MODELO: ListaAssistir
// =============================================================

export class ListaAssistir {
  #id;
  #nome;
  #usuarioId;
  #itens;        // array de ItemLista
  #publica;

  constructor({
    id,
    nome,
    usuarioId,
    itens = [],
    publica = false,
  }) {
    this.#id = id;
    this.#nome = nome;
    this.#usuarioId = usuarioId;
    this.#itens = Array.isArray(itens) ? itens : [];
    this.#publica = Boolean(publica);
  }

  // ── Getters ──────────────────────────────────────────────
  get id() { return this.#id; }
  get nome() { return this.#nome; }
  get usuarioId() { return this.#usuarioId; }
  get itens() { return [...this.#itens]; } // cópia defensiva
  get publica() { return this.#publica; }
  get totalItens() { return this.#itens.length; }

  // ── Setters ───────────────────────────────────────────────
  set nome(valor) {
    if (!valor || valor.trim().length < 1) throw new Error('Nome da lista é obrigatório.');
    this.#nome = valor.trim();
  }

  set publica(valor) { this.#publica = Boolean(valor); }

  // ── Métodos de manipulação dos itens ─────────────────────
  adicionarItem({ conteudoId, tipo, titulo, capa = null }) {
    const jaExiste = this.#itens.find(i => i.conteudoId === conteudoId);
    if (jaExiste) throw new Error('Título já está na lista.');
    this.#itens.push({
      conteudoId,
      tipo,   // 'FILME' | 'SERIE'
      titulo,
      capa,
      status: 'PENDENTE',   // 'PENDENTE' | 'ASSISTIDO'
      favoritado: false,
      dataAdicionado: new Date(),
    });
    return this;
  }

  removerItem(conteudoId) {
    const index = this.#itens.findIndex(i => i.conteudoId === conteudoId);
    if (index === -1) throw new Error('Item não encontrado na lista.');
    this.#itens.splice(index, 1);
    return this;
  }

  marcarComoAssistido(conteudoId) {
    const item = this.#itens.find(i => i.conteudoId === conteudoId);
    if (!item) throw new Error('Item não encontrado na lista.');
    item.status = 'ASSISTIDO';
    return this;
  }

  marcarComoPendente(conteudoId) {
    const item = this.#itens.find(i => i.conteudoId === conteudoId);
    if (!item) throw new Error('Item não encontrado na lista.');
    item.status = 'PENDENTE';
    return this;
  }

  favoritarItem(conteudoId) {
    const item = this.#itens.find(i => i.conteudoId === conteudoId);
    if (!item) throw new Error('Item não encontrado na lista.');
    item.favoritado = !item.favoritado;
    return this;
  }

  listarAssistidos() {
    return this.#itens.filter(i => i.status === 'ASSISTIDO');
  }

  listarPendentes() {
    return this.#itens.filter(i => i.status === 'PENDENTE');
  }

  listarFavoritos() {
    return this.#itens.filter(i => i.favoritado);
  }

  toJSON() {
    return {
      id: this.#id,
      nome: this.#nome,
      usuarioId: this.#usuarioId,
      itens: this.#itens,
      publica: this.#publica,
      totalItens: this.#itens.length,
    };
  }
}
