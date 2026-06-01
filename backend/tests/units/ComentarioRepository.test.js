/*
  IMPORTAÇÕES:
  Puxa a definição da classe 'Comentario' e o repositório 'ComentarioRepository'.
*/
import { Comentario } from '../../src/models/index.js';
import { ComentarioRepository } from '../index.js';

/*
  FUNÇÃO DE TESTE DE COMENTÁRIOS:
  Valida se a lógica de cálculo de médias matemáticas de notas está certa e se o sistema
  impede que o mesmo usuário faça spam ou comente duas vezes o mesmo filme.
*/
export default async function testComentario(runTest, assert) {
  
  await runTest('ComentarioRepository - Adicionar, média e restrições', () => {
    ComentarioRepository.limpar();
    
    // 1. Criamos duas notas diferentes dadas por dois usuários diferentes ao filme 'f1'
    const c1 = new Comentario({
      id: 'c1',
      nota: 9,
      critica: 'Excelente',
      usuarioId: 'u1',
      conteudoId: 'f1'
    });
    const c2 = new Comentario({
      id: 'c2',
      nota: 7,
      critica: 'Bom',
      usuarioId: 'u2',
      conteudoId: 'f1'
    });

    // 2. Salva ambas na lista
    ComentarioRepository.adicionar(c1);
    ComentarioRepository.adicionar(c2);
    assert(ComentarioRepository.collection.length === 2, 'Deveria ter 2 comentários');

    // 3. Testa se o cálculo de média retornou 8 (soma 9 + 7 = 16. Dividido por 2 comentários = 8)
    const media = ComentarioRepository.calcularMedia('f1');
    assert(media === 8, `Média calculada errada: ${media} (esperado: 8)`);

    // 4. Cria um comentário com o mesmo usuário 'u1' no mesmo filme 'f1' e verifica se foi bloqueado
    const cDuplicado = new Comentario({
      id: 'c3',
      nota: 5,
      usuarioId: 'u1',
      conteudoId: 'f1'
    });

    try {
      ComentarioRepository.adicionar(cDuplicado);
      assert(false, 'Deveria barrar comentário duplicado do mesmo usuário');
    } catch (e) {
      assert(e.message === 'Usuário já avaliou este conteúdo.', 'Mensagem de erro incorreta');
    }
  });
}
