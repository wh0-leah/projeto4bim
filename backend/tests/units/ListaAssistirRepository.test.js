/*
  IMPORTAÇÕES:
  Importa o modelo da Playlist ('ListaAssistir') e seu respectivo repositório.
*/
import { ListaAssistir } from '../../src/models/index.js';
import { ListaAssistirRepository } from '../index.js';

/*
  FUNÇÃO DE TESTE DE LISTA DE ASSISTIR (PLAYLISTS):
  Garante que o usuário consegue criar playlists, adicionar filmes dentro delas,
  marcar itens que já assistiu e favoritar itens individualmente dentro dessa lista.
*/
export default async function testListaAssistir(runTest, assert) {
  
  await runTest('ListaAssistirRepository - Adicionar lista e gerenciar itens', () => {
    ListaAssistirRepository.limpar();
    
    // 1. Criamos e adicionamos uma nova lista chamada 'Favoritos' para o usuário 'u1'
    const lista = new ListaAssistir({
      id: 'l1',
      nome: 'Favoritos',
      usuarioId: 'u1'
    });

    ListaAssistirRepository.adicionar(lista);
    assert(ListaAssistirRepository.collection.length === 1, 'Deveria conter 1 lista');

    // 2. Coloca o filme 'f1' dentro da lista 'Favoritos'
    lista.adicionarItem({ conteudoId: 'f1', tipo: 'FILME', titulo: 'Interstellar' });
    assert(lista.totalItens === 1, 'Item não foi adicionado');

    // 3. Marca o filme como já assistido
    lista.marcarComoAssistido('f1');
    assert(lista.listarAssistidos().length === 1, 'Item deveria constar como assistido');

    // 4. Ativa o botão de "favorito" no filme dentro da lista
    lista.favoritarItem('f1');
    assert(lista.listarFavoritos().length === 1, 'Item deveria estar favoritado');

    // 5. Exclui o filme da lista
    lista.removerItem('f1');
    assert(lista.totalItens === 0, 'Item não foi removido da lista');
  });
}
