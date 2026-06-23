# Tema-03 — Sistema de Trocas

## Visão Geral

O Sistema de Trocas é uma API REST para gerenciamento de trocas de cartas colecionáveis. A aplicação foi construída com NestJS, Prisma e PostgreSQL, e evoluiu ao longo de versões incorporando padrões de design que melhoram a organização, manutenibilidade e extensibilidade do código. A versão atual integra mensageria assíncrona via RabbitMQ para publicação de eventos de troca concluída.

## Principais Funcionalidades

- Criação e gerenciamento de trocas de cartas
- Propostas de troca com controle de estado
- Lista de desejos (wishlist) com suporte a itens específicos e filtros por tipo/raridade
- Publicação de eventos de troca concluída via RabbitMQ
- Documentação automática via Swagger

## Arquitetura

### Componentes

1. **API NestJS**: Aplicação principal com módulos organizados por domínio
2. **PostgreSQL**: Banco de dados relacional gerenciado via Prisma
3. **RabbitMQ**: Broker de mensagens para eventos assíncronos

### Estrutura de Módulos

```
app/src/
├── modules/
│   ├── trade-proposal/         # Propostas de troca
│   │   ├── domain/
│   │   │   ├── states/         # State Pattern
│   │   │   ├── proposal-state.ts
│   │   │   ├── proposal-state.factory.ts
│   │   │   └── trade-proposal.entity.ts
│   │   ├── dto/
│   │   ├── trade-proposal.controller.ts
│   │   ├── trade-proposal.repository.ts
│   │   └── trade-proposal.service.ts
│   ├── trades/                 # Trocas
│   │   ├── dto/
│   │   ├── repositories/       # Adapter Pattern (GoF)
│   │   ├── trades.controller.ts
│   │   ├── trades.repository.ts
│   │   └── trades.service.ts
│   └── wishlist/               # Lista de desejos
│       ├── dto/
│       ├── interfaces/
│       ├── strategies/         # Strategy + Factory Method Pattern
│       ├── wishlist.controller.ts
│       ├── wishlist.repository.ts
│       └── wishlist.service.ts
├── providers/
│   ├── database/               # Prisma + PostgreSQL
│   ├── events/                 # Event Bus interno
│   └── messaging/              # RabbitMQ
└── common/
    └── dto/                    # DTOs compartilhados
```

## Padrões de Design Implementados

### 1. State Pattern
**Localização**: `modules/trade-proposal/domain/`

Controla as transições de estado de uma proposta de troca, bloqueando operações inválidas conforme o status atual.

**Estados**: `PENDING` → `ACCEPTED` | `REJECTED` | `CANCELLED`

```typescript
// Transição válida: estado PENDING pode ser aceito
const entity = new TradeProposalEntity(ProposalStatus.PENDING);
entity.accept(); // ProposalStatus.ACCEPTED

// Transição inválida: estado ACCEPTED não pode ser cancelado
const entity = new TradeProposalEntity(ProposalStatus.ACCEPTED);
entity.cancel(); // throws ConflictException
```

**Benefícios**:
- Centraliza as regras de transição de estado
- Elimina condicionais espalhadas pelo serviço
- Erros de transição inválida são lançados com mensagem descritiva

### 2. Factory Method Pattern
**Localização**: `modules/trade-proposal/domain/proposal-state.factory.ts` e `modules/wishlist/strategies/wishlist-item.factory.ts`

Encapsula a criação de objetos de estado e de itens da wishlist, centralizando a lógica de instanciação.

```typescript
// Criação de estado a partir do status persistido
const state = ProposalStateFactory.create(ProposalStatus.PENDING);

// Criação de item de wishlist a partir do DTO
const item = WishlistItemFactory.create({ itemType: WishlistItemType.SPECIFIC_CARD, cardId: 'abc' });
```

**Benefícios**:
- Desacopla a criação do uso
- Centraliza validações de criação (ex: `cardId` obrigatório para `SPECIFIC_CARD`)
- Facilita adição de novos tipos sem alterar o código cliente

### 3. Strategy Pattern
**Localização**: `modules/wishlist/strategies/`

Define uma interface comum para diferentes tipos de item da wishlist (`SpecificCardItem` e `FilterItem`), permitindo que o serviço trate ambos de forma uniforme.

```typescript
// Ambas as classes implementam IWishlistItem
const specificCard = new SpecificCardItem('card-id-123');
specificCard.matches('card-id-123'); // true

const filter = new FilterItem('FIRE', 'RARE');
filter.matches('any-card-id'); // true (matching por tipo/raridade requer objeto Card)
```

**Benefícios**:
- Interface uniforme independente do tipo de item
- Fácil extensão com novos tipos de item
- Separação clara entre lógica de matching e lógica de persistência

### 4. Adapter Pattern (GoF)
**Localização**: `modules/trades/`

