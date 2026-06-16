import { filmesAPI, seriesAPI, avaliacoesAPI, listasAPI } from '../services/api.js';
import { openModal, closeAllModals, showError, hideError } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { isLoggedIn, getUser } from '../contexts/auth.js';
import { initRating, setRating } from '../components/rating.js';
import { abrirEdicaoFilme } from './filmes.js';

export async function initDetalhe({ id, tipo }) {
  const container = document.getElementById('detalhe-container');
  if (!container) return;
  container.innerHTML = '<div style="padding:80px;text-align:center;color:var(--text-secondary)">Carregando...</div>';

  try {
    const item = tipo === 'FILME' ? await filmesAPI.obter(id) : await seriesAPI.obter(id);
    renderDetalhe(container, item, tipo);
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">❌</div><h3>Conteúdo não encontrado</h3></div>`;
  }
}

function renderDetalhe(container, item, tipo) {
  const isFilme = tipo === 'FILME';
  const img = isFilme ? item.capa : item.banner;
  const subTitle = isFilme ? `Diretor: ${item.diretor}` : `Criador: ${item.criador}`;
  const ano = isFilme ? item.anoLancamento : `${item.anoInicio}${item.anoFim ? ' – ' + item.anoFim : ''}`;
  const extra = isFilme ? `${item.duracao ? item.duracao + ' min' : ''}` : `${item.temporadas} temporada${item.temporadas !== 1 ? 's' : ''}`;
  const user = getUser();

  container.innerHTML = `
    <div class="detalhe-hero">
      <div class="detalhe-bg">
        ${img ? `<img src="${img}" alt="${item.titulo}" />` : ''}
        <div class="detalhe-bg-gradient"></div>
      </div>
      <div class="detalhe-content">
        <div class="${img ? 'detalhe-poster' : 'detalhe-poster-placeholder'}">
          ${img ? `<img src="${img}" alt="${item.titulo}" />` : (isFilme ? '🎬' : '📺')}
        </div>
        <div class="detalhe-info">
          <div class="detalhe-badges">
            <span class="card-badge ${isFilme ? 'badge-filme' : 'badge-serie'}" style="position:static">${isFilme ? 'Filme' : 'Série'}</span>
            ${!isFilme ? `<span class="status-badge status-${item.status?.toLowerCase()}">${formatStatus(item.status)}</span>` : ''}
            <span style="font-size:0.8rem;color:var(--text-muted)">${item.classificacao || ''}</span>
          </div>
          <h1 class="detalhe-title">${item.titulo}</h1>
          <div class="detalhe-meta">
            <span>${subTitle}</span>
            <span>${ano}</span>
            ${extra ? `<span>${extra}</span>` : ''}
            ${(item.generos || []).length > 0 ? `<span>${item.generos.join(', ')}</span>` : ''}
          </div>
          <div class="detalhe-rating-big">
            <span class="rating-number">${item.mediaAvaliacao > 0 ? Number(item.mediaAvaliacao).toFixed(1) : '—'}</span>
            <div>
              <div style="color:var(--accent-gold);font-size:1.1rem">${renderStars(item.mediaAvaliacao)}</div>
              <div style="font-size:0.8rem;color:var(--text-muted)">${(item.avaliacoes || []).length} avaliações</div>
            </div>
          </div>
          <div class="detalhe-actions">
            ${isLoggedIn() ? `
              <button class="btn btn-primary" id="btn-avaliar-detalhe">⭐ Avaliar</button>
              <button class="btn btn-secondary" id="btn-add-lista-detalhe">+ Adicionar à Lista</button>
              ${item.usuarioCriadoPorId === user?.id || user?.role === 'ADMIN' ? `
                <button class="btn btn-outline" id="btn-editar-detalhe">✏️ Editar</button>
                <button class="btn btn-danger" id="btn-excluir-detalhe">🗑️ Excluir</button>
              ` : ''}
            ` : `<button class="btn btn-outline" id="btn-login-detalhe">Faça login para avaliar</button>`}
            ${item.trailer ? `<a href="${item.trailer}" target="_blank" class="btn btn-outline">▶ Trailer</a>` : ''}
          </div>
        </div>
      </div>
    </div>

    <div class="detalhe-body">
      <div>
        <div class="detalhe-sinopse">
          <h3>Sinopse</h3>
          <p>${item.sinopse || 'Sem sinopse disponível.'}</p>
        </div>
        ${(item.elenco || []).length > 0 ? `
          <div class="detalhe-sinopse" style="margin-top:28px">
            <h3>Elenco</h3>
            <div class="card-tags" style="margin-top:8px">
              ${item.elenco.map(a => `<span class="tag">${a}</span>`).join('')}
            </div>
          </div>
        ` : ''}
        <div class="detalhe-avaliacoes" style="margin-top:36px">
          <h3>Avaliações</h3>
          <div id="avaliacoes-list">
            ${renderAvaliacoes(item.avaliacoes || [], user)}
          </div>
        </div>
      </div>
      <div>
        <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:20px">
          <h3 style="margin-bottom:16px">Informações</h3>
          ${isFilme ? `
            <div class="info-row"><span class="text-muted">Diretor</span><span>${item.diretor}</span></div>
            <div class="info-row"><span class="text-muted">Duração</span><span>${item.duracao ? item.duracao + ' min' : '—'}</span></div>
          ` : `
            <div class="info-row"><span class="text-muted">Criador</span><span>${item.criador}</span></div>
            <div class="info-row"><span class="text-muted">Temporadas</span><span>${item.temporadas}</span></div>
            <div class="info-row"><span class="text-muted">Status</span><span>${formatStatus(item.status)}</span></div>
          `}
          <div class="info-row"><span class="text-muted">Ano</span><span>${ano}</span></div>
          <div class="info-row"><span class="text-muted">Gêneros</span><span>${(item.generos || []).join(', ') || '—'}</span></div>
          <div class="info-row"><span class="text-muted">Classificação</span><span>${item.classificacao || '—'}</span></div>
        </div>
      </div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `.info-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);font-size:0.875rem}.info-row:last-child{border-bottom:none}.info-row .text-muted{color:var(--text-secondary)}`;
  container.appendChild(style);

  
  document.getElementById('btn-avaliar-detalhe')?.addEventListener('click', () => {
    initRating();
    document.getElementById('aval-conteudo-id').value = item.id;
    document.getElementById('aval-tipo').value = tipo;
    document.getElementById('aval-id').value = '';
    document.getElementById('aval-critica').value = '';
    hideError('aval-error');
    openModal('modal-avaliacao');
  });

  document.getElementById('btn-add-lista-detalhe')?.addEventListener('click', async () => {
    try {
      const listas = await listasAPI.listar();
      if (listas.length === 0) {
        showToast('Crie uma lista primeiro!', 'info');
        window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'listas' } }));
        return;
      }
      const nomes = listas.map(l => l.nome).join('\n');
      const escolha = prompt(`Escolha uma lista (1-${listas.length}):\n${listas.map((l, i) => `${i+1}. ${l.nome}`).join('\n')}`);
      if (!escolha) return;
      const idx = Number(escolha) - 1;
      if (idx < 0 || idx >= listas.length) { showToast('Opção inválida.', 'error'); return; }
      const lista = listas[idx];
      await listasAPI.adicionarItem(lista.id, isFilme ? { filmeId: item.id } : { serieId: item.id });
      showToast(`"${item.titulo}" adicionado a "${lista.nome}"!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  document.getElementById('btn-editar-detalhe')?.addEventListener('click', () => {
    if (isFilme) abrirEdicaoFilme(item);
  });

  document.getElementById('btn-excluir-detalhe')?.addEventListener('click', async () => {
    if (!confirm(`Excluir "${item.titulo}"?`)) return;
    try {
      if (isFilme) await filmesAPI.remover(item.id);
      else await seriesAPI.remover(item.id);
      showToast('Excluído com sucesso!', 'success');
      window.dispatchEvent(new CustomEvent('navigate', { detail: { page: isFilme ? 'filmes' : 'series' } }));
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  document.getElementById('btn-login-detalhe')?.addEventListener('click', () => {
    openModal('modal-login');
  });

  
  document.getElementById('form-avaliacao')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nota = Number(document.getElementById('aval-nota').value);
    if (!nota) { showError('aval-error', 'Selecione uma nota.'); return; }
    const critica = document.getElementById('aval-critica').value;
    const conteudoId = document.getElementById('aval-conteudo-id').value;
    const tipo2 = document.getElementById('aval-tipo').value;
    const avalId = document.getElementById('aval-id').value;
    try {
      if (avalId) await avaliacoesAPI.atualizar(avalId, { nota, critica });
      else await avaliacoesAPI.criar({ nota, critica, conteudoId, tipo: tipo2 });
      showToast('Avaliação publicada!', 'success');
      closeAllModals();
      initDetalhe({ id: item.id, tipo });
    } catch (err) {
      showError('aval-error', err.message);
    }
  });
}

