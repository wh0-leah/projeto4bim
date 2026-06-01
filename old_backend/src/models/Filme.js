// =============================================================
// MODELO: Filme
// Critério 1: Classe de domínio com +5 atributos
// Critério 2: Encapsulamento com atributos privados
// =============================================================

export class Filme {
  #id;
  #titulo;
  #diretor;
  #generos;      // array de strings
  #elenco;       // array de strings
  #anoLancamento;
  #duracao;      // em minutos
  #sinopse;
  #classificacao; // 'L', '10', '12', '14', '16', '18'
  #capa;         // URL da imagem
  #trailer;      // URL do trailer
  #usuarioCriadoPorId;
  #dataCriacao;
  #mediaAvaliacao;

  constructor({
    id,
    titulo,
    diretor,
    generos = [],
    elenco = [],
    anoLancamento,
    duracao = 0,
    sinopse = '',
    classificacao = 'L',
    capa = null,
    trailer = null,
    usuarioCriadoPorId,
    dataCriacao = new Date(),
    mediaAvaliacao = 0,
  }) {
    this.#id = id;
    this.#titulo = titulo;
    this.#diretor = diretor;
    this.#generos = Array.isArray(generos) ? generos : [generos];
    this.#elenco = Array.isArray(elenco) ? elenco : [elenco];
    this.#anoLancamento = Number(anoLancamento);
    this.#duracao = Number(duracao);
    this.#sinopse = sinopse;
    this.#classificacao = classificacao;
    this.#capa = capa;
    this.#trailer = trailer;
    this.#usuarioCriadoPorId = usuarioCriadoPorId;
    this.#dataCriacao = dataCriacao instanceof Date ? dataCriacao : new Date(dataCriacao);
    this.#mediaAvaliacao = Number(mediaAvaliacao);
  }

  // ── Getters ──────────────────────────────────────────────
  get id() { return this.#id; }
  get titulo() { return this.#titulo; }
  get diretor() { return this.#diretor; }
  get generos() { return [...this.#generos]; } // cópia defensiva
  get elenco() { return [...this.#elenco]; }
  get anoLancamento() { return this.#anoLancamento; }
  get duracao() { return this.#duracao; }
  get sinopse() { return this.#sinopse; }
  get classificacao() { return this.#classificacao; }
  get capa() { return this.#capa; }
  get trailer() { return this.#trailer; }
  get usuarioCriadoPorId() { return this.#usuarioCriadoPorId; }
  get dataCriacao() { return this.#dataCriacao; }
  get mediaAvaliacao() { return this.#mediaAvaliacao; }

  // ── Setters com validação ─────────────────────────────────
  set titulo(valor) {
    if (!valor || valor.trim().length < 1) throw new Error('Título é obrigatório.');
    this.#titulo = valor.trim();
  }

  set diretor(valor) {
    if (!valor || valor.trim().length < 2) throw new Error('Nome do diretor inválido.');
    this.#diretor = valor.trim();
  }

  set generos(valor) {
    if (!Array.isArray(valor) || valor.length === 0) throw new Error('Informe ao menos um gênero.');
    this.#generos = valor;
  }

  set elenco(valor) {
    this.#elenco = Array.isArray(valor) ? valor : [];
  }

  set anoLancamento(valor) {
    const ano = Number(valor);
    if (ano < 1888 || ano > new Date().getFullYear() + 2) throw new Error('Ano de lançamento inválido.');
    this.#anoLancamento = ano;
  }

  set duracao(valor) { this.#duracao = Number(valor) || 0; }
  set sinopse(valor) { this.#sinopse = valor || ''; }
  set classificacao(valor) { this.#classificacao = valor; }
  set capa(valor) { this.#capa = valor; }
  set trailer(valor) { this.#trailer = valor; }

  set mediaAvaliacao(valor) {
    const nota = Number(valor);
    if (nota < 0 || nota > 10) throw new Error('Média deve estar entre 0 e 10.');
    this.#mediaAvaliacao = nota;
  }

  // ── Métodos de instância ──────────────────────────────────
  temAtor(nomeAtor) {
    return this.#elenco.some(a => a.toLowerCase().includes(nomeAtor.toLowerCase()));
  }

  toJSON() {
    return {
      id: this.#id,
      titulo: this.#titulo,
      diretor: this.#diretor,
      generos: this.#generos,
      elenco: this.#elenco,
      anoLancamento: this.#anoLancamento,
      duracao: this.#duracao,
      sinopse: this.#sinopse,
      classificacao: this.#classificacao,
      capa: this.#capa,
      trailer: this.#trailer,
      usuarioCriadoPorId: this.#usuarioCriadoPorId,
      dataCriacao: this.#dataCriacao,
      mediaAvaliacao: this.#mediaAvaliacao,
      tipo: 'FILME',
    };
  }
}

