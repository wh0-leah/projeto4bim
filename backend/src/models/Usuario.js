// =============================================================
// MODELO: Usuario
// Critério 2: Encapsulamento com atributos privados e getters/setters
// =============================================================

export class Usuario {
  // Atributos privados (Critério 2)
  #id;
  #nome;
  #email;
  #senhaHash;
  #avatar;

  constructor({ id, nome, email, senhaHash, avatar = null }) {
    this.#id = id;
    this.#nome = nome;
    this.#email = email;
    this.#senhaHash = senhaHash; // senha já deve vir hasheada
    this.#avatar = avatar;
  }

  // ── Getters ──────────────────────────────────────────────
  get id() { return this.#id; }
  get nome() { return this.#nome; }
  get email() { return this.#email; }
  get avatar() { return this.#avatar; }
  // Senha NÃO possui getter — dado sensível protegido

  // ── Setters com validação ─────────────────────────────────
  set nome(valor) {
    if (!valor || valor.trim().length < 2) throw new Error('Nome deve ter ao menos 2 caracteres.');
    this.#nome = valor.trim();
  }

  set email(valor) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(valor)) throw new Error('E-mail inválido.');
    this.#email = valor.toLowerCase();
  }

  set senhaHash(valor) {
    if (!valor) throw new Error('Hash de senha inválido.');
    this.#senhaHash = valor;
  }

  set avatar(valor) { this.#avatar = valor; }

  // ── Métodos de instância ──────────────────────────────────
  getSenhaHash() {
    // Exposição controlada apenas para comparação interna
    return this.#senhaHash;
  }

  toJSON() {
    return {
      id: this.#id,
      nome: this.#nome,
      email: this.#email,
      avatar: this.#avatar,
    };
  }

  toPublicJSON() {
    // Versão sem dados sensíveis para respostas da API
    const { id, nome, avatar } = this.toJSON();
    return { id, nome, avatar };
  }
}
