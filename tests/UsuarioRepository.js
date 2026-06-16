import { Usuario } from '../src/models/Usuario.js';

export class UsuarioRepository {
  
  static collection = [];

  static adicionar(usuario) {
    if (!(usuario instanceof Usuario)) throw new Error('Objeto deve ser instância de Usuario.');
    const existe = this.collection.find(u => u.email === usuario.email);
    if (existe) throw new Error('E-mail já cadastrado.');
    this.collection.push(usuario);
    return usuario;
  }

  
  static buscarPorEmail(email) {
    return this.collection.find(u => u.email === email.toLowerCase()) || null;
  }

  static buscarPorId(id) {
    return this.collection.find(u => u.id === id) || null;
  }
  
  static listarAtivos() {
    return this.collection.map(u => u.toPublicJSON());
  }
  
  static limpar() {
    this.collection = [];
  }
}
