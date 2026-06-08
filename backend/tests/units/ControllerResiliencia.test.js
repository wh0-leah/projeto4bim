// =============================================================
// TESTES DOS CONTROLLERS
// Critério 3 (Entrega 2): Resiliência no fluxo da aplicação
//
// Estes testes simulam requisições HTTP e comprovam que os controllers
// usam try/catch para capturar erros dos modelos/repositórios e
// devolver a mensagem precisa de erro como resposta JSON.
// =============================================================

import { Usuario, UsuarioComum, UsuarioAdmin, Filme, Serie, Comentario, ListaAssistir } from '../../src/models/index.js';
import { UsuarioRepository, FilmeRepository, SerieRepository, ComentarioRepository, ListaAssistirRepository } from '../index.js';

/*
  SIMULADOR DE REQUISIÇÃO E RESPOSTA HTTP:
  Cria objetos "falsos" que imitam o comportamento de req/res do Express,
  permitindo testar os controllers sem precisar subir um servidor real.
*/
function criarReqRes(body = {}, params = {}, query = {}) {
  const req = { body, params, query };
  const res = {
    statusCode: 200,
    dados: null,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.dados = data; return this; },
  };
  return { req, res };
}

export default async function testControllers(runTest, assert) {

  // ─── TESTE 1: Controller captura erro de validação de e-mail inválido ───
  await runTest('Controller - try/catch captura erro de e-mail inválido', async () => {
    UsuarioRepository.limpar();

    // Importa o controller dinamicamente
    const { cadastrar } = await import('../../src/controllers/UsuarioController.js');

    const { req, res } = criarReqRes({
      id: 'u1', nome: 'Teste', email: 'email-invalido', senhaHash: 'hash'
    });

    await cadastrar(req, res);

    // O controller deve ter capturado o erro e retornado status 400
    assert(res.statusCode === 400, `Status deveria ser 400, recebeu ${res.statusCode}`);
    assert(res.dados.sucesso === false, 'Deveria indicar falha');
    assert(res.dados.erro === 'E-mail inválido.', `Mensagem incorreta: ${res.dados.erro}`);
  });

  // ─── TESTE 2: Controller captura erro de e-mail duplicado ───
  await runTest('Controller - try/catch captura erro de e-mail duplicado', async () => {
    UsuarioRepository.limpar();

    const { cadastrar } = await import('../../src/controllers/UsuarioController.js');

    // Primeiro cadastro: sucesso
    const { req: req1, res: res1 } = criarReqRes({
      id: 'u1', nome: 'Luiz', email: 'luiz@teste.com', senhaHash: 'hash'
    });
    await cadastrar(req1, res1);
    assert(res1.statusCode === 201, 'Primeiro cadastro deveria retornar 201');

    // Segundo cadastro com mesmo e-mail: o try/catch captura o erro
    const { req: req2, res: res2 } = criarReqRes({
      id: 'u2', nome: 'Outro', email: 'luiz@teste.com', senhaHash: 'hash'
    });
    await cadastrar(req2, res2);

    assert(res2.statusCode === 400, `Status deveria ser 400, recebeu ${res2.statusCode}`);
    assert(res2.dados.erro === 'E-mail já cadastrado.', `Mensagem incorreta: ${res2.dados.erro}`);
  });

  // ─── TESTE 3: Controller captura erro de herança/polimorfismo ───
  await runTest('Controller - try/catch com herança (Admin vs Comum)', async () => {
    UsuarioRepository.limpar();

    const { cadastrar } = await import('../../src/controllers/UsuarioController.js');

    // Cadastra como ADMIN
    const { req: reqAdmin, res: resAdmin } = criarReqRes({
      id: 'ua', nome: 'Admin', email: 'admin@teste.com', senhaHash: 'hash', role: 'ADMIN'
    });
    await cadastrar(reqAdmin, resAdmin);

    assert(resAdmin.statusCode === 201, 'Admin deveria ser criado com sucesso');
    assert(resAdmin.dados.dados.role === 'ADMIN', 'Role deveria ser ADMIN');
    assert(resAdmin.dados.dados.nivel === 'Administrador', 'Nível deveria ser Administrador');

    // Cadastra como USER (padrão)
    const { req: reqUser, res: resUser } = criarReqRes({
      id: 'uc', nome: 'Comum', email: 'comum@teste.com', senhaHash: 'hash'
    });
    await cadastrar(reqUser, resUser);

    assert(resUser.dados.dados.role === 'USER', 'Role deveria ser USER');
    assert(resUser.dados.dados.nivel === 'Usuário Comum', 'Nível deveria ser Usuário Comum');
  });

  // ─── TESTE 4: Controller captura erro de título obrigatório (Filme) ───
  await runTest('Controller - try/catch captura erro de título de filme obrigatório', async () => {
    FilmeRepository.limpar();

    const { criar } = await import('../../src/controllers/FilmeController.js');

    const { req, res } = criarReqRes({
      id: 'f1', titulo: '', diretores: ['Spielberg'], generos: ['Ação'], anoLancamento: 2020
    });
    await criar(req, res);

    assert(res.statusCode === 400, `Status deveria ser 400, recebeu ${res.statusCode}`);
    assert(res.dados.erro === 'Título é obrigatório.', `Mensagem incorreta: ${res.dados.erro}`);
  });

  // ─── TESTE 5: Controller captura erro de nota inválida (Comentario) ───
  await runTest('Controller - try/catch captura nota fora do range 0-10', async () => {
    ComentarioRepository.limpar();

    const { criar } = await import('../../src/controllers/ComentarioController.js');

    const { req, res } = criarReqRes({
      id: 'c1', nota: 15, usuarioId: 'u1', conteudoId: 'f1'
    });
    await criar(req, res);

    assert(res.statusCode === 400, `Status deveria ser 400, recebeu ${res.statusCode}`);
    assert(res.dados.erro === 'Nota deve estar entre 0 e 10.', `Mensagem incorreta: ${res.dados.erro}`);
  });

  // ─── TESTE 6: Controller captura erro de lista não encontrada ───
  await runTest('Controller - try/catch captura lista não encontrada (404)', async () => {
    ListaAssistirRepository.limpar();

    const { obter } = await import('../../src/controllers/ListaAssistirController.js');

    const { req, res } = criarReqRes({}, { id: 'inexistente' });
    await obter(req, res);

    assert(res.statusCode === 404, `Status deveria ser 404, recebeu ${res.statusCode}`);
    assert(res.dados.erro === 'Lista não encontrada.', `Mensagem incorreta: ${res.dados.erro}`);
  });

  // ─── TESTE 7: Controller captura erro de item duplicado na lista ───
  await runTest('Controller - try/catch captura item duplicado na lista', async () => {
    ListaAssistirRepository.limpar();

    const { criar, adicionarItem } = await import('../../src/controllers/ListaAssistirController.js');

    // Cria a lista
    const { req: reqCriar, res: resCriar } = criarReqRes({
      id: 'l1', nome: 'Favoritos', usuarioId: 'u1'
    });
    await criar(reqCriar, resCriar);
    assert(resCriar.statusCode === 201, 'Lista deveria ser criada');

    // Adiciona item pela primeira vez
    const { req: req1, res: res1 } = criarReqRes(
      { conteudoId: 'f1', tipo: 'FILME', titulo: 'Matrix' },
      { id: 'l1' }
    );
    await adicionarItem(req1, res1);
    assert(res1.statusCode === 201, 'Item deveria ser adicionado');

    // Tenta adicionar o mesmo item novamente: try/catch captura o erro
    const { req: req2, res: res2 } = criarReqRes(
      { conteudoId: 'f1', tipo: 'FILME', titulo: 'Matrix' },
      { id: 'l1' }
    );
    await adicionarItem(req2, res2);

    assert(res2.statusCode === 400, `Status deveria ser 400, recebeu ${res2.statusCode}`);
    assert(res2.dados.erro === 'Título já está na lista.', `Mensagem incorreta: ${res2.dados.erro}`);
  });
}
