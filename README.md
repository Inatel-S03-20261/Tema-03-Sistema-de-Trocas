# Tema-03 — Sistema de Trocas

API REST para troca de cartas, construída com NestJS + Prisma + PostgreSQL.

## Pré-requisitos

- Node.js 20+
- pnpm 10+
- Docker e Docker Compose

## Estrutura

```
.
├── docker-compose.yml       # banco PostgreSQL
└── app/
    ├── infra/prisma/        # schema e migrations
    └── src/                 # código-fonte NestJS
```

## Como rodar

### 1. Instale as dependências

```bash
pnpm install
```

### 2. Suba o banco de dados

```bash
docker compose up -d
```

Inicia um PostgreSQL na porta `5432`.

### 3. Configure as variáveis de ambiente

Crie o arquivo `app/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
```

### 4. Execute as migrations e gere o Prisma Client

```bash
pnpm migrate:dev
pnpm db:generate
```

### 5. Inicie a aplicação

```bash
# desenvolvimento (watch mode)
pnpm dev:api
```

A API estará disponível em `http://localhost:3000`.
A documentação Swagger estará em `http://localhost:3000/docs`.

## Scripts disponíveis

Todos os scripts abaixo rodam a partir da raiz do monorepo.

| Script | Descrição |
|---|---|
| `pnpm dev:api` | Inicia a API em modo watch |
| `pnpm build` | Compila a aplicação |
| `pnpm test` | Roda os testes unitários |
| `pnpm migrate:dev` | Cria e aplica migration em dev |
| `pnpm migrate:deploy` | Aplica migrations em produção |
| `pnpm db:generate` | Gera o Prisma Client |
| `pnpm db:studio` | Abre o Prisma Studio |
