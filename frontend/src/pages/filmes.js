import { filmesAPI } from '../services/api.js';
import { renderCards } from '../components/card.js';
import { openModal, closeAllModals, showError, hideError } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { isLoggedIn } from '../contexts/auth.js';

let currentPage = 1;
let currentFilters = {};

export async function initFilmes() {
  await loadFilmes();
  setupFilmeFilters();
  setupFilmeForm();
}

async function loadFilmes(filters = {}, page = 1) {
  currentFilters = filters;
  currentPage = page;
  const grid = document.getElementById('filmes-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="skeleton-card"></div>'.repeat(8);

  try {
    const params = { ...filters, page, limit: 20 };
    Object.keys(params).forEach(k => !params[k] && delete params[k]);
    const { filmes, total, totalPages } = await filmesAPI.listar(params);
    renderCards(grid, filmes, 'FILME');
    renderPagination('filmes-pagination', page, totalPages, (p) => loadFilmes(filters, p));
  } catch (e) {
    showToast('Erro ao carregar filmes.', 'error');
    grid.innerHTML = '';
  }
}

function setupFilmeFilters() {
  document.getElementById('btn-filtrar-filmes')?.addEventListener('click', () => {
    const titulo = document.getElementById('filme-search')?.value || '';
    const genero = document.getElementById('filme-genero')?.value || '';
    loadFilmes({ titulo, genero });
  });
  document.getElementById('filme-search')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-filtrar-filmes')?.click();
  });
  document.getElementById('btn-add-filme')?.addEventListener('click', () => {
    if (!isLoggedIn()) { showToast('Faça login para adicionar filmes.', 'error'); return; }
    resetFilmeForm();
    openModal('modal-filme');
  });
}

function resetFilmeForm() {
  document.getElementById('filme-id').value = '';
  document.getElementById('modal-filme-title').textContent = 'Adicionar Filme';
  document.getElementById('form-filme').reset();
  hideError('filme-error');
}

function setupFilmeForm() {
  document.getElementById('form-filme')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError('filme-error');
    const id = document.getElementById('filme-id').value;
    const fd = new FormData();
    fd.append('titulo', document.getElementById('f-titulo').value);
    fd.append('diretor', document.getElementById('f-diretor').value);
    fd.append('anoLancamento', document.getElementById('f-ano').value);
    fd.append('duracao', document.getElementById('f-duracao').value || '0');
    fd.append('sinopse', document.getElementById('f-sinopse').value || '');
    fd.append('classificacao', document.getElementById('f-classificacao').value);
    fd.append('trailer', document.getElementById('f-trailer').value || '');
    const generosStr = document.getElementById('f-generos').value;
    const elencoStr = document.getElementById('f-elenco').value;
    fd.append('generos', JSON.stringify(generosStr.split(',').map(s => s.trim()).filter(Boolean)));
    fd.append('elenco', JSON.stringify(elencoStr.split(',').map(s => s.trim()).filter(Boolean)));
    const capaFile = document.getElementById('f-capa').files[0];
    if (capaFile) fd.append('capa', capaFile);

    try {
      if (id) {
        await filmesAPI.atualizar(id, fd);
        showToast('Filme atualizado com sucesso!', 'success');
      } else {
        await filmesAPI.criar(fd);
        showToast('Filme adicionado com sucesso!', 'success');
      }
      closeAllModals();
      loadFilmes(currentFilters, currentPage);
    } catch (err) {
      showError('filme-error', err.message);
    }
  });
}

export function abrirEdicaoFilme(filme) {
  document.getElementById('filme-id').value = filme.id;
  document.getElementById('modal-filme-title').textContent = 'Editar Filme';
  document.getElementById('f-titulo').value = filme.titulo || '';
  document.getElementById('f-diretor').value = filme.diretor || '';
  document.getElementById('f-ano').value = filme.anoLancamento || '';
  document.getElementById('f-duracao').value = filme.duracao || '';
  document.getElementById('f-sinopse').value = filme.sinopse || '';
  document.getElementById('f-classificacao').value = filme.classificacao || 'L';
  document.getElementById('f-trailer').value = filme.trailer || '';
  document.getElementById('f-generos').value = (filme.generos || []).join(', ');
  document.getElementById('f-elenco').value = (filme.elenco || []).join(', ');
  openModal('modal-filme');
}

export function renderPagination(containerId, currentPage, totalPages, onPageChange) {
  const container = document.getElementById(containerId);
  if (!container || totalPages <= 1) { if (container) container.innerHTML = ''; return; }
  container.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = `page-btn${i === currentPage ? ' active' : ''}`;
    btn.textContent = i;
    btn.addEventListener('click', () => onPageChange(i));
    container.appendChild(btn);
  }
}
