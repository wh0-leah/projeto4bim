export class Avaliacao {
  #id;
  #nota;         
  #critica;      
  #usuarioId;
  #conteudoId;   
  #tipo;         
  #dataAvaliacao;
  #editada;
  #curtidas;

  constructor({
    id,
    nota,
    critica = '',
    usuarioId,
    conteudoId,
    tipo,
    dataAvaliacao = new Date(),
    editada = false,
    curtidas = 0,
  }) {
    this.#id = id;
    this.nota = nota;
    this.critica = critica;
    this.#usuarioId = usuarioId;
    this.#conteudoId = conteudoId;
    this.#tipo = tipo;
    this.#dataAvaliacao = dataAvaliacao instanceof Date ? dataAvaliacao : new Date(dataAvaliacao);
    this.#editada = editada;
    this.#curtidas = Number(curtidas);
  }

  
  #validarNota(nota) {
    const n = Number(nota);
    if (isNaN(n) || n < 0 || n > 10) throw new Error('Nota deve estar entre 0 e 10.');
    return n;
  }

  
  get id() { return this.#id; }
  get nota() { return this.#nota; }
  get critica() { return this.#critica; }
  get usuarioId() { return this.#usuarioId; }
  get conteudoId() { return this.#conteudoId; }
  get tipo() { return this.#tipo; }
  get dataAvaliacao() { return this.#dataAvaliacao; }
  get editada() { return this.#editada; }
  get curtidas() { return this.#curtidas; }

  
  set nota(valor) {
    this.#nota = this.#validarNota(valor);
    this.#editada = true;
  }

  set critica(valor) {
    this.#critica = valor || '';
    this.#editada = true;
  }

  curtir() {
    this.#curtidas += 1;
  }

  toJSON() {
    return {
      id: this.#id,
      nota: this.#nota,
      critica: this.#critica,
      usuarioId: this.#usuarioId,
      conteudoId: this.#conteudoId,
      tipo: this.#tipo,
      dataAvaliacao: this.#dataAvaliacao,
      editada: this.#editada,
      curtidas: this.#curtidas,
    };
  }
}

