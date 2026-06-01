/*
  IMPORTAÇÕES:
  Puxa o modelo 'Serie' e o repositório 'SerieRepository' para realizar os testes de séries.
*/
import { Serie } from '../../src/models/index.js';
import { SerieRepository } from '../index.js';

/*
  FUNÇÃO DE TESTE DE SÉRIES:
  Testa se as operações básicas (salvar, buscar por id, filtrar pelo status de finalizada
  e remover) funcionam corretamente na nossa lista em memória.
*/
export default async function testSerie(runTest, assert) {
  
  await runTest('SerieRepository - Adicionar, buscar, filtrar e remover', () => {
    // 1. Limpa as séries salvas e cria a série Breaking Bad com um array contendo múltiplos diretores
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

    // 2. Adiciona a série ao repositório
    SerieRepository.adicionar(serie);
    assert(SerieRepository.collection.length === 1, 'Deveria conter 1 série');

    // 3. Tenta buscar a série pelo ID
    const buscada = SerieRepository.buscarPorId('s1');
    assert(buscada !== null, 'Deveria encontrar por ID');
    assert(buscada.criadoPorUsuarioId === 'u1', 'criadoPorUsuarioId incorreto');

    // 4. Filtra apenas séries com status 'FINALIZADA' e checa se retornou Breaking Bad
    const lista = SerieRepository.listar({ status: 'FINALIZADA' });
    assert(lista.length === 1, 'Filtro por status falhou');

    // 5. Filtra por um dos diretores ('Vince')
    const listaDiretor = SerieRepository.listar({ diretor: 'Vince' });
    assert(listaDiretor.length === 1, 'Filtro por diretor falhou');

    // 6. Exclui a série e garante que ela sumiu
    SerieRepository.remover('s1');
    assert(SerieRepository.collection.length === 0, 'Série não foi removida');
  });
}
