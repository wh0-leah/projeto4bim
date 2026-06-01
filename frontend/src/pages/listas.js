import { listasAPI } from '../services/api.js';
import { openModal, closeAllModals, showError, hideError } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { isLoggedIn, getUser } from '../contexts/auth.js';

export async function initListas() {
  const container = document.getElementById('listas-container');
  if (!container) return;

  if (!isLoggedIn()) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔒</div>
        <h3>Faça login para ver suas listas</h3>
        <p>Crie listas personalizadas e acompanhe o que está assistindo.</p>
      </div>`;
    return;
  }

  await renderListas();
  setupListaForm();

  document.getElementById('btn-add-lista')?.addEventListener('click', () => {
    document.getElementById('form-nova-lista')?.reset();
    hideError('lista-error');
    openModal('modal-nova-lista');
  });
}

async function renderListas() {
  const container = document.getElementById('listas-container');
  if (!container) return;
  container.innerHTML = '<p class="text-muted">Carregando listas...</p>';

  try {
    const listas = await listasAPI.listar();
    if (listas.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <h3>Nenhuma lista criada</h3>
          <p>Clique em "+ Nova Lista" para começar.</p>
        </div>`;
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'listas-grid';

    listas.forEach(lista => {
      const card = document.createElement('div');
      card.className = 'lista-card';
      const itens = lista.itens || [];
      const assistidos = itens.filter(i => i.status === 'ASSISTIDO').length;
      const pendentes = itens.filter(i => i.status === 'PENDENTE').length;

      card.innerHTML = `
        <div class="lista-card-header">
          <div>
            <div class="lista-card-title">${lista.nome}</div>
            <div class="lista-count">${itens.length} título${itens.length !== 1 ? 's' : ''} · ✅ ${assistidos} · ⏳ ${pendentes}</div>
          </div>
          <div class="lista-card-actions">
            ${lista.publica ? '<span title="Pública">🌐</span>' : '<span title="Privada">🔒</span>'}
            <button class="icon-btn btn-del-lista" data-id="${lista.id}" title="Excluir lista">🗑️</button>
          </div>
        </div>
        <div class="lista-items-preview">
          ${itens.slice(0, 4).map(item => {
            const img = item.filme?.capa || item.serie?.banner;
            return img
              ? `<div class="lista-item-thumb"><img src="${img}" alt="" loading="lazy" /></div>`
              : `<div class="lista-item-thumb" style="display:flex;align-items:center;justify-content:center;font-size:1.5rem">${item.filmeId ? '🎬' : '📺'}</div>`;
          }).join('')}
          ${itens.length > 4 ? `<div class="lista-item-thumb" style="display:flex;align-items:center;justify-content:center;font-size:0.8rem;color:var(--text-muted)">+${itens.length - 4}</div>` : ''}
        </div>
      `;

      card.querySelector('.btn-del-lista')?.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!confirm('Excluir esta lista?')) return;
        try {
          await listasAPI.remover(lista.id);
          showToast('Lista removida!', 'success');
          renderListas();
        } catch (err) {
          showToast(err.message, 'error');
        }
      });

      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-del-lista')) return;
        window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'detalhe', listaId: lista.id } }));
      });

      grid.appendChild(card);
    });

    container.innerHTML = '';
    container.appendChild(grid);
  } catch (err) {
    showToast('Erro ao carregar listas.', 'error');
  }
}

function setupListaForm() {
  document.getElementById('form-nova-lista')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError('lista-error');
    const nome = document.getElementById('lista-nome').value;
    const publica = document.getElementById('lista-publica').checked;
    try {
      await listasAPI.criar({ nome, publica });
      showToast('Lista criada!', 'success');
      closeAllModals();
      renderListas();
    } catch (err) {
      showError('lista-error', err.message);
    }
  });
}
