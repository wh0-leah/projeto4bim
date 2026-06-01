import { seriesAPI } from '../services/api.js';
import { renderCards } from '../components/card.js';
import { openModal, closeAllModals, showError, hideError } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { isLoggedIn } from '../contexts/auth.js';
import { renderPagination } from './filmes.js';

let currentPage = 1;
let currentFilters = {};

export async function initSeries() {
  await loadSeries();
  setupSerieFilters();
  setupSerieForm();
}

async function loadSeries(filters = {}, page = 1) {
  currentFilters = filters;
  currentPage = page;
  const grid = document.getElementById('series-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="skeleton-card"></div>'.repeat(8);
  try {
    const params = { ...filters, page, limit: 20 };
    Object.keys(params).forEach(k => !params[k] && delete params[k]);
    const { series, totalPages } = await seriesAPI.listar(params);
    renderCards(grid, series, 'SERIE');
    renderPagination('series-pagination', page, totalPages, (p) => loadSeries(filters, p));
  } catch {
    showToast('Erro ao carregar séries.', 'error');
    grid.innerHTML = '';
  }
}

function setupSerieFilters() {
  document.getElementById('btn-filtrar-series')?.addEventListener('click', () => {
    const titulo = document.getElementById('serie-search')?.value || '';
    const genero = document.getElementById('serie-genero')?.value || '';
    const status = document.getElementById('serie-status')?.value || '';
    loadSeries({ titulo, genero, status });
  });
  document.getElementById('serie-search')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-filtrar-series')?.click();
  });
  document.getElementById('btn-add-serie')?.addEventListener('click', () => {
    if (!isLoggedIn()) { showToast('Faça login para adicionar séries.', 'error'); return; }
    document.getElementById('form-serie')?.reset();
    document.getElementById('serie-id').value = '';
    document.getElementById('modal-serie-title').textContent = 'Adicionar Série';
    hideError('serie-error');
    openModal('modal-serie');
  });
}

function setupSerieForm() {
  document.getElementById('form-serie')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError('serie-error');
    const id = document.getElementById('serie-id').value;
    const fd = new FormData();
    fd.append('titulo', document.getElementById('s-titulo').value);
    fd.append('criador', document.getElementById('s-criador').value);
    fd.append('anoInicio', document.getElementById('s-ano-inicio').value);
    fd.append('anoFim', document.getElementById('s-ano-fim').value || '');
    fd.append('temporadas', document.getElementById('s-temporadas').value || '1');
    fd.append('status', document.getElementById('s-status').value);
    fd.append('sinopse', document.getElementById('s-sinopse').value || '');
    fd.append('classificacao', document.getElementById('s-classificacao').value);
    fd.append('trailer', document.getElementById('s-trailer').value || '');
    const generosStr = document.getElementById('s-generos').value;
    const elencoStr = document.getElementById('s-elenco').value;
    fd.append('generos', JSON.stringify(generosStr.split(',').map(s => s.trim()).filter(Boolean)));
    fd.append('elenco', JSON.stringify(elencoStr.split(',').map(s => s.trim()).filter(Boolean)));
    const bannerFile = document.getElementById('s-banner').files[0];
    if (bannerFile) fd.append('banner', bannerFile);
    try {
      if (id) {
        await seriesAPI.atualizar(id, fd);
        showToast('Série atualizada com sucesso!', 'success');
      } else {
        await seriesAPI.criar(fd);
        showToast('Série adicionada com sucesso!', 'success');
      }
      closeAllModals();
      loadSeries(currentFilters, currentPage);
    } catch (err) {
      showError('serie-error', err.message);
    }
  });
}
