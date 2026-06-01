// Card component for films and series
export function createContentCard(item, tipo) {
  const isFilme = tipo === 'FILME';
  const img = isFilme ? item.capa : item.banner;
  const sub = isFilme ? item.diretor : item.criador;
  const tags = (item.generos || []).slice(0, 2);
  const ano = isFilme ? item.anoLancamento : item.anoInicio;

  const card = document.createElement('div');
  card.className = 'content-card';
  card.dataset.id = item.id;
  card.dataset.tipo = tipo;

  card.innerHTML = `
    <div class="card-img-wrap">
      ${img
        ? `<img class="card-img" src="${img}" alt="${item.titulo}" loading="lazy" />`
        : `<div class="card-no-img">${isFilme ? '🎬' : '📺'}</div>`
      }
      <span class="card-badge ${isFilme ? 'badge-filme' : 'badge-serie'}">${isFilme ? 'Filme' : 'Série'}</span>
      ${item.mediaAvaliacao > 0
        ? `<div class="card-rating">⭐ ${Number(item.mediaAvaliacao).toFixed(1)}</div>`
        : ''
      }
    </div>
    <div class="card-body">
      <div class="card-title" title="${item.titulo}">${item.titulo}</div>
      <div class="card-sub">${sub || ''}${ano ? ` · ${ano}` : ''}</div>
      <div class="card-tags">
        ${tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    </div>
  `;

  card.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('navigate', {
      detail: { page: 'detalhe', id: item.id, tipo }
    }));
  });

  return card;
}

export function renderCards(container, items, tipo) {
  container.innerHTML = '';
  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state-icon">${tipo === 'FILME' ? '🎬' : '📺'}</div>
        <h3>Nenhum resultado encontrado</h3>
        <p>Tente buscar com outros termos.</p>
      </div>`;
    return;
  }
  items.forEach(item => container.appendChild(createContentCard(item, tipo)));
}
