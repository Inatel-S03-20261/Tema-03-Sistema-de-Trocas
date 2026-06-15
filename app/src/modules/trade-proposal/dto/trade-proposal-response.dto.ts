import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProposalItemType, ProposalStatus } from '@prisma/client';

export class ProposalItemResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  proposalId!: string;

  @ApiProperty({ example: 'a78df551-23ad-4eb2-8a9a-7090d455e44d' })
  cardId!: string;

  @ApiProperty({ example: 2 })
  quantity!: number;

  @ApiProperty({ enum: ProposalItemType })
  type!: ProposalItemType;

  constructor(partial: Partial<ProposalItemResponseDto>) {
    Object.assign(this, partial);
  }
}

export class TradeProposalResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'ash-ketchum' })
  proposerId!: string;

  @ApiProperty({ example: 'id_teste1' })
  tradeId!: string;

  @ApiProperty({ enum: ProposalStatus, example: ProposalStatus.PENDING })
  status!: ProposalStatus;

  @ApiPropertyOptional({ nullable: true })
  message?: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: [ProposalItemResponseDto] })
  offeredCards!: ProposalItemResponseDto[];

  constructor(partial: Partial<TradeProposalResponseDto>) {
    Object.assign(this, partial);
  }
}
