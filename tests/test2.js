import { FilmeRepository } from './index.js';
import { Filme } from '../src/models/Filme.js';

FilmeRepository.adicionar(new Filme({  }));

if (FilmeRepository.collection.length == 1) {
        console.log('Tudo bem');
}
else {
        console.log('Tudo errado');
}
