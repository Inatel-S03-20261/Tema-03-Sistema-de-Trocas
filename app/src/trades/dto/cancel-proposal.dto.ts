import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

/**
 * Payload to cancel a proposal (CancelProposalDto in the v5 diagram).
 */
export class CancelProposalDto {
  @ApiProperty({
    description: 'Identificador da proposta a ser cancelada.',
    format: 'uuid',
    example: '8d5530de-bd66-4de9-bf68-ddf0fd49b7f2',
  })
  @IsUUID('4')
  @IsNotEmpty()
  tradeId: string;
}
