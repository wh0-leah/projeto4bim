// =============================================================
// MODELO: Serie
// =============================================================

export class Serie {
  #id;
  #titulo;
  #diretores;    // array de strings
  #generos;
  #elenco;
  #temporadas;
  #anoInicio;
  #anoFim;
  #status;       // 'EM_ANDAMENTO', 'FINALIZADA', 'CANCELADA'
  #sinopse;
  #classificacao;
  #capa;
  #trailer;
  #mediaAvaliacao;
  #criadoPorUsuarioId;

  constructor({
    id,
    titulo,
    diretores = [],
    generos = [],
    elenco = [],
    temporadas = 1,
    anoInicio,
    anoFim = null,
    status = 'EM_ANDAMENTO',
    sinopse = '',
    classificacao = 'L',
    capa = null,
    trailer = null,
    mediaAvaliacao = 0,
    criadoPorUsuarioId = null,
  }) {
    this.#id = id;
    this.#titulo = titulo;
    this.#diretores = Array.isArray(diretores) ? diretores : [diretores];
    this.#generos = Array.isArray(generos) ? generos : [generos];
    this.#elenco = Array.isArray(elenco) ? elenco : [];
    this.#temporadas = Number(temporadas);
    this.#anoInicio = Number(anoInicio);
    this.#anoFim = anoFim ? Number(anoFim) : null;
    this.#status = status;
    this.#sinopse = sinopse;
    this.#classificacao = classificacao;
    this.#capa = capa;
    this.#trailer = trailer;
    this.#mediaAvaliacao = Number(mediaAvaliacao);
    this.#criadoPorUsuarioId = criadoPorUsuarioId;
  }

  // ── Getters ──────────────────────────────────────────────
  get id() { return this.#id; }
  get titulo() { return this.#titulo; }
  get diretores() { return [...this.#diretores]; }
  get generos() { return [...this.#generos]; }
  get elenco() { return [...this.#elenco]; }
  get temporadas() { return this.#temporadas; }
  get anoInicio() { return this.#anoInicio; }
  get anoFim() { return this.#anoFim; }
  get status() { return this.#status; }
  get sinopse() { return this.#sinopse; }
  get classificacao() { return this.#classificacao; }
  get capa() { return this.#capa; }
  get trailer() { return this.#trailer; }
  get mediaAvaliacao() { return this.#mediaAvaliacao; }
  get criadoPorUsuarioId() { return this.#criadoPorUsuarioId; }

  // ── Setters ───────────────────────────────────────────────
  set titulo(valor) {
    if (!valor || valor.trim().length < 1) throw new Error('Título é obrigatório.');
    this.#titulo = valor.trim();
  }

  set diretores(valor) {
    if (!Array.isArray(valor) || valor.length === 0) throw new Error('Informe ao menos um diretor.');
    this.#diretores = valor;
  }

  set generos(valor) {
    if (!Array.isArray(valor) || valor.length === 0) throw new Error('Informe ao menos um gênero.');
    this.#generos = valor;
  }

  set elenco(valor) { this.#elenco = Array.isArray(valor) ? valor : []; }

  set temporadas(valor) {
    if (Number(valor) < 1) throw new Error('Número de temporadas inválido.');
    this.#temporadas = Number(valor);
  }

  set status(valor) {
    const validos = ['EM_ANDAMENTO', 'FINALIZADA', 'CANCELADA'];
    if (!validos.includes(valor)) throw new Error(`Status inválido. Use: ${validos.join(', ')}`);
    this.#status = valor;
  }

  set sinopse(valor) { this.#sinopse = valor || ''; }
  set classificacao(valor) { this.#classificacao = valor; }
  set capa(valor) { this.#capa = valor; }
  set trailer(valor) { this.#trailer = valor; }
  set anoFim(valor) { this.#anoFim = valor ? Number(valor) : null; }
  set criadoPorUsuarioId(valor) { this.#criadoPorUsuarioId = valor; }
  set mediaAvaliacao(valor) {
    const nota = Number(valor);
    if (nota < 0 || nota > 10) throw new Error('Média deve estar entre 0 e 10.');
    this.#mediaAvaliacao = nota;
  }

  // ── Métodos de instância ──────────────────────────────────
  temAtor(nomeAtor) {
    return this.#elenco.some(a => a.toLowerCase().includes(nomeAtor.toLowerCase()));
  }

  temDiretor(nomeDiretor) {
    return this.#diretores.some(d => d.toLowerCase().includes(nomeDiretor.toLowerCase()));
  }

  estaEmAndamento() {
    return this.#status === 'EM_ANDAMENTO';
  }

  toJSON() {
    return {
      id: this.#id,
      titulo: this.#titulo,
      diretores: this.#diretores,
      generos: this.#generos,
      elenco: this.#elenco,
      temporadas: this.#temporadas,
      anoInicio: this.#anoInicio,
      anoFim: this.#anoFim,
      status: this.#status,
      sinopse: this.#sinopse,
      classificacao: this.#classificacao,
      capa: this.#capa,
      trailer: this.#trailer,
      mediaAvaliacao: this.#mediaAvaliacao,
      criadoPorUsuarioId: this.#criadoPorUsuarioId,
      tipo: 'SERIE',
    };
  }
}
