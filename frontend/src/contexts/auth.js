
import { authAPI } from '../services/api.js';
import { showToast } from '../components/toast.js';

let currentUser = null;

export function getUser() { return currentUser; }
export function isLoggedIn() { return !!currentUser; }

export function setUser(user) {
  currentUser = user;
  updateNavUI();
}

export async function initAuth() {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  if (token && userData) {
    currentUser = JSON.parse(userData);
    try {
      const perfil = await authAPI.perfil();
      currentUser = perfil;
      localStorage.setItem('user', JSON.stringify(perfil));
    } catch {
      logout();
      return;
    }
    updateNavUI();
  }
}

export async function login(email, senha) {
  const res = await authAPI.login({ email, senha });
  localStorage.setItem('token', res.token);
  localStorage.setItem('user', JSON.stringify(res.usuario));
  currentUser = res.usuario;
  updateNavUI();
  showToast(`Bem-vindo, ${res.usuario.nome}! 🎬`, 'success');
  return res;
}

export async function cadastrar(nome, email, senha) {
  const res = await authAPI.cadastrar({ nome, email, senha });
  localStorage.setItem('token', res.token);
  localStorage.setItem('user', JSON.stringify(res.usuario));
  currentUser = res.usuario;
  updateNavUI();
  showToast(`Conta criada! Bem-vindo, ${res.usuario.nome}! 🎉`, 'success');
  return res;
}

export async function logout() {
  try {
    await authAPI.logout();
  } catch {
  }
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentUser = null;
  updateNavUI();
  showToast('Você saiu da sua conta.', 'info');
  window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'home' } }));
}

function updateNavUI() {
  const authArea = document.getElementById('nav-auth-area');
  const userArea = document.getElementById('nav-user-area');
  const userInitial = document.getElementById('user-initial');
  const userNameNav = document.getElementById('user-name-nav');

  if (currentUser) {
    authArea?.classList.add('hidden');
    userArea?.classList.remove('hidden');
    if (userInitial) userInitial.textContent = currentUser.nome?.charAt(0).toUpperCase() || 'U';
    if (userNameNav) userNameNav.textContent = currentUser.nome;
  } else {
    authArea?.classList.remove('hidden');
    userArea?.classList.add('hidden');
  }
}
