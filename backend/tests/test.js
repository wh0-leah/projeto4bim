import testUsuario from './units/UsuarioRepository.test.js';
import testFilme from './units/FilmeRepository.test.js';
import testSerie from './units/SerieRepository.test.js';
import testComentario from './units/ComentarioRepository.test.js';
import testListaAssistir from './units/ListaAssistirRepository.test.js';
import testControllers from './units/ControllerResiliencia.test.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(message || 'Falha na asserção');
};

async function runTest(name, fn) {
  try {
    await fn();
    console.log(`\x1b[32m✔ ${name} - BEM-SUCEDIDO\x1b[0m`);
  } catch (err) {
    console.error(`\x1b[31m✘ ${name} - MALSUCEDIDO\x1b[0m`);
    console.error(`  Erro: ${err.message}`);
  }
}

async function runTestSuite() {
  console.log('🧪 Iniciando Bateria de Testes dos Repositórios em Memória (Estrutura Separada)...\n');

  console.log('--- Testando: UsuarioRepository ---');
  await testUsuario(runTest, assert);

  console.log('\n--- Testando: FilmeRepository ---');
  await testFilme(runTest, assert);

  console.log('\n--- Testando: SerieRepository ---');
  await testSerie(runTest, assert);

  console.log('\n--- Testando: ComentarioRepository ---');
  await testComentario(runTest, assert);

  console.log('\n--- Testando: ListaAssistirRepository ---');
  await testListaAssistir(runTest, assert);

  console.log('\n--- Testando: Controllers (Resiliência try/catch) ---');
  await testControllers(runTest, assert);

  console.log('\n🏁 Bateria de testes concluída!');
}

runTestSuite();
