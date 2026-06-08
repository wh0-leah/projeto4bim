/*
  IMPORTAÇÕES:
  Importamos a classe de modelo 'Usuario' e a sua respectiva classe repositório
  que acabamos de criar.
*/
import { Usuario, UsuarioComum, UsuarioAdmin } from '../../src/models/index.js';
import { UsuarioRepository } from '../index.js';

/*
  FUNÇÃO DE TESTE DO USUÁRIO:
  Contém testes unitários isolados que validam a lógica e o comportamento do UsuarioRepository.
*/
export default async function testUsuario(runTest, assert) {
  
  /*
    TESTE: ADICIONAR E BUSCAR USUÁRIO:
    Este teste cria um usuário válido, salva na lista, e depois faz buscas para checar
    se a busca por ID e por e-mail (inclusive com letras maiúsculas) funciona como esperado.
  */
  await runTest('UsuarioRepository - Adicionar e buscar usuário', () => {
    UsuarioRepository.limpar();
    const user = new Usuario({
      id: 'u1',
      nome: 'Luiz',
      email: 'luiz@teste.com',
      senhaHash: 'hash123'
    });

    UsuarioRepository.adicionar(user);
    assert(UsuarioRepository.collection.length === 1, 'Coleção deveria ter 1 usuário');

    const buscado = UsuarioRepository.buscarPorId('u1');
    assert(buscado !== null, 'Deveria encontrar usuário por ID');
    assert(buscado.nome === 'Luiz', 'Nome retornado incorreto');

    const buscadoEmail = UsuarioRepository.buscarPorEmail('LUIZ@teste.com');
    assert(buscadoEmail !== null, 'Deveria encontrar por e-mail case-insensitive');
  });

  /*
    TESTE: PREVENIR E-MAIL DUPLICADO:
    Garante que se tentarmos cadastrar dois usuários diferentes com o mesmo e-mail,
    o repositório vai disparar um erro bloqueando a operação e protegendo os dados.
  */
  await runTest('UsuarioRepository - Impedir e-mail duplicado', () => {
    UsuarioRepository.limpar();
    const user1 = new Usuario({ id: 'u1', nome: 'Luiz', email: 'luiz@teste.com', senhaHash: 'hash' });
    const user2 = new Usuario({ id: 'u2', nome: 'Luiz Duplicado', email: 'luiz@teste.com', senhaHash: 'hash' });

    UsuarioRepository.adicionar(user1);
    try {
      UsuarioRepository.adicionar(user2);
      assert(false, 'Deveria ter lançado erro de e-mail duplicado');
    } catch (e) {
      assert(e.message === 'E-mail já cadastrado.', 'Mensagem de erro incorreta');
    }
  });

  /*
    TESTE: HERANÇA E POLIMORFISMO DE USUÁRIOS:
    Garante que UsuarioComum e UsuarioAdmin herdam corretamente de Usuario (Herança)
    e apresentam comportamento polimórfico nos getters de role e nivel (Polimorfismo).
  */
  await runTest('Usuario - Validar Herança e Polimorfismo', () => {
    const comum = new UsuarioComum({
      id: 'uc',
      nome: 'Comum',
      email: 'comum@teste.com',
      senhaHash: 'hash'
    });

    const admin = new UsuarioAdmin({
      id: 'ua',
      nome: 'Admin',
      email: 'admin@teste.com',
      senhaHash: 'hash'
    });

    // Validar Herança
    assert(comum instanceof Usuario, 'UsuarioComum deve ser uma instância de Usuario');
    assert(admin instanceof Usuario, 'UsuarioAdmin deve ser uma instância de Usuario');

    // Validar Polimorfismo
    assert(comum.role === 'USER', 'UsuarioComum role deve ser USER');
    assert(comum.nivel === 'Usuário Comum', 'UsuarioComum nivel incorreto');
    
    assert(admin.role === 'ADMIN', 'UsuarioAdmin role deve ser ADMIN');
    assert(admin.nivel === 'Administrador', 'UsuarioAdmin nivel incorreto');

    // Validar toJSON polimórfico
    const comumJSON = comum.toJSON();
    assert(comumJSON.role === 'USER', 'JSON do UsuarioComum deve conter role USER');
    assert(comumJSON.nivel === 'Usuário Comum', 'JSON do UsuarioComum deve conter nivel correto');

    const adminJSON = admin.toJSON();
    assert(adminJSON.role === 'ADMIN', 'JSON do UsuarioAdmin deve conter role ADMIN');
    assert(adminJSON.nivel === 'Administrador', 'JSON do UsuarioAdmin deve conter nivel correto');
  });
}
