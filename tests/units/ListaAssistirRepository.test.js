



import { ListaAssistir } from '../../src/models/index.js';
import { ListaAssistirRepository } from '../index.js';






export default async function testListaAssistir(runTest, assert) {
  
  await runTest('ListaAssistirRepository - Adicionar lista e gerenciar itens', () => {
    ListaAssistirRepository.limpar();
    
    
    const lista = new ListaAssistir({
      id: 'l1',
      nome: 'Favoritos',
      usuarioId: 'u1'
    });

    ListaAssistirRepository.adicionar(lista);
    assert(ListaAssistirRepository.collection.length === 1, 'Deveria conter 1 lista');

    
    lista.adicionarItem({ conteudoId: 'f1', tipo: 'FILME', titulo: 'Interstellar' });
    assert(lista.totalItens === 1, 'Item não foi adicionado');

    
    lista.marcarComoAssistido('f1');
    assert(lista.listarAssistidos().length === 1, 'Item deveria constar como assistido');

    
    lista.favoritarItem('f1');
    assert(lista.listarFavoritos().length === 1, 'Item deveria estar favoritado');

    
    lista.removerItem('f1');
    assert(lista.totalItens === 0, 'Item não foi removido da lista');
  });
}
