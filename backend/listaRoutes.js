export class Serie {
  #id;
  #titulo;
  #criador;
  #generos;
  #elenco;
  #temporadas;
  #episodiosPorTemporada;
  #anoInicio;
  #anoFim;
  #status;       
  #sinopse;
  #classificacao;
  #banner;
  #trailer;
  #usuarioCriadoPorId;
  #dataCriacao;
  #mediaAvaliacao;

  constructor({
    id,
    titulo,
    criador,
    generos = [],
    elenco = [],
    temporadas = 1,
    episodiosPorTemporada = [],
    anoInicio,
    anoFim = null,
    status = 'EM_ANDAMENTO',
    sinopse = '',
    classificacao = 'L',
    banner = null,
    trailer = null,
    usuarioCriadoPorId,
    dataCriacao = new Date(),
    mediaAvaliacao = 0,
  }) {
    this.#id = id;
    this.titulo = titulo;
    this.criador = criador;
    this.generos = Array.isArray(generos) ? generos : [generos];
    this.elenco = elenco;
    this.temporadas = temporadas;
    this.#episodiosPorTemporada = Array.isArray(episodiosPorTemporada) ? episodiosPorTemporada : [];
    this.#anoInicio = Number(anoInicio);
    this.anoFim = anoFim;
    this.status = status;
    this.sinopse = sinopse;
    this.classificacao = classificacao;
    this.banner = banner;
    this.trailer = trailer;
    this.#usuarioCriadoPorId = usuarioCriadoPorId;
    this.#dataCriacao = dataCriacao instanceof Date ? dataCriacao : new Date(dataCriacao);
    this.mediaAvaliacao = mediaAvaliacao;
  }

  
  get id() { return this.#id; }
  get titulo() { return this.#titulo; }
  get criador() { return this.#criador; }
  get generos() { return [...this.#generos]; }
  get elenco() { return [...this.#elenco]; }
  get temporadas() { return this.#temporadas; }
  get episodiosPorTemporada() { return [...this.#episodiosPorTemporada]; }
  get anoInicio() { return this.#anoInicio; }
  get anoFim() { return this.#anoFim; }
  get status() { return this.#status; }
  get sinopse() { return this.#sinopse; }
  get classificacao() { return this.#classificacao; }
  get banner() { return this.#banner; }
  get trailer() { return this.#trailer; }
  get usuarioCriadoPorId() { return this.#usuarioCriadoPorId; }
  get dataCriacao() { return this.#dataCriacao; }
  get mediaAvaliacao() { return this.#mediaAvaliacao; }

  
  set titulo(valor) {
    if (!valor || valor.trim().length < 1) throw new Error('Título é obrigatório.');
    this.#titulo = valor.trim();
  }

  set criador(valor) {
    if (!valor || valor.trim().length < 2) throw new Error('Nome do criador inválido.');
    this.#criador = valor.trim();
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
  set banner(valor) { this.#banner = valor; }
  set trailer(valor) { this.#trailer = valor; }
  set anoFim(valor) { this.#anoFim = valor ? Number(valor) : null; }
  set mediaAvaliacao(valor) {
    const nota = Number(valor);
    if (nota < 0 || nota > 10) throw new Error('Média deve estar entre 0 e 10.');
    this.#mediaAvaliacao = nota;
  }

  
  temAtor(nomeAtor) {
    return this.#elenco.some(a => a.toLowerCase().includes(nomeAtor.toLowerCase()));
  }

  estaEmAndamento() {
    return this.#status === 'EM_ANDAMENTO';
  }

  toJSON() {
    return {
      id: this.#id,
      titulo: this.#titulo,
      criador: this.#criador,
      generos: this.#generos,
      elenco: this.#elenco,
      temporadas: this.#temporadas,
      episodiosPorTemporada: this.#episodiosPorTemporada,
      anoInicio: this.#anoInicio,
      anoFim: this.#anoFim,
      status: this.#status,
      sinopse: this.#sinopse,
      classificacao: this.#classificacao,
      banner: this.#banner,
      trailer: this.#trailer,
      usuarioCriadoPorId: this.#usuarioCriadoPorId,
      dataCriacao: this.#dataCriacao,
      mediaAvaliacao: this.#mediaAvaliacao,
      tipo: 'SERIE',
    };
  }
}

