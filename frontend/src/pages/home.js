import { recomendacoesAPI, filmesAPI, seriesAPI } from '../services/api.js';
import { renderCards } from '../components/card.js';

export async function initHome() {
  
  try {
    const trending = await recomendacoesAPI.trending(8);
    const grid = document.getElementById('trending-grid');
    if (grid) {
      const all = [
        ...trending.filmes.map(f => ({ ...f, tipo: 'FILME' })),
        ...trending.series.map(s => ({ ...s, tipo: 'SERIE' })),
      ].slice(0, 8);
      renderCards(grid, all.map(i => i), i => i.tipo);
      grid.innerHTML = '';
      all.forEach(item => {
        const { createContentCard } = window._card || {};
        import('../components/card.js').then(({ createContentCard }) => {
          grid.appendChild(createContentCard(item, item.tipo));
        });
      });
    }
  } catch {  }

  
  try {
    const { filmes } = await filmesAPI.listar({ limit: 8, page: 1 });
    const grid = document.getElementById('filmes-destaque-grid');
    if (grid) {
      const { renderCards } = await import('../components/card.js');
      renderCards(grid, filmes, 'FILME');
    }
  } catch {  }

  
  try {
    const { series } = await seriesAPI.listar({ limit: 8, page: 1 });
    const grid = document.getElementById('series-destaque-grid');
    if (grid) {
      const { renderCards } = await import('../components/card.js');
      renderCards(grid, series, 'SERIE');
    }
  } catch {  }
}
