/*
  IMPORTAÇÕES:
  Carrega o modelo 'Filme' e a classe 'FilmeRepository' para simularmos o cadastro
  e buscas de filmes.
*/
import { Filme } from '../../src/models/index.js';
import { FilmeRepository } from '../index.js';

/*
  FUNÇÃO DE TESTE DE FILMES:
  Valida o ciclo de vida completo de um filme no repositório:
  Criação -> Salvamento -> Busca -> Filtro -> Exclusão.
*/
export default async function testFilme(runTest, assert) {
  
  await runTest('FilmeRepository - Adicionar, buscar, listar e remover', () => {
    // 1. Limpa a estante e cria um filme com um array contendo múltiplos nomes de diretores
    FilmeRepository.limpar();
    const filme = new Filme({
      id: 'f1',
      titulo: 'Interstellar',
      diretores: ['Christopher Nolan', 'Jonathan Nolan'],
      generos: ['Ficção Científica', 'Drama'],
      anoLancamento: 2014,
      criadoPorUsuarioId: 'u1',
    });

    // 2. Salva e verifica se ele está lá
    FilmeRepository.adicionar(filme);
    assert(FilmeRepository.collection.length === 1, 'Deveria conter 1 filme');

    // 3. Tenta resgatar pelo ID único
    const buscado = FilmeRepository.buscarPorId('f1');
    assert(buscado !== null, 'Deveria encontrar por ID');
    assert(buscado.criadoPorUsuarioId === 'u1', 'criadoPorUsuarioId incorreto');

    // 4. Testa a busca filtrando pelo gênero 'ficção' (com letras minúsculas)
    const lista = FilmeRepository.listar({ genero: 'ficção' });
    assert(lista.length === 1, 'Filtro por gênero falhou');
    assert(lista[0].titulo === 'Interstellar', 'Título do filme filtrado incorreto');

    // 5. Testa a busca filtrando por um dos diretores ('Nolan')
    const listaDiretor = FilmeRepository.listar({ diretor: 'Nolan' });
    assert(listaDiretor.length === 1, 'Filtro por diretor falhou');

    // 6. Deleta o filme e confirma que a estante ficou vazia
    FilmeRepository.remover('f1');
    assert(FilmeRepository.collection.length === 0, 'Filme não foi removido');
  });
}
