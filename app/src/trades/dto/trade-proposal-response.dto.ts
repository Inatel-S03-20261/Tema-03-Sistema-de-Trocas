import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProposalStatus } from '../domain/trade-proposal.entity';

export class ProposalItemResponseDto {
  @ApiProperty({
    description: 'Identificador da carta.',
    example: 'charizard-base-set',
  })
  cardId: string;

  @ApiProperty({ description: 'Quantidade da carta.', example: 2 })
  quantity: number;
}

/**
 * Response shape of the proposal returned by the trade actions.
 * (Corresponds to `proposal: TradeProposal` in the v5 diagram's *ResponseDto.)
 */
export class TradeProposalResponseDto {
  @ApiProperty({
    description: 'Identificador da proposta.',
    format: 'uuid',
    example: '8d5530de-bd66-4de9-bf68-ddf0fd49b7f2',
  })
  id: string;

  @ApiProperty({
    description: 'Usuário que criou a proposta.',
    example: 'ash-ketchum',
  })
  proposerId: string;

  @ApiProperty({
    description: 'Usuário que recebe a proposta.',
    example: 'gary-oak',
  })
  recipientId: string;

  @ApiProperty({
    description: 'Status atual da proposta.',
    enum: ProposalStatus,
    example: ProposalStatus.ACCEPTED,
  })
  status: ProposalStatus;

  @ApiProperty({
    description: 'Cartas oferecidas na proposta.',
    type: [ProposalItemResponseDto],
  })
  offeredCards: ProposalItemResponseDto[];

  @ApiProperty({
    description: 'Cartas solicitadas na proposta.',
    type: [ProposalItemResponseDto],
  })
  requestedCards: ProposalItemResponseDto[];

  @ApiPropertyOptional({
    description: 'Wishlist vinculada à proposta, se houver.',
    format: 'uuid',
    nullable: true,
    example: '3fb52d0f-3d65-4113-bd1f-4478f8581e4f',
  })
  linkedWishlistId: string | null;

  @ApiProperty({
    description: 'Data de criação da proposta.',
    type: String,
    format: 'date-time',
    example: '2026-04-10T16:08:45.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização da proposta.',
    type: String,
    format: 'date-time',
    example: '2026-04-10T16:08:45.000Z',
  })
  updatedAt: Date;
}
