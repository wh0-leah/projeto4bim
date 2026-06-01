/*
  MODELO IMPORTADO:
  Precisamos importar a classe 'Usuario' que definimos lá no código principal
  para podermos criar novos usuários reais no nosso banco de dados em memória.
*/
import { Usuario } from '../src/models/Usuario.js';

/*
  REPOSITÓRIO DE USUÁRIOS EM MEMÓRIA:
  Esta classe serve como uma "caixa" ou "tabela" para guardar nossos usuários
  enquanto o banco de dados real não está pronto. Ela guarda tudo em um array simples.
*/
export class UsuarioRepository {
  // Esse array é a nossa lista/banco de dados temporário de usuários
  static collection = [];

  /*
    MÉTODO PARA ADICIONAR UM NOVO USUÁRIO:
    Ele verifica se o que estamos tentando colocar na caixa é realmente um objeto do tipo Usuario
    e também garante que ninguém se cadastre com o mesmo e-mail duas vezes.
  */
  static adicionar(usuario) {
    if (!(usuario instanceof Usuario)) throw new Error('Objeto deve ser instância de Usuario.');
    const existe = this.collection.find(u => u.email === usuario.email);
    if (existe) throw new Error('E-mail já cadastrado.');
    this.collection.push(usuario);
    return usuario;
  }

  // Procura um usuário na lista com base no e-mail informado (ignorando letras maiúsculas/minúsculas)
  static buscarPorEmail(email) {
    return this.collection.find(u => u.email === email.toLowerCase()) || null;
  }

  // Procura um usuário na lista com base no seu ID único
  static buscarPorId(id) {
    return this.collection.find(u => u.id === id) || null;
  }

  // Retorna uma lista contendo as informações públicas de todos os usuários
  static listarAtivos() {
    return this.collection.map(u => u.toPublicJSON());
  }

  // Esvazia completamente a lista de usuários para que os próximos testes comecem do zero (limpo)
  static limpar() {
    this.collection = [];
  }
}
