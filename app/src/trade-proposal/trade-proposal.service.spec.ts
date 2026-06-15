import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { TradeProposalService } from './trade-proposal.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTradeProposalDto } from './dto/create-trade-proposal.dto';
import { UpdateTradeProposalDto } from './dto/update-trade-proposal.dto';
import { ProposalStatus, TradeStatus } from '@prisma/client';

type ProposalItemRecord = {
  id: string;
  proposalId: string;
  cardId: string;
  quantity: number;
};

type TradeProposalRecord = {
  id: string;
  tradeId: string;
  proposerId: string;
  message: string | null;
  status: ProposalStatus;
  createdAt: Date;
  updatedAt: Date;
  offeredCards: ProposalItemRecord[];
};

type TradeRecord = {
  id: string;
  status: TradeStatus;
};

class InMemoryTradeProposalRepository {
  proposals: TradeProposalRecord[] = [];
  trades: TradeRecord[] = [];
  private idCounter = 0;

  private nextId(): string {
    this.idCounter += 1;
    return `proposal-${this.idCounter}`;
  }

  addTrade(trade: TradeRecord): void {
    this.trades.push(trade);
  }

  create(args: {
    data: {
      tradeId: string;
      proposerId: string;
      message: string | null;
      status: ProposalStatus;
      offeredCards: { create: { cardId: string; quantity: number }[] };
    };
  }): TradeProposalRecord {
    const id = this.nextId();
    const now = new Date();
    const proposal: TradeProposalRecord = {
      id,
      tradeId: args.data.tradeId,
      proposerId: args.data.proposerId,
      message: args.data.message,
      status: args.data.status,
      createdAt: now,
      updatedAt: now,
      offeredCards: args.data.offeredCards.create.map((item, index) => ({
        id: `item-${id}-${index}`,
        proposalId: id,
        cardId: item.cardId,
        quantity: item.quantity,
      })),
    };
    this.proposals.push(proposal);
    return proposal;
  }

  findUnique(args: { where: { id: string } }): TradeProposalRecord | null {
    return (
      this.proposals.find((proposal) => proposal.id === args.where.id) ?? null
    );
  }

  findMany(args: { where?: { tradeId?: string } }): TradeProposalRecord[] {
    if (args.where?.tradeId) {
      return this.proposals.filter(
        (proposal) => proposal.tradeId === args.where!.tradeId,
      );
    }
    return [...this.proposals];
  }

  update(args: {
    where: { id: string };
    data: { status: ProposalStatus };
  }): TradeProposalRecord {
    const proposal = this.findUnique({ where: { id: args.where.id } });
    if (!proposal) {
      throw new Error('Proposal not found');
    }
    proposal.status = args.data.status;
    proposal.updatedAt = new Date();
    return proposal;
  }

  updateMany(args: {
    where: { tradeId: string; id: { not: string }; status: ProposalStatus };
    data: { status: ProposalStatus };
  }): { count: number } {
    let count = 0;
    for (const proposal of this.proposals) {
      if (
        proposal.tradeId === args.where.tradeId &&
        proposal.id !== args.where.id.not &&
        proposal.status === args.where.status
      ) {
        proposal.status = args.data.status;
        proposal.updatedAt = new Date();
        count += 1;
      }
    }
    return { count };
  }

  delete(args: { where: { id: string } }): TradeProposalRecord {
    const index = this.proposals.findIndex(
      (proposal) => proposal.id === args.where.id,
    );
    if (index === -1) {
      throw new Error('Proposal not found');
    }
    const [removed] = this.proposals.splice(index, 1);
    return removed;
  }

  tradeUpdate(args: {
    where: { id: string };
    data: { status: TradeStatus };
  }): TradeRecord {
    const trade = this.trades.find((t) => t.id === args.where.id);
    if (!trade) {
      throw new Error('Trade not found');
    }
    trade.status = args.data.status;
    return trade;
  }

  clear(): void {
    this.proposals = [];
    this.trades = [];
    this.idCounter = 0;
  }
}

