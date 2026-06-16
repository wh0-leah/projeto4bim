export function errorHandler(err, req, res, next) {
  console.error(' Erro:', err.message);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ erro: err.message });
  }

  if (err.code === 'P2002') {
    
    return res.status(409).json({ erro: 'Registro duplicado. Verifique os dados informados.' });
  }

  if (err.code === 'P2025') {
    
    return res.status(404).json({ erro: 'Registro não encontrado.' });
  }

  if (err.message?.includes('não encontrado') || err.message?.includes('not found')) {
    return res.status(404).json({ erro: err.message });
  }

  if (err.message?.includes('inválido') || err.message?.includes('obrigatório')) {
    return res.status(400).json({ erro: err.message });
  }

  return res.status(500).json({
    erro: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor.',
  });
}

export function notFound(req, res) {
  res.status(404).json({ erro: `Rota '${req.originalUrl}' não encontrada.` });
}
