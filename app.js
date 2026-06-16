import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './src/routes/authRoutes.js';
import filmeRoutes from './src/routes/filmeRoutes.js';
import serieRoutes from './src/routes/serieRoutes.js';
import avaliacaoRoutes from './src/routes/avaliacaoRoutes.js';
import listaRoutes from './src/routes/listaRoutes.js';
import recomendacaoRoutes from './src/routes/recomendacaoRoutes.js';
import * as filmeController from './src/controllers/filmeController.js';
import { autenticar } from './src/middlewares/authMiddleware.js';
import { errorHandler, notFound } from './src/middlewares/errorMiddleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.use(cors({
  origin: (origin, callback) => {
    
    if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:') || origin === 'null') {
      callback(null, true);
    } else {
      callback(null, process.env.FRONTEND_URL || 'http://localhost:5173');
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), versao: '1.0.0' });
});

app.delete('/excluirNomeCadastro', autenticar, filmeController.excluirNomeCadastro);


app.use('/api/auth', authRoutes);
app.use('/api/filmes', filmeRoutes);
app.use('/api/series', serieRoutes);
app.use('/api/avaliacoes', avaliacaoRoutes);
app.use('/api/listas', listaRoutes);
app.use('/api/recomendacoes', recomendacaoRoutes);


app.use(notFound);
app.use(errorHandler);

export default app;