describe('TradeProposalService', () => {
  let service: TradeProposalService;
  let inMemoryRepo: InMemoryTradeProposalRepository;
  let prismaServiceMock: {
    tradeProposal: {
      create: jest.Mock;
      findUnique: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
      delete: jest.Mock;
    };
    trade: {
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    inMemoryRepo = new InMemoryTradeProposalRepository();

    prismaServiceMock = {
      tradeProposal: {
        create: jest
          .fn()
          .mockImplementation((args) => inMemoryRepo.create(args)),
        findUnique: jest
          .fn()
          .mockImplementation((args) => inMemoryRepo.findUnique(args)),
        findMany: jest
          .fn()
          .mockImplementation((args) => inMemoryRepo.findMany(args)),
        update: jest
          .fn()
          .mockImplementation((args) => inMemoryRepo.update(args)),
        updateMany: jest
          .fn()
          .mockImplementation((args) => inMemoryRepo.updateMany(args)),
        delete: jest
          .fn()
          .mockImplementation((args) => inMemoryRepo.delete(args)),
      },
      trade: {
        update: jest
          .fn()
          .mockImplementation((args) => inMemoryRepo.tradeUpdate(args)),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TradeProposalService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<TradeProposalService>(TradeProposalService);
  });

  afterEach(() => {
    inMemoryRepo.clear();
    jest.clearAllMocks();
  });

  describe('create', () => {
    const dto: CreateTradeProposalDto = {
      tradeId: 'trade-1',
      proposerId: 'ash-ketchum',
      message: 'Tenho interesse nas suas cartas raras!',
      offeredCards: [{ cardId: 'card-1', quantity: 2 }],
    };

    describe('fluxo normal', () => {
      it('should create a trade proposal with provided data', async () => {
        const result = await service.create(dto);

        expect(result).toBeDefined();
        expect(result.id).toBeDefined();
        expect(result.tradeId).toBe(dto.tradeId);
        expect(result.proposerId).toBe(dto.proposerId);
        expect(result.message).toBe(dto.message);
      });

      it('should create the proposal with PENDING status and offered cards', async () => {
        const result = await service.create(dto);

        expect(result.status).toBe(ProposalStatus.PENDING);
        expect(result.offeredCards).toHaveLength(1);
        expect(result.offeredCards[0].cardId).toBe('card-1');
        expect(result.offeredCards[0].quantity).toBe(2);
      });
    });

    describe('fluxo de extensão', () => {
      it('should call prisma.tradeProposal.create with correct structure', async () => {
        await service.create(dto);

        expect(prismaServiceMock.tradeProposal.create).toHaveBeenCalledTimes(1);
        expect(prismaServiceMock.tradeProposal.create).toHaveBeenCalledWith({
          data: {
            tradeId: dto.tradeId,
            proposerId: dto.proposerId,
            message: dto.message,
            status: ProposalStatus.PENDING,
            offeredCards: { create: dto.offeredCards },
          },
          include: { offeredCards: true },
        });
      });

      it('should default message to null when not provided', async () => {
        const { message, ...dtoWithoutMessage } = dto;
        void message;

        const result = await service.create(dtoWithoutMessage);

        expect(result.message).toBeNull();
      });
    });
  });

  describe('findOne', () => {
    describe('fluxo normal', () => {
      it('should return the proposal when it exists', async () => {
        const created = await service.create({
          tradeId: 'trade-1',
          proposerId: 'ash-ketchum',
          offeredCards: [],
        });

        const result = await service.findOne(created.id);

        expect(result).toBeDefined();
        expect(result.id).toBe(created.id);
        expect(result.tradeId).toBe('trade-1');
      });

      it('should include offered cards in the response', async () => {
        const created = await service.create({
          tradeId: 'trade-1',
          proposerId: 'ash-ketchum',
          offeredCards: [{ cardId: 'card-1', quantity: 1 }],
        });

        const result = await service.findOne(created.id);

        expect(result.offeredCards).toHaveLength(1);
      });
    });

    describe('fluxo de extensão', () => {
      it('should call prisma.tradeProposal.findUnique with correct structure', async () => {
        const created = await service.create({
          tradeId: 'trade-1',
          proposerId: 'ash-ketchum',
          offeredCards: [],
        });
        jest.clearAllMocks();

        await service.findOne(created.id);

        expect(
          prismaServiceMock.tradeProposal.findUnique,
        ).toHaveBeenCalledTimes(1);
        expect(prismaServiceMock.tradeProposal.findUnique).toHaveBeenCalledWith(
          {
            where: { id: created.id },
            include: { offeredCards: true },
          },
        );
      });

      it('should throw NotFoundException when proposal does not exist', async () => {
        await expect(service.findOne('id-inexistente')).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });

  describe('findAll', () => {
    describe('fluxo normal', () => {
      it('should return an empty array when there are no proposals', async () => {
        const result = await service.findAll();

        expect(result).toEqual([]);
      });

      it('should return all created proposals', async () => {
        await service.create({
          tradeId: 'trade-1',
          proposerId: 'ash-ketchum',
          offeredCards: [],
        });
        await service.create({
          tradeId: 'trade-2',
          proposerId: 'misty',
          offeredCards: [],
        });

        const result = await service.findAll();

        expect(result).toHaveLength(2);
      });
    });

    describe('fluxo de extensão', () => {
      it('should call prisma.tradeProposal.findMany with correct structure', async () => {
        await service.findAll();

        expect(prismaServiceMock.tradeProposal.findMany).toHaveBeenCalledTimes(
          1,
        );
        expect(prismaServiceMock.tradeProposal.findMany).toHaveBeenCalledWith({
          where: undefined,
          include: { offeredCards: true },
        });
      });

      it('should filter by tradeId when provided', async () => {
        await service.create({
          tradeId: 'trade-1',
          proposerId: 'ash-ketchum',
          offeredCards: [],
        });
        await service.create({
          tradeId: 'trade-2',
          proposerId: 'misty',
          offeredCards: [],
        });

        const result = await service.findAll('trade-1');

        expect(result).toHaveLength(1);
        expect(result[0].tradeId).toBe('trade-1');
      });
    });
  });

  describe('update', () => {
    describe('fluxo normal', () => {
      it('should accept a PENDING proposal', async () => {
        const created = await service.create({
          tradeId: 'trade-1',
          proposerId: 'ash-ketchum',
          offeredCards: [],
        });
        inMemoryRepo.addTrade({ id: 'trade-1', status: TradeStatus.OPEN });

        const dto: UpdateTradeProposalDto = { status: ProposalStatus.ACCEPTED };
        const result = await service.update(created.id, dto);

        expect(result.status).toBe(ProposalStatus.ACCEPTED);
      });

      it('should reject a PENDING proposal', async () => {
        const created = await service.create({
          tradeId: 'trade-1',
          proposerId: 'ash-ketchum',
          offeredCards: [],
        });

        const dto: UpdateTradeProposalDto = { status: ProposalStatus.REJECTED };
        const result = await service.update(created.id, dto);

        expect(result.status).toBe(ProposalStatus.REJECTED);
      });
    });

    describe('fluxo de extensão', () => {
      it('should throw NotFoundException when proposal does not exist', async () => {
        const dto: UpdateTradeProposalDto = { status: ProposalStatus.ACCEPTED };

        await expect(service.update('id-inexistente', dto)).rejects.toThrow(
          NotFoundException,
        );
      });

      it('should throw ConflictException when accepting a non-PENDING proposal', async () => {
        const created = await service.create({
          tradeId: 'trade-1',
          proposerId: 'ash-ketchum',
          offeredCards: [],
        });
        await service.update(created.id, { status: ProposalStatus.REJECTED });

        await expect(
          service.update(created.id, { status: ProposalStatus.ACCEPTED }),
        ).rejects.toThrow(ConflictException);
      });

      it('should cancel other PENDING proposals and conclude the trade when one is accepted', async () => {
        const accepted = await service.create({
          tradeId: 'trade-1',
          proposerId: 'ash-ketchum',
          offeredCards: [],
        });
        const other = await service.create({
          tradeId: 'trade-1',
          proposerId: 'misty',
          offeredCards: [],
        });
        inMemoryRepo.addTrade({ id: 'trade-1', status: TradeStatus.OPEN });

        await service.update(accepted.id, { status: ProposalStatus.ACCEPTED });

        const otherProposal = await service.findOne(other.id);
        expect(otherProposal.status).toBe(ProposalStatus.CANCELLED);
        expect(prismaServiceMock.trade.update).toHaveBeenCalledWith({
          where: { id: 'trade-1' },
          data: { status: TradeStatus.CONCLUDED },
        });
      });

      it('should not call prisma.tradeProposal.update when proposal does not exist', async () => {
        await service
          .update('id-inexistente', { status: ProposalStatus.ACCEPTED })
          .catch(() => {});

        expect(prismaServiceMock.tradeProposal.update).not.toHaveBeenCalled();
      });
    });
  });

  describe('delete', () => {
    describe('fluxo normal', () => {
      it('should remove an existing proposal', async () => {
        const created = await service.create({
          tradeId: 'trade-1',
          proposerId: 'ash-ketchum',
          offeredCards: [],
        });

        await service.delete(created.id);

        await expect(service.findOne(created.id)).rejects.toThrow(
          NotFoundException,
        );
      });

      it('should resolve to undefined on success', async () => {
        const created = await service.create({
          tradeId: 'trade-1',
          proposerId: 'ash-ketchum',
          offeredCards: [],
        });

        const result = await service.delete(created.id);

        expect(result).toBeUndefined();
      });
    });

    describe('fluxo de extensão', () => {
      it('should throw NotFoundException when proposal does not exist', async () => {
        await expect(service.delete('id-inexistente')).rejects.toThrow(
          NotFoundException,
        );
      });

      it('should call prisma.tradeProposal.delete with correct structure', async () => {
        const created = await service.create({
          tradeId: 'trade-1',
          proposerId: 'ash-ketchum',
          offeredCards: [],
        });
        jest.clearAllMocks();

        await service.delete(created.id);

        expect(prismaServiceMock.tradeProposal.delete).toHaveBeenCalledTimes(1);
        expect(prismaServiceMock.tradeProposal.delete).toHaveBeenCalledWith({
          where: { id: created.id },
        });
      });
    });
  });
});
