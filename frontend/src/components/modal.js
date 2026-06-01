// Modal management component
const overlay = document.getElementById('modal-overlay');

export function openModal(id) {
  overlay?.classList.remove('hidden');
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
  document.getElementById(id)?.classList.remove('hidden');
}

export function closeAllModals() {
  overlay?.classList.add('hidden');
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
}

// Close on overlay click or [data-close] buttons
overlay?.addEventListener('click', (e) => {
  if (e.target === overlay) closeAllModals();
});
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', closeAllModals);
});

export function showError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
}

export function hideError(id) {
  document.getElementById(id)?.classList.add('hidden');
}
