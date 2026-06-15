import { Injectable } from '@nestjs/common';
import { ProposalItemType, ProposalStatus, TradeStatus } from '@prisma/client';
import { DatabaseService } from 'src/providers/database/database.service';

@Injectable()
export class TradeProposalRepository {
  constructor(private readonly database: DatabaseService) {}

  async createTradeProposal(data: {
    proposerId: string;
    tradeId: string;
    message?: string;
    linkedWishlistId?: string;
    offeredCards: { cardId: string; quantity: number }[];
  }) {
    const { proposerId, tradeId, message, offeredCards } = data;

    const proposal = await this.database.tradeProposal.create({
      data: {
        proposerId,
        tradeId,
        message: message ?? null,
        status: ProposalStatus.PENDING,
        items: {
          create: [
            ...offeredCards.map((c) => ({
              cardId: c.cardId,
              quantity: c.quantity,
              type: ProposalItemType.OFFERED,
            })),
          ],
        },
      },
      include: { items: true },
    });

    return proposal;
  }

  async findTradeProposalById(id: string) {
    return this.database.tradeProposal.findUnique({
      where: { id },
      include: { items: true },
    });
  }

  async findAllTradeProposals(proposerId?: string) {
    return this.database.tradeProposal.findMany({
      where: proposerId ? { proposerId } : undefined,
      include: { items: true },
    });
  }

  async updateTradeProposalStatus(id: string, status: ProposalStatus) {
    return this.database.tradeProposal.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
  }

  async deleteTradeProposal(id: string) {
    await this.database.tradeProposal.delete({
      where: { id },
    });
  }

  async acceptProposal(proposalId: string) {
    return this.database.$transaction(async (tx) => {
      const proposal = await tx.tradeProposal.update({
        where: { id: proposalId },
        data: { status: ProposalStatus.ACCEPTED },
        include: { items: true },
      });

      await tx.trade.update({
        where: { id: proposal.tradeId },
        data: {
          status: TradeStatus.COMPLETED,
          acceptedBy: proposal.proposerId,
        },
      });

      await tx.tradeProposal.updateMany({
        where: {
          tradeId: proposal.tradeId,
          id: { not: proposalId },
          status: ProposalStatus.PENDING,
        },
        data: { status: ProposalStatus.CANCELLED },
      });

      return proposal;
    });
  }
}
