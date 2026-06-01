import { authAPI } from '../services/api.js';
import { getUser, isLoggedIn } from '../contexts/auth.js';
import { showToast } from '../components/toast.js';

export async function initPerfil() {
  const container = document.getElementById('perfil-container');
  if (!container) return;

  if (!isLoggedIn()) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔒</div>
        <h3>Faça login para ver seu perfil</h3>
      </div>`;
    return;
  }

  const user = getUser();
  container.innerHTML = `
    <div class="perfil-header">
      <div class="perfil-avatar-big">
        ${user.avatar ? `<img src="${user.avatar}" alt="${user.nome}" />` : user.nome?.charAt(0).toUpperCase()}
      </div>
      <div>
        <div class="perfil-nome">${user.nome}</div>
        <div class="perfil-email">📧 ${user.email}</div>
        ${user.bio ? `<div class="perfil-bio">${user.bio}</div>` : ''}
        <div style="margin-top:12px;display:flex;gap:8px">
          <span style="font-size:0.8rem;background:rgba(124,58,237,0.15);padding:4px 12px;border-radius:20px;color:var(--accent-secondary)">${user.role === 'ADMIN' ? '👑 Admin' : '🎬 Usuário'}</span>
        </div>
      </div>
    </div>

    <div style="max-width:480px">
      <h3 style="margin-bottom:20px">Editar Perfil</h3>
      <form id="form-perfil" style="display:flex;flex-direction:column;gap:16px">
        <div class="form-group">
          <label>Nome</label>
          <input type="text" id="perf-nome" class="form-input" value="${user.nome || ''}" />
        </div>
        <div class="form-group">
          <label>Bio</label>
          <textarea id="perf-bio" class="form-input form-textarea" rows="3">${user.bio || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Foto de perfil</label>
          <input type="file" id="perf-avatar" class="form-input" accept="image/*" />
        </div>
        <button type="submit" class="btn btn-primary">Salvar alterações</button>
      </form>

      <hr style="border-color:var(--border);margin:32px 0" />

      <h3 style="margin-bottom:20px">Alterar Senha</h3>
      <form id="form-senha" style="display:flex;flex-direction:column;gap:16px">
        <div class="form-group">
          <label>Senha atual</label>
          <input type="password" id="perf-senha-atual" class="form-input" placeholder="••••••••" />
        </div>
        <div class="form-group">
          <label>Nova senha</label>
          <input type="password" id="perf-nova-senha" class="form-input" placeholder="Mínimo 6 caracteres" minlength="6" />
        </div>
        <button type="submit" class="btn btn-secondary">Alterar Senha</button>
      </form>
    </div>
  `;

  document.getElementById('form-perfil')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('nome', document.getElementById('perf-nome').value);
    fd.append('bio', document.getElementById('perf-bio').value);
    const avatarFile = document.getElementById('perf-avatar').files[0];
    if (avatarFile) fd.append('avatar', avatarFile);
    try {
      await authAPI.atualizarPerfil(fd);
      showToast('Perfil atualizado!', 'success');
      window.location.reload();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  document.getElementById('form-senha')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const senhaAtual = document.getElementById('perf-senha-atual').value;
    const novaSenha = document.getElementById('perf-nova-senha').value;
    try {
      await authAPI.alterarSenha({ senhaAtual, novaSenha });
      showToast('Senha alterada com sucesso!', 'success');
      document.getElementById('form-senha').reset();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}
