import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import prisma from './src/config/database.js';

const PORT = process.env.PORT || 3001;

async function iniciar() {
  try {
    await prisma.$connect();
    console.log('✅ Banco de dados conectado!');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📡 API disponível em http://localhost:${PORT}/api`);
      console.log(`🏥 Health check em http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('❌ Erro ao iniciar o servidor:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

iniciar();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Encerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});
