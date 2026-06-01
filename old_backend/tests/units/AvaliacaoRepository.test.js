/*
  IMPORTAÇÕES:
  Puxa a definição da classe 'Avaliacao' e o repositório 'AvaliacaoRepository'.
*/
import { Avaliacao } from '../../src/models/index.js';
import { AvaliacaoRepository } from '../index.js';

/*
  FUNÇÃO DE TESTE DE AVALIAÇÕES:
  Valida se a lógica de cálculo de médias matemáticas de notas está certa e se o sistema
  impede que o mesmo usuário faça spam ou avalie duas vezes o mesmo filme.
*/
export default async function testAvaliacao(runTest, assert) {
  
  await runTest('AvaliacaoRepository - Adicionar, média e restrições', () => {
    AvaliacaoRepository.limpar();
    
    // 1. Criamos duas notas diferentes dadas por dois usuários diferentes ao filme 'f1'
    const av1 = new Avaliacao({
      id: 'a1',
      nota: 9,
      critica: 'Excelente',
      usuarioId: 'u1',
      conteudoId: 'f1',
      tipo: 'FILME'
    });
    const av2 = new Avaliacao({
      id: 'a2',
      nota: 7,
      critica: 'Bom',
      usuarioId: 'u2',
      conteudoId: 'f1',
      tipo: 'FILME'
    });

    // 2. Salva ambas na lista
    AvaliacaoRepository.adicionar(av1);
    AvaliacaoRepository.adicionar(av2);
    assert(AvaliacaoRepository.collection.length === 2, 'Deveria ter 2 avaliações');

    // 3. Testa se o cálculo de média retornou 8 (soma 9 + 7 = 16. Dividido por 2 avaliações = 8)
    const media = AvaliacaoRepository.calcularMedia('f1');
    assert(media === 8, `Média calculada errada: ${media} (esperado: 8)`);

    // 4. Cria uma avaliação com o mesmo usuário 'u1' no mesmo filme 'f1' e verifica se foi bloqueada
    const avDuplicada = new Avaliacao({
      id: 'a3',
      nota: 5,
      usuarioId: 'u1',
      conteudoId: 'f1',
      tipo: 'FILME'
    });

    try {
      AvaliacaoRepository.adicionar(avDuplicada);
      assert(false, 'Deveria barrar avaliação duplicada do mesmo usuário');
    } catch (e) {
      assert(e.message === 'Usuário já avaliou este conteúdo.', 'Mensagem de erro incorreta');
    }
  });
}
