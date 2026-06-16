



import { Serie } from '../../src/models/index.js';
import { SerieRepository } from '../index.js';






export default async function testSerie(runTest, assert) {
  
  await runTest('SerieRepository - Adicionar, buscar, filtrar e remover', () => {
    
    SerieRepository.limpar();
    const serie = new Serie({
      id: 's1',
      titulo: 'Breaking Bad',
      diretores: ['Vince Gilligan', 'Michelle MacLaren'],
      generos: ['Crime', 'Drama'],
      anoInicio: 2008,
      status: 'FINALIZADA',
      criadoPorUsuarioId: 'u1',
    });

    
    SerieRepository.adicionar(serie);
    assert(SerieRepository.collection.length === 1, 'Deveria conter 1 série');

    
    const buscada = SerieRepository.buscarPorId('s1');
    assert(buscada !== null, 'Deveria encontrar por ID');
    assert(buscada.criadoPorUsuarioId === 'u1', 'criadoPorUsuarioId incorreto');

    
    const lista = SerieRepository.listar({ status: 'FINALIZADA' });
    assert(lista.length === 1, 'Filtro por status falhou');

    
    const listaDiretor = SerieRepository.listar({ diretor: 'Vince' });
    assert(listaDiretor.length === 1, 'Filtro por diretor falhou');

    
    SerieRepository.remover('s1');
    assert(SerieRepository.collection.length === 0, 'Série não foi removida');
  });
}
