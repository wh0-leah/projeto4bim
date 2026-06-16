export class Usuario {
  
  #id;
  #nome;
  #email;
  #senhaHash;
  #avatar;
  #bio;
  #dataCadastro;
  #ativo;
  #role;

  constructor({ id, nome, email, senhaHash, avatar = null, bio = '', dataCadastro = new Date(), ativo = true, role = 'USER' }) {
    this.#id = id;
    this.nome = nome;
    this.email = email;
    this.senhaHash = senhaHash;
    this.avatar = avatar;
    this.bio = bio;
    this.#dataCadastro = dataCadastro instanceof Date ? dataCadastro : new Date(dataCadastro);
    this.ativo = ativo;
    this.#role = role;
  }

  
  get id() { return this.#id; }
  get nome() { return this.#nome; }
  get email() { return this.#email; }
  get avatar() { return this.#avatar; }
  get bio() { return this.#bio; }
  get dataCadastro() { return this.#dataCadastro; }
  get ativo() { return this.#ativo; }
  get role() { return this.#role; }
  

  
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
  set bio(valor) { this.#bio = valor || ''; }
  set ativo(valor) { this.#ativo = Boolean(valor); }

  
  getSenhaHash() {
    
    return this.#senhaHash;
  }

  get role() {
    return this.#role;
  }

  get nivel() {
    return this.#role === 'ADMIN' ? 'Administrador' : 'Usuário Comum';
  }

  toJSON() {
    return {
      id: this.#id,
      nome: this.#nome,
      email: this.#email,
      avatar: this.#avatar,
      bio: this.#bio,
      dataCadastro: this.#dataCadastro,
      ativo: this.#ativo,
      role: this.role,
      nivel: this.nivel,
    };
  }

  toPublicJSON() {
    
    const { id, nome, avatar, bio, dataCadastro, role, nivel } = this.toJSON();
    return { id, nome, avatar, bio, dataCadastro, role, nivel };
  }
}

export class UsuarioComum extends Usuario {
  constructor(dados) {
    super({ ...dados, role: 'USER' });
  }

  get role() {
    return 'USER';
  }

  get nivel() {
    return 'Usuário Comum';
  }
}

export class UsuarioAdmin extends Usuario {
  constructor(dados) {
    super({ ...dados, role: 'ADMIN' });
  }

  get role() {
    return 'ADMIN';
  }

  get nivel() {
    return 'Administrador';
  }
}

