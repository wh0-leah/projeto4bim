// =============================================================
// CONTROLLER: UsuarioController
// Critério 3 (Entrega 2): Resiliência no fluxo da aplicação
// Uso de try/catch para capturar erros dos modelos e repositórios,
// permitindo reenviar a mensagem precisa de erro para a tela.
// =============================================================

import { Usuario, UsuarioComum, UsuarioAdmin } from '../models/index.js';
import { UsuarioRepository } from '../../tests/index.js';

/*
  CADASTRAR USUÁRIO:
  Recebe os dados do formulário via req.body, instancia o modelo OOP (que valida
  e-mail, nome, senha via setters) e salva no repositório. Se qualquer validação
  falhar, o catch captura o erro e devolve a mensagem exata para o frontend.
*/
export async function cadastrar(req, res, next) {
  try {
    const { id, nome, email, senhaHash, role } = req.body;

    // Usa herança/polimorfismo: cria UsuarioAdmin ou UsuarioComum conforme o role
    let usuario;
    if (role === 'ADMIN') {
      usuario = new UsuarioAdmin({ id, nome, email, senhaHash });
    } else {
      usuario = new UsuarioComum({ id, nome, email, senhaHash });
    }

    // O repositório também valida (ex: e-mail duplicado) e pode lançar erro
    const salvo = UsuarioRepository.adicionar(usuario);
    res.status(201).json({ sucesso: true, dados: salvo.toJSON() });
  } catch (err) {
    // Captura erros de validação do modelo (ex: 'E-mail inválido.') ou do repositório
    // (ex: 'E-mail já cadastrado.') e envia a mensagem precisa para a tela
    res.status(400).json({ sucesso: false, erro: err.message });
  }
}

/*
  LISTAR USUÁRIOS ATIVOS:
  Retorna todos os usuários cadastrados com informações públicas.
  O try/catch garante que qualquer falha inesperada não trave o servidor.
*/
export async function listar(req, res, next) {
  try {
    const usuarios = UsuarioRepository.listarAtivos();
    res.json({ sucesso: true, dados: usuarios });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}

/*
  BUSCAR USUÁRIO POR ID:
  Procura um usuário específico. Se não existir, lança erro controlado.
*/
export async function buscarPorId(req, res, next) {
  try {
    const usuario = UsuarioRepository.buscarPorId(req.params.id);
    if (!usuario) throw new Error('Usuário não encontrado.');
    res.json({ sucesso: true, dados: usuario.toJSON() });
  } catch (err) {
    const status = err.message.includes('não encontrado') ? 404 : 500;
    res.status(status).json({ sucesso: false, erro: err.message });
  }
}

/*
  BUSCAR USUÁRIO POR E-MAIL:
  Faz uma busca pelo e-mail (case-insensitive). Se não encontrar, retorna erro 404.
*/
export async function buscarPorEmail(req, res, next) {
  try {
    const { email } = req.query;
    if (!email) throw new Error('Parâmetro "email" é obrigatório.');
    const usuario = UsuarioRepository.buscarPorEmail(email);
    if (!usuario) throw new Error('Usuário não encontrado.');
    res.json({ sucesso: true, dados: usuario.toJSON() });
  } catch (err) {
    const status = err.message.includes('não encontrado') ? 404 : 400;
    res.status(status).json({ sucesso: false, erro: err.message });
  }
}