Aplicado na entidade de **Trocas**. O `TradesRepository` atua como **Adapter**: ele converte a interface do Prisma (`DatabaseService`, que estende `PrismaClient`) na interface orientada ao domínio esperada pelo `TradesService`. Assim, o serviço de negócio nunca conhece o Prisma — ele conversa apenas com o contrato `create` / `findById` / `cancel`, e o adapter traduz cada chamada para o cliente de persistência.

**Papéis do padrão (GoF)**:

| Papel | Implementação |
|---|---|
| **Client** (usa a interface esperada) | `TradesService` |
| **Target** (interface esperada pelo cliente) | contrato `ITradeRepository` (`TRADE_REPOSITORY`) |
| **Adapter** (converte a chamada) | `TradesRepository` |
| **Adaptee** (interface incompatível/externa) | `DatabaseService` / Prisma Client |

```typescript
// O serviço fala a interface do domínio (Target)...
await this.tradesRepository.cancel(id);

// ...e o Adapter (TradesRepository) traduz para a interface do Prisma (Adaptee)
this.db.trade.update({ where: { id }, data: { status: TradeStatus.CANCELLED } });
this.db.tradeProposal.updateMany({
  where: { tradeId: id, status: ProposalStatus.PENDING },
  data: { status: ProposalStatus.CANCELLED },
});
```

**Benefícios**:
- Desacopla o domínio da tecnologia de persistência: o serviço não depende diretamente do Prisma
- Permite trocar o "adaptee" (outro ORM/banco) sem alterar o `TradesService`
- Concentra no adapter a tradução entre o vocabulário do domínio e a API do Prisma (incluindo operações transacionais)

## Pré-requisitos

- Node.js 20+
- pnpm 10+
- Docker e Docker Compose

## Como rodar

### 1. Instale as dependências

```bash
pnpm install
```

### 2. Suba a infraestrutura

```bash
docker compose up -d
```

Inicia PostgreSQL na porta `5432` e RabbitMQ nas portas `5672` (AMQP) e `15672` (management UI).

### 3. Configure as variáveis de ambiente

Crie o arquivo `app/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
RABBITMQ_URL="amqp://guest:guest@localhost:5672"
```

### 4. Execute as migrations e gere o Prisma Client

```bash
pnpm migrate:dev
pnpm db:generate
```

### 5. Inicie a aplicação

```bash
pnpm dev:api
```

A API estará disponível em `http://localhost:3000`.
A documentação Swagger estará em `http://localhost:3000/docs`.
O painel do RabbitMQ estará em `http://localhost:15672` (guest/guest).

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

## Módulos da API

### Trades
Gerencia as trocas abertas por usuários.

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/trades` | Cria uma nova troca |
| `GET` | `/trades` | Lista todas as trocas |
| `GET` | `/trades/:id` | Busca uma troca por ID |
| `DELETE` | `/trades/:id` | Remove uma troca |

### Trade Proposals
Gerencia propostas de troca, com controle de estado via State Pattern.

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/trade-proposals` | Cria uma proposta |
| `GET` | `/trade-proposals` | Lista propostas (filtra por `proposerId`) |
| `GET` | `/trade-proposals/:id` | Busca uma proposta por ID |
| `PATCH` | `/trade-proposals/:id` | Atualiza status (rejeitar/cancelar) |
| `PATCH` | `/trade-proposals/:id/accept` | Aceita a proposta e publica evento |
| `DELETE` | `/trade-proposals/:id` | Remove uma proposta |

### Wishlist
Gerencia listas de desejos por usuário, com suporte a itens específicos e filtros.

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/wishlist` | Cria ou atualiza wishlist |
| `GET` | `/wishlist/:userId` | Busca wishlist por usuário |
| `PATCH` | `/wishlist/:userId` | Atualiza itens da wishlist |
| `DELETE` | `/wishlist/:userId` | Remove a wishlist |

## Eventos Assíncronos

Quando uma proposta é aceita, o sistema publica um evento `trade_completed` na fila `trade_events` do RabbitMQ com o seguinte payload:

```json
{
  "tradeId": "uuid",
  "ownerId": "uuid",
  "proposerId": "uuid",
  "offeredByOwner": [{ "cardId": "uuid", "quantity": 1 }],
  "offeredByProposer": [{ "cardId": "uuid", "quantity": 1 }]
}
```

## Stack

- **Runtime**: Node.js 20 + TypeScript
- **Framework**: NestJS 11
- **ORM**: Prisma 7 + PostgreSQL 16
- **Mensageria**: RabbitMQ 4 via `@nestjs/microservices` + `amqplib`
- **Documentação**: Swagger (`@nestjs/swagger`)
- **Testes**: Jest + Supertest
- **Gerenciador de pacotes**: pnpm 10 (monorepo)
