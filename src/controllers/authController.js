import * as authService from '../services/authService.js';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function gravarCookiesLogin(res, resultado) {
  res.cookie('token', resultado.token, cookieOptions);
  res.cookie('logado', 'true', {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: cookieOptions.maxAge,
  });
}

export async function cadastrar(req, res, next) {
  try {
    const { nome, email, senha } = req.body;
    const resultado = await authService.cadastrar({ nome, email, senha });
    gravarCookiesLogin(res, resultado);
    res.status(201).json(resultado);
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const { email, senha } = req.body;
    const resultado = await authService.login({ email, senha });
    gravarCookiesLogin(res, resultado);
    res.json(resultado);
  } catch (err) { next(err); }
}

export async function logout(req, res, next) {
  try {
    res.clearCookie('token', cookieOptions);
    res.clearCookie('logado', {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    res.json({ mensagem: 'Logout realizado com sucesso.' });
  } catch (err) { next(err); }
}

export async function perfil(req, res, next) {
  try {
    const usuario = await authService.obterPerfil(req.usuario.id);
    res.json(usuario);
  } catch (err) { next(err); }
}

export async function atualizarPerfil(req, res, next) {
  try {
    let avatar = req.body.avatar;
    if (req.file) {
      const { uploadArquivo } = await import('../config/supabase.js');
      const path = `avatares/${req.usuario.id}-${Date.now()}.${req.file.originalname.split('.').pop()}`;
      avatar = await uploadArquivo(req.file.buffer, path, req.file.mimetype);
    }
    const usuario = await authService.atualizarPerfil(req.usuario.id, { ...req.body, avatar });
    res.json(usuario);
  } catch (err) { next(err); }
}

export async function alterarSenha(req, res, next) {
  try {
    const resultado = await authService.alterarSenha(req.usuario.id, req.body);
    res.json(resultado);
  } catch (err) { next(err); }
}
