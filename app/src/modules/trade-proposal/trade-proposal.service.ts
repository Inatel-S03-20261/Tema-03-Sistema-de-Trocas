import { Injectable, NotFoundException } from '@nestjs/common';
import { ProposalItemType, ProposalStatus } from '@prisma/client';
import { CreateTradeProposalDto } from './dto/create-trade-proposal.dto';
import { UpdateTradeProposalDto } from './dto/update-trade-proposal.dto';
import {
  ProposalItemResponseDto,
  TradeProposalResponseDto,
} from './dto/trade-proposal-response.dto';
import { TradeProposalRepository } from './trade-proposal.repository';
import { TradeProposalEntity } from './domain/trade-proposal.entity';

@Injectable()
export class TradeProposalService {
  constructor(private readonly repository: TradeProposalRepository) {}

  async create(dto: CreateTradeProposalDto): Promise<TradeProposalResponseDto> {
    const { proposerId, tradeId, message, offeredCards } = dto;

    const proposal = await this.repository.createTradeProposal({
      proposerId,
      tradeId,
      message,
      offeredCards,
    });

    return this.toResponseDto(proposal);
  }

  async findOne(id: string): Promise<TradeProposalResponseDto> {
    const proposal = await this.repository.findTradeProposalById(id);

    if (!proposal) {
      throw new NotFoundException(
        `TradeProposal com id "${id}" não encontrado`,
      );
    }

    return this.toResponseDto(proposal);
  }

  async findAll(proposerId?: string): Promise<TradeProposalResponseDto[]> {
    const proposals = await this.repository.findAllTradeProposals(proposerId);

    return proposals.map((p) => this.toResponseDto(p));
  }

  async update(
    id: string,
    dto: UpdateTradeProposalDto,
  ): Promise<TradeProposalResponseDto> {
    const existing = await this.repository.findTradeProposalById(id);

    if (!existing) {
      throw new NotFoundException(
        `TradeProposal com id "${id}" não encontrado`,
      );
    }

    const newStatus = this.applyTransition(existing.status, dto.status);

    const updated = await this.repository.updateTradeProposalStatus(
      id,
      newStatus,
    );

    return this.toResponseDto(updated);
  }

  async acceptProposal(proposalId: string): Promise<TradeProposalResponseDto> {
    const existing = await this.repository.findTradeProposalById(proposalId);

    if (!existing) {
      throw new NotFoundException(
        `TradeProposal com id "${proposalId}" não encontrado`,
      );
    }

    new TradeProposalEntity(existing.status).accept();

    const updated = await this.repository.acceptProposal(proposalId);
    return this.toResponseDto(updated);
  }

  private applyTransition(
    currentStatus: ProposalStatus,
    targetStatus: ProposalStatus,
  ): ProposalStatus {
    const entity = new TradeProposalEntity(currentStatus);

    switch (targetStatus) {
      case ProposalStatus.ACCEPTED:
        return entity.accept();
      case ProposalStatus.REJECTED:
        return entity.reject();
      case ProposalStatus.CANCELLED:
        return entity.cancel();
      default:
        return targetStatus;
    }
  }

  async delete(id: string): Promise<void> {
    const existing = await this.repository.findTradeProposalById(id);

    if (!existing) {
      throw new NotFoundException(
        `TradeProposal com id "${id}" não encontrado`,
      );
    }

    await this.repository.deleteTradeProposal(id);
  }

  private toResponseDto(proposal: {
    id: string;
    proposerId: string;
    tradeId: string;
    message?: string | null;
    status: ProposalStatus;
    items: {
      id: string;
      proposalId: string;
      cardId: string;
      quantity: number;
      type: ProposalItemType;
    }[];
  }): TradeProposalResponseDto {
    return new TradeProposalResponseDto({
      id: proposal.id,
      proposerId: proposal.proposerId,
      tradeId: proposal.tradeId,
      message: proposal.message,
      status: proposal.status,
      offeredCards: proposal.items
        .filter((i) => i.type === ProposalItemType.OFFERED)
        .map(
          (i) =>
            new ProposalItemResponseDto({
              id: i.id,
              proposalId: i.proposalId,
              cardId: i.cardId,
              quantity: i.quantity,
              type: i.type,
            }),
        ),
    });
  }
}
