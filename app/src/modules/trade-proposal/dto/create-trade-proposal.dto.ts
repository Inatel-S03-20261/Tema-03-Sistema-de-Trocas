import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
  IsUUID,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProposalItemDto {
  @ApiProperty({
    format: 'uuid',
    example: 'a78df551-23ad-4eb2-8a9a-7090d455e44d',
  })
  @IsUUID('4')
  cardId!: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateTradeProposalDto {
  @ApiProperty({
    description: 'Usuário que faz a proposta.',
    example: 'ash-ketchum',
  })
  @IsString()
  @IsNotEmpty()
  proposerId!: string;

  @ApiProperty({
    description: 'Identificador da trade associada à proposta.',
    example: '8d5530de-bd66-4de9-bf68-ddf0fd49b7f2',
  })
  @IsUUID('4')
  @IsNotEmpty()
  tradeId!: string;

  @ApiPropertyOptional({
    nullable: true,
    example: 'Tenho interesse nas suas cartas raras!',
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ type: [ProposalItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProposalItemDto)
  offeredCards!: ProposalItemDto[];
}
