// ── Main Application Router — Critério 3: ES Modules
import { initAuth, login, cadastrar, logout } from './contexts/auth.js';
import { openModal, closeAllModals, showError, hideError } from './components/modal.js';
import { showToast } from './components/toast.js';
import { initHome } from './pages/home.js';
import { initFilmes } from './pages/filmes.js';
import { initSeries } from './pages/series.js';
import { initListas } from './pages/listas.js';
import { initDetalhe } from './pages/detalhe.js';
import { initPerfil } from './pages/perfil.js';
import { filmesAPI, seriesAPI } from './services/api.js';

// ── Router ─────────────────────────────────────────────────
let currentPage = 'home';

function navigateTo(page, params = {}) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  const el = document.getElementById(`page-${page}`);
  if (el) {
    el.classList.remove('hidden');
    const navLink = document.querySelector(`[data-page="${page}"]`);
    navLink?.classList.add('active');
  }

  currentPage = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  switch (page) {
    case 'home':    initHome(); break;
    case 'filmes':  initFilmes(); break;
    case 'series':  initSeries(); break;
    case 'listas':  initListas(); break;
    case 'detalhe': initDetalhe(params); break;
    case 'perfil':  initPerfil(); break;
  }
}

// Custom navigation event
window.addEventListener('navigate', (e) => {
  const { page, ...params } = e.detail;
  navigateTo(page, params);
});

// ── Nav Links ──────────────────────────────────────────────
document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo(el.dataset.page);
  });
});

document.querySelector('.navbar-brand')?.addEventListener('click', () => navigateTo('home'));

// ── Search ─────────────────────────────────────────────────
document.getElementById('search-btn')?.addEventListener('click', () => doSearch());
document.getElementById('search-input')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') doSearch();
});

async function doSearch() {
  const query = document.getElementById('search-input')?.value?.trim();
  if (!query) return;

  navigateTo('filmes');
  // Wait for page to render then trigger filter
  setTimeout(() => {
    const searchInput = document.getElementById('filme-search');
    if (searchInput) searchInput.value = query;
    document.getElementById('btn-filtrar-filmes')?.click();
  }, 100);
}

// ── Auth Modal Triggers ────────────────────────────────────
document.getElementById('btn-login')?.addEventListener('click', () => openModal('modal-login'));
document.getElementById('btn-cadastro')?.addEventListener('click', () => openModal('modal-cadastro'));
document.getElementById('hero-cadastro')?.addEventListener('click', () => openModal('modal-cadastro'));
document.getElementById('hero-explore')?.addEventListener('click', () => navigateTo('filmes'));
document.getElementById('btn-logout')?.addEventListener('click', logout);

document.getElementById('switch-to-cadastro')?.addEventListener('click', (e) => {
  e.preventDefault(); openModal('modal-cadastro');
});
document.getElementById('switch-to-login')?.addEventListener('click', (e) => {
  e.preventDefault(); openModal('modal-login');
});

// ── Login Form ─────────────────────────────────────────────
document.getElementById('form-login')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError('login-error');
  const email = document.getElementById('login-email').value;
  const senha = document.getElementById('login-senha').value;
  try {
    await login(email, senha);
    closeAllModals();
    navigateTo(currentPage);
  } catch (err) {
    showError('login-error', err.message);
  }
});

// ── Cadastro Form ──────────────────────────────────────────
document.getElementById('form-cadastro')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError('cad-error');
  const nome = document.getElementById('cad-nome').value;
  const email = document.getElementById('cad-email').value;
  const senha = document.getElementById('cad-senha').value;
  try {
    await cadastrar(nome, email, senha);
    closeAllModals();
    navigateTo(currentPage);
  } catch (err) {
    showError('cad-error', err.message);
  }
});

// ── Hero section links ─────────────────────────────────────
document.querySelectorAll('.section-link').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo(el.dataset.page || 'home');
  });
});

// ── Init ───────────────────────────────────────────────────
async function init() {
  await initAuth();
  navigateTo('home');
}

init();
