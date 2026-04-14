# Tema-03 — API de troca de cartas

API REST construída com NestJS + Prisma + PostgreSQL.

## Pré-requisitos

- Node.js 20+
- npm
- Docker e Docker Compose

## Estrutura

```
.
├── docker-compose.yml   # banco PostgreSQL
└── app/                 # aplicação NestJS
    ├── prisma/          # schema e migrations
    └── src/             # código-fonte
```

## Como rodar

### 1. Suba o banco de dados

```bash
docker compose up -d
```

Isso inicia um PostgreSQL na porta `5430`.

### 2. Configure as variáveis de ambiente

Crie o arquivo `app/.env` com o conteúdo abaixo (já está no repo para dev local):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5430/postgres"
```

### 3. Instale as dependências

```bash
cd app
npm install
```

### 4. Execute as migrations e gere o Prisma Client

```bash
npm run migrate:dev
npm run db:generate
```

### 5. Inicie a aplicação

```bash
# desenvolvimento (watch mode)
npm run start:dev

# produção
npm run build
npm run start:prod
```

A API estará disponível em `http://localhost:3000`.

## Scripts disponíveis

| Script | Descrição |
|---|---|
| `start:dev` | Inicia em modo watch |
| `start:prod` | Inicia o build compilado |
| `migrate:dev` | Cria e aplica migration em dev |
| `migrate:deploy` | Aplica migrations em produção |
| `db:generate` | Gera o Prisma Client |
| `db:studio` | Abre o Prisma Studio |
| `test` | Roda os testes unitários |
| `test:e2e` | Roda os testes end-to-end |
| `test:cov` | Gera relatório de cobertura |
