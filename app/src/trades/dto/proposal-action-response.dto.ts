import { ApiProperty } from '@nestjs/swagger';
import { TradeProposalResponseDto } from './trade-proposal-response.dto';

/**
 * Responses for the Trade lifecycle actions (Accept/Reject/CancelProposalResponseDto in
 * the v5 diagram). All return the proposal in its new state.
 */

export class AcceptProposalResponseDto {
  @ApiProperty({
    description: 'Proposta aceita, em seu novo estado.',
    type: TradeProposalResponseDto,
  })
  proposal: TradeProposalResponseDto;
}

export class RejectProposalResponseDto {
  @ApiProperty({
    description: 'Proposta rejeitada, em seu novo estado.',
    type: TradeProposalResponseDto,
  })
  proposal: TradeProposalResponseDto;
}

export class CancelProposalResponseDto {
  @ApiProperty({
    description: 'Proposta cancelada, em seu novo estado.',
    type: TradeProposalResponseDto,
  })
  proposal: TradeProposalResponseDto;
}