function renderAvaliacoes(avaliacoes, user) {
  if (!avaliacoes.length) return '<p class="text-muted text-sm">Seja o primeiro a avaliar!</p>';
  return avaliacoes.map(a => `
    <div class="avaliacao-card">
      <div class="aval-header">
        <div class="aval-avatar">${(a.usuario?.nome || 'U').charAt(0).toUpperCase()}</div>
        <div>
          <div class="aval-user">${a.usuario?.nome || 'Usuário'}</div>
          <div class="aval-date">${new Date(a.dataAvaliacao).toLocaleDateString('pt-BR')}</div>
        </div>
        <div class="aval-nota">⭐ ${Number(a.nota).toFixed(1)}</div>
      </div>
      ${a.critica ? `<div class="aval-critica">${a.critica}</div>` : ''}
      <div class="aval-actions">
        <button class="icon-btn" onclick="window._curtirAval('${a.id}')">👍 ${a.curtidas}</button>
        ${user?.id === a.usuarioId ? `<button class="icon-btn btn-del-aval" data-id="${a.id}">🗑️</button>` : ''}
      </div>
    </div>
  `).join('');
}

function renderStars(nota) {
  const n = Math.round(nota / 2);
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function formatStatus(status) {
  const map = { EM_ANDAMENTO: 'Em Andamento', FINALIZADA: 'Finalizada', CANCELADA: 'Cancelada' };
  return map[status] || status;
}

window._curtirAval = async (id) => {
  try {
    await avaliacoesAPI.curtir(id);
    showToast('Avaliação curtida!', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  }
};
