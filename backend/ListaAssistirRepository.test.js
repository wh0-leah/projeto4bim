



import { Comentario } from '../../src/models/index.js';
import { ComentarioRepository } from '../index.js';






export default async function testComentario(runTest, assert) {
  
  await runTest('ComentarioRepository - Adicionar, média e restrições', () => {
    ComentarioRepository.limpar();
    
    
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

    
    ComentarioRepository.adicionar(c1);
    ComentarioRepository.adicionar(c2);
    assert(ComentarioRepository.collection.length === 2, 'Deveria ter 2 comentários');

    
    const media = ComentarioRepository.calcularMedia('f1');
    assert(media === 8, `Média calculada errada: ${media} (esperado: 8)`);

    
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
