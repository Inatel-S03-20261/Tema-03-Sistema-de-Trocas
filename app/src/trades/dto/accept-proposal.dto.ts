import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

/**
 * Payload to accept a proposal (AcceptProposalDto in the v5 diagram).
 *
 * Note: the diagram names the field `tradeId`; kept for fidelity, but it identifies the
 * PROPOSAL the action is executed on (the trade is generated from it).
 */
export class AcceptProposalDto {
  @ApiProperty({
    description: 'Identificador da proposta a ser aceita.',
    format: 'uuid',
    example: '8d5530de-bd66-4de9-bf68-ddf0fd49b7f2',
  })
  @IsUUID('4')
  @IsNotEmpty()
  tradeId: string;
}
