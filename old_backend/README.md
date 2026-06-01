# Catálogo de Filmes e Séries — Backend

## 🚀 Como executar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Edite o .env com suas credenciais
```

### 3. Gerar cliente Prisma
```bash
npm run prisma:generate
```

### 4. Criar o banco de dados (migrations)
```bash
npm run prisma:migrate
```

### 5. Popular banco com dados iniciais
```bash
npm run prisma:seed
```

### 6. Iniciar o servidor
```bash
npm run dev
```

## 📡 Endpoints da API

### Autenticação
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/api/auth/cadastrar` | Cadastro de usuário | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/perfil` | Ver perfil | ✅ |
| PUT | `/api/auth/perfil` | Atualizar perfil | ✅ |
| PUT | `/api/auth/senha` | Alterar senha | ✅ |

### Filmes
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/filmes` | Listar filmes | ❌ |
| GET | `/api/filmes/:id` | Buscar filme | ❌ |
| POST | `/api/filmes` | Criar filme | ✅ |
| PUT | `/api/filmes/:id` | Atualizar filme | ✅ |
| DELETE | `/api/filmes/:id` | Remover filme | ✅ |

### Séries
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/series` | Listar séries | ❌ |
| GET | `/api/series/:id` | Buscar série | ❌ |
| POST | `/api/series` | Criar série | ✅ |
| PUT | `/api/series/:id` | Atualizar série | ✅ |
| DELETE | `/api/series/:id` | Remover série | ✅ |

### Avaliações
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/avaliacoes?conteudoId=&tipo=` | Listar avaliações | ❌ |
| POST | `/api/avaliacoes` | Criar avaliação | ✅ |
| PUT | `/api/avaliacoes/:id` | Editar avaliação | ✅ |
| DELETE | `/api/avaliacoes/:id` | Remover avaliação | ✅ |
| POST | `/api/avaliacoes/:id/curtir` | Curtir avaliação | ✅ |

### Listas
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/listas` | Minhas listas | ✅ |
| GET | `/api/listas/favoritos` | Meus favoritos | ✅ |
| GET | `/api/listas/:id` | Ver lista | ✅ |
| POST | `/api/listas` | Criar lista | ✅ |
| DELETE | `/api/listas/:id` | Remover lista | ✅ |
| POST | `/api/listas/:id/itens` | Adicionar item | ✅ |
| PUT | `/api/listas/:id/itens/:itemId` | Atualizar item | ✅ |
| DELETE | `/api/listas/:id/itens/:itemId` | Remover item | ✅ |

### Recomendações
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/recomendacoes` | Recomendações personalizadas | ✅ |
| GET | `/api/recomendacoes/trending` | Títulos em alta | ❌ |

## 🔑 Autenticação
Inclua o header `Authorization: Bearer <token>` nas rotas protegidas.
