// =============================================================
// MODELO: Filme
// Critério 1: Classe de domínio com +5 atributos
// Critério 2: Encapsulamento com atributos privados
// =============================================================

export class Filme {
  #id;
  #titulo;
  #diretores;    // array de strings
  #generos;      // array de strings
  #elenco;       // array de strings
  #anoLancamento;
  #duracao;      // em minutos
  #sinopse;
  #classificacao; // 'L', '10', '12', '14', '16', '18'
  #capa;         // URL da imagem
  #trailer;      // URL do trailer
  #mediaAvaliacao;
  #criadoPorUsuarioId;

  constructor({
    id,
    titulo,
    diretores = [],
    generos = [],
    elenco = [],
    anoLancamento,
    duracao = 0,
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
    this.#elenco = Array.isArray(elenco) ? elenco : [elenco];
    this.#anoLancamento = Number(anoLancamento);
    this.#duracao = Number(duracao);
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
  get generos() { return [...this.#generos]; } // cópia defensiva
  get elenco() { return [...this.#elenco]; }
  get anoLancamento() { return this.#anoLancamento; }
  get duracao() { return this.#duracao; }
  get sinopse() { return this.#sinopse; }
  get classificacao() { return this.#classificacao; }
  get capa() { return this.#capa; }
  get trailer() { return this.#trailer; }
  get mediaAvaliacao() { return this.#mediaAvaliacao; }
  get criadoPorUsuarioId() { return this.#criadoPorUsuarioId; }

  // ── Setters com validação ─────────────────────────────────
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

  toJSON() {
    return {
      id: this.#id,
      titulo: this.#titulo,
      diretores: this.#diretores,
      generos: this.#generos,
      elenco: this.#elenco,
      anoLancamento: this.#anoLancamento,
      duracao: this.#duracao,
      sinopse: this.#sinopse,
      classificacao: this.#classificacao,
      capa: this.#capa,
      trailer: this.#trailer,
      mediaAvaliacao: this.#mediaAvaliacao,
      criadoPorUsuarioId: this.#criadoPorUsuarioId,
      tipo: 'FILME',
    };
  }
}
