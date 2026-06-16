




import { Usuario, UsuarioComum, UsuarioAdmin } from '../../src/models/index.js';
import { UsuarioRepository } from '../index.js';





export default async function testUsuario(runTest, assert) {
  
  




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

    
    assert(comum instanceof Usuario, 'UsuarioComum deve ser uma instância de Usuario');
    assert(admin instanceof Usuario, 'UsuarioAdmin deve ser uma instância de Usuario');

    
    assert(comum.role === 'USER', 'UsuarioComum role deve ser USER');
    assert(comum.nivel === 'Usuário Comum', 'UsuarioComum nivel incorreto');
    
    assert(admin.role === 'ADMIN', 'UsuarioAdmin role deve ser ADMIN');
    assert(admin.nivel === 'Administrador', 'UsuarioAdmin nivel incorreto');

    
    const comumJSON = comum.toJSON();
    assert(comumJSON.role === 'USER', 'JSON do UsuarioComum deve conter role USER');
    assert(comumJSON.nivel === 'Usuário Comum', 'JSON do UsuarioComum deve conter nivel correto');

    const adminJSON = admin.toJSON();
    assert(adminJSON.role === 'ADMIN', 'JSON do UsuarioAdmin deve conter role ADMIN');
    assert(adminJSON.nivel === 'Administrador', 'JSON do UsuarioAdmin deve conter nivel correto');
  });
}
