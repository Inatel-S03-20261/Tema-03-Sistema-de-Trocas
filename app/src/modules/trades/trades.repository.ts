import { Injectable } from '@nestjs/common';
import { ProposalStatus, Trade, TradeStatus } from '@prisma/client';
import { DatabaseService } from '../../providers/database/database.service';
import { CreateTradeDto } from './dto/create-trade.dto';

@Injectable()
export class TradesRepository {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateTradeDto) {
    return this.db.trade.create({
      data: {
        createdBy: dto.createdBy,
        items: { create: dto.items },
      },
      include: { items: true },
    });
  }

  findById(id: string): Promise<Trade | null> {
    return this.db.trade.findUnique({ where: { id } });
  }

  cancel(id: string): Promise<Trade> {
    return this.db.$transaction(async (tx) => {
      const trade = await tx.trade.update({
        where: { id },
        data: { status: TradeStatus.CANCELLED },
      });

      await tx.tradeProposal.updateMany({
        where: { tradeId: id, status: ProposalStatus.PENDING },
        data: { status: ProposalStatus.CANCELLED },
      });

      return trade;
    });
  }
}
