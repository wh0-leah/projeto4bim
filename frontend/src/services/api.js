
const API_URL = 'http://localhost:3001/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(method, path, body = null, isFormData = false) {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const options = { method, headers, credentials: 'include' };
  if (body) options.body = isFormData ? body : JSON.stringify(body);

  const res = await fetch(`${API_URL}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.erro || 'Erro na requisição.');
  return data;
}


export const authAPI = {
  cadastrar: (d) => request('POST', '/auth/cadastrar', d),
  login: (d) => request('POST', '/auth/login', d),
  logout: () => request('POST', '/auth/logout'),
  perfil: () => request('GET', '/auth/perfil'),
  atualizarPerfil: (fd) => request('PUT', '/auth/perfil', fd, true),
  alterarSenha: (d) => request('PUT', '/auth/senha', d),
};


export const filmesAPI = {
  listar: (params = {}) => request('GET', `/filmes?${new URLSearchParams(params)}`),
  obter: (id) => request('GET', `/filmes/${id}`),
  criar: (fd) => request('POST', '/filmes', fd, true),
  atualizar: (id, fd) => request('PUT', `/filmes/${id}`, fd, true),
  remover: (id) => request('DELETE', '/filmes/excluirNomeCadastro', { id }),
};


export const seriesAPI = {
  listar: (params = {}) => request('GET', `/series?${new URLSearchParams(params)}`),
  obter: (id) => request('GET', `/series/${id}`),
  criar: (fd) => request('POST', '/series', fd, true),
  atualizar: (id, fd) => request('PUT', `/series/${id}`, fd, true),
  remover: (id) => request('DELETE', `/series/${id}`),
};


export const avaliacoesAPI = {
  listar: (params) => request('GET', `/avaliacoes?${new URLSearchParams(params)}`),
  criar: (d) => request('POST', '/avaliacoes', d),
  atualizar: (id, d) => request('PUT', `/avaliacoes/${id}`, d),
  remover: (id) => request('DELETE', `/avaliacoes/${id}`),
  curtir: (id) => request('POST', `/avaliacoes/${id}/curtir`),
};


export const listasAPI = {
  listar: () => request('GET', '/listas'),
  obter: (id) => request('GET', `/listas/${id}`),
  criar: (d) => request('POST', '/listas', d),
  remover: (id) => request('DELETE', `/listas/${id}`),
  favoritos: () => request('GET', '/listas/favoritos'),
  adicionarItem: (listaId, d) => request('POST', `/listas/${listaId}/itens`, d),
  atualizarItem: (listaId, itemId, d) => request('PUT', `/listas/${listaId}/itens/${itemId}`, d),
  removerItem: (listaId, itemId) => request('DELETE', `/listas/${listaId}/itens/${itemId}`),
};


export const recomendacoesAPI = {
  personalizadas: (limit = 10) => request('GET', `/recomendacoes?limit=${limit}`),
  trending: (limit = 10) => request('GET', `/recomendacoes/trending?limit=${limit}`),
};
