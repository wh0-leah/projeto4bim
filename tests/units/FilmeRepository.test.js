




import { Filme } from '../../src/models/index.js';
import { FilmeRepository } from '../index.js';






export default async function testFilme(runTest, assert) {
  
  await runTest('FilmeRepository - Adicionar, buscar, listar e remover', () => {
    
    FilmeRepository.limpar();
    const filme = new Filme({
      id: 'f1',
      titulo: 'Interstellar',
      diretores: ['Christopher Nolan', 'Jonathan Nolan'],
      generos: ['Ficção Científica', 'Drama'],
      anoLancamento: 2014,
      criadoPorUsuarioId: 'u1',
    });

    
    FilmeRepository.adicionar(filme);
    assert(FilmeRepository.collection.length === 1, 'Deveria conter 1 filme');

    
    const buscado = FilmeRepository.buscarPorId('f1');
    assert(buscado !== null, 'Deveria encontrar por ID');
    assert(buscado.criadoPorUsuarioId === 'u1', 'criadoPorUsuarioId incorreto');

    
    const lista = FilmeRepository.listar({ genero: 'ficção' });
    assert(lista.length === 1, 'Filtro por gênero falhou');
    assert(lista[0].titulo === 'Interstellar', 'Título do filme filtrado incorreto');

    
    const listaDiretor = FilmeRepository.listar({ diretor: 'Nolan' });
    assert(listaDiretor.length === 1, 'Filtro por diretor falhou');

    
    FilmeRepository.remover('f1');
    assert(FilmeRepository.collection.length === 0, 'Filme não foi removido');
  });
}
