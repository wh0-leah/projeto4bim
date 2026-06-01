/*
  ESTE ARQUIVO É O MOTOR DE TESTES (RUNNER).
  Ele é quem aperta o "botão de ligar" para rodar todos os testes que criamos.
  Ele importa as funções de teste de cada arquivo na pasta 'units' e executa uma por uma,
  mostrando de um jeito bonitinho no terminal se deu certo ou se quebrou tudo.
*/

// Aqui estamos trazendo os testes individuais de cada coisa (usuarios, filmes, series...)
import testUsuario from './units/UsuarioRepository.test.js';
import testFilme from './units/FilmeRepository.test.js';
import testSerie from './units/SerieRepository.test.js';
import testAvaliacao from './units/AvaliacaoRepository.test.js';
import testListaAssistir from './units/ListaAssistirRepository.test.js';

/*
  FUNÇÃO AUXILIAR DE CHECAGEM (ASSERT):
  Ela é igual a um juiz de futebol. Se a regra for quebrada (condição for falsa),
  ela joga a bandeira vermelha e para o jogo (lança um erro na tela).
*/
const assert = (condition, message) => {
  if (!condition) throw new Error(message || 'Falha na asserção');
};

/*
  FUNÇÃO QUE EXECUTA E MOSTRA O RESULTADO DO TESTE:
  Roda a função de teste e printa uma mensagem colorida na tela.
  - Se deu certo: mostra um símbolo verde (✔) dizendo que foi BEM-SUCEDIDO.
  - Se deu errado: mostra um símbolo vermelho (✘) com a mensagem de erro.
*/
async function runTest(name, fn) {
  try {
    await fn();
    console.log(`\x1b[32m✔ ${name} - BEM-SUCEDIDO\x1b[0m`);
  } catch (err) {
    console.error(`\x1b[31m✘ ${name} - MALSUCEDIDO\x1b[0m`);
    console.error(`  Erro: ${err.message}`);
  }
}

/*
  FUNÇÃO PRINCIPAL:
  É o roteiro dos testes. Ela chama os testes de cada pasta/repositório na ordem certa
  e avisa quando tudo terminou.
*/
async function runTestSuite() {
  console.log('🧪 Iniciando Bateria de Testes dos Repositórios em Memória (Estrutura Separada)...\n');

  console.log('--- Testando: UsuarioRepository ---');
  await testUsuario(runTest, assert);

  console.log('\n--- Testando: FilmeRepository ---');
  await testFilme(runTest, assert);

  console.log('\n--- Testando: SerieRepository ---');
  await testSerie(runTest, assert);

  console.log('\n--- Testando: AvaliacaoRepository ---');
  await testAvaliacao(runTest, assert);

  console.log('\n--- Testando: ListaAssistirRepository ---');
  await testListaAssistir(runTest, assert);

  console.log('\n🏁 Bateria de testes concluída!');
}

// Executa de fato todos os testes descritos acima
runTestSuite();
