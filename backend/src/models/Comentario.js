// =============================================================
// MODELO: Comentario
// =============================================================

export class Comentario {
  #id;
  #nota;         // 0 a 10
  #critica;      // texto da crítica
  #usuarioId;
  #conteudoId;   // id do filme ou série
  #dataComentario;

  constructor({
    id,
    nota,
    critica = '',
    usuarioId,
    conteudoId,
    dataComentario = new Date(),
  }) {
    this.#id = id;
    this.nota = nota;
    this.critica = critica;
    this.#usuarioId = usuarioId;
    this.#conteudoId = conteudoId;
    this.#dataComentario = dataComentario instanceof Date ? dataComentario : new Date(dataComentario);
  }

  // ── Validações internas ───────────────────────────────────
  #validarNota(nota) {
    const n = Number(nota);
    if (isNaN(n) || n < 0 || n > 10) throw new Error('Nota deve estar entre 0 e 10.');
    return n;
  }

  // ── Getters ──────────────────────────────────────────────
  get id() { return this.#id; }
  get nota() { return this.#nota; }
  get critica() { return this.#critica; }
  get usuarioId() { return this.#usuarioId; }
  get conteudoId() { return this.#conteudoId; }
  get dataComentario() { return this.#dataComentario; }

  // ── Setters ───────────────────────────────────────────────
  set nota(valor) {
    this.#nota = this.#validarNota(valor);
  }

  set critica(valor) {
    this.#critica = valor || '';
  }

  toJSON() {
    return {
      id: this.#id,
      nota: this.#nota,
      critica: this.#critica,
      usuarioId: this.#usuarioId,
      conteudoId: this.#conteudoId,
      dataComentario: this.#dataComentario,
    };
  }
}
