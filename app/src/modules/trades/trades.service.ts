import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { TradeStatus } from '@prisma/client';
import { TradesRepository } from './trades.repository';
import { CreateTradeDto } from './dto/create-trade.dto';

@Injectable()
export class TradesService {
  constructor(private readonly tradesRepository: TradesRepository) {}

  async create(dto: CreateTradeDto) {
    return this.tradesRepository.create(dto);
  }

  async cancel(id: string) {
    const trade = await this.tradesRepository.findById(id);

    if (!trade) {
      throw new NotFoundException(`Trade com id "${id}" não encontrada`);
    }

    if (trade.status !== TradeStatus.OPENED) {
      throw new ConflictException(
        `Trade com status ${trade.status} não pode ser cancelada`,
      );
    }

    return this.tradesRepository.cancel(id);
  }
}
