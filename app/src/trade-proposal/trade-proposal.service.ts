import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTradeProposalDto } from './dto/create-trade-proposal.dto';
import { UpdateTradeProposalDto } from './dto/update-trade-proposal.dto';
import {
  ProposalStatus,
  TradeStatus,
  TradeProposal,
  ProposalItem,
} from '@prisma/client';
import { TradeProposalEntity } from './domain/trade-proposal.entity';

type TradeProposalWithItems = TradeProposal & { offeredCards: ProposalItem[] };

@Injectable()
export class TradeProposalService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createTradeProposalDto: CreateTradeProposalDto,
  ): Promise<TradeProposalWithItems> {
    const { tradeId, proposerId, message, offeredCards } =
      createTradeProposalDto;

    return this.prisma.tradeProposal.create({
      data: {
        tradeId,
        proposerId,
        message: message ?? null,
        status: ProposalStatus.PENDING,
        offeredCards: {
          create: offeredCards ?? [],
        },
      },
      include: { offeredCards: true },
    });
  }

  async findOne(id: string): Promise<TradeProposalWithItems> {
    const proposal = await this.prisma.tradeProposal.findUnique({
      where: { id },
      include: { offeredCards: true },
    });
    if (!proposal) {
      throw new NotFoundException(
        `TradeProposal com id "${id}" não encontrado`,
      );
    }
    return proposal;
  }

  async findAll(tradeId?: string): Promise<TradeProposalWithItems[]> {
    return this.prisma.tradeProposal.findMany({
      where: tradeId ? { tradeId } : undefined,
      include: { offeredCards: true },
    });
  }

  async update(
    id: string,
    dto: UpdateTradeProposalDto,
  ): Promise<TradeProposalWithItems> {
    const existing = await this.prisma.tradeProposal.findUnique({
      where: { id },
      include: { offeredCards: true },
    });
    if (!existing) {
      throw new NotFoundException(
        `TradeProposal com id "${id}" não encontrado`,
      );
    }

    const proposal = new TradeProposalEntity(existing.status);
    const newStatus = this.applyTransition(proposal, dto.status);

    const updated = await this.prisma.tradeProposal.update({
      where: { id },
      data: { status: newStatus },
      include: { offeredCards: true },
    });

    if (newStatus === ProposalStatus.ACCEPTED) {
      await this.prisma.tradeProposal.updateMany({
        where: {
          tradeId: existing.tradeId,
          id: { not: id },
          status: ProposalStatus.PENDING,
        },
        data: { status: ProposalStatus.CANCELLED },
      });

      await this.prisma.trade.update({
        where: { id: existing.tradeId },
        data: { status: TradeStatus.CONCLUDED },
      });
    }

    return updated;
  }

  /**
   * Resolves the requested status change through the proposal's current
   * ProposalState (State pattern). When no status is requested, the
   * proposal keeps its current status.
   */
  private applyTransition(
    proposal: TradeProposalEntity,
    status?: ProposalStatus,
  ): ProposalStatus {
    switch (status) {
      case ProposalStatus.ACCEPTED:
        return proposal.accept();
      case ProposalStatus.REJECTED:
        return proposal.reject();
      case ProposalStatus.CANCELLED:
        return proposal.cancel();
      default:
        return proposal.status;
    }
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prisma.tradeProposal.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(
        `TradeProposal com id "${id}" não encontrado`,
      );
    }
    await this.prisma.tradeProposal.delete({ where: { id } });
  }
}
