// =============================================================
// MIDDLEWARE: Tratamento Global de Erros
// Critério 3 (Entrega 2): Resiliência no fluxo da aplicação
//
// Este middleware intercepta QUALQUER erro que escape dos controllers
// (via next(err)) e transforma em uma resposta JSON padronizada,
// garantindo que o sistema web NUNCA trave e sempre retorne uma
// mensagem de erro compreensível para o frontend.
// =============================================================

/*
  HANDLER GLOBAL DE ERROS:
  Analisa a mensagem do erro para decidir o código HTTP adequado:
  - 400 (Bad Request): erros de validação ('inválido', 'obrigatório', 'já cadastrado')
  - 404 (Not Found): registros não encontrados ('não encontrado')
  - 409 (Conflict): dados duplicados ('duplicado', 'já avaliou')
  - 500 (Internal Server Error): qualquer outro erro inesperado
*/
export function errorHandler(err, req, res, next) {
  console.error('❌ Erro capturado pelo middleware:', err.message);

  // Erros de validação dos modelos (Critério 2)
  if (err.message?.includes('inválido') || err.message?.includes('obrigatório')) {
    return res.status(400).json({ sucesso: false, erro: err.message });
  }

  // Registros não encontrados
  if (err.message?.includes('não encontrado') || err.message?.includes('não encontrada')) {
    return res.status(404).json({ sucesso: false, erro: err.message });
  }

  // Conflitos (duplicação)
  if (err.message?.includes('já cadastrado') || err.message?.includes('já avaliou') || err.message?.includes('já está na lista')) {
    return res.status(409).json({ sucesso: false, erro: err.message });
  }

  // Erro genérico (protege informações sensíveis em produção)
  return res.status(500).json({
    sucesso: false,
    erro: 'Erro interno do servidor.',
  });
}

/*
  HANDLER DE ROTA NÃO ENCONTRADA:
  Captura requisições para rotas que não existem na aplicação.
*/
export function notFound(req, res) {
  res.status(404).json({
    sucesso: false,
    erro: `Rota '${req.originalUrl}' não encontrada.`,
  });
}
