import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TradeItemType } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsEnum,
  IsOptional,
  IsUUID,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTradeItemDto {
  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID('4')
  cardId?: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID('4')
  wishlistId?: string;

  @ApiProperty({ enum: TradeItemType, example: TradeItemType.OFFERED })
  @IsEnum(TradeItemType)
  type!: TradeItemType;
}

export class CreateTradeDto {
  @ApiProperty({
    description: 'Usuário que cria a troca.',
    example: 'ash-ketchum',
  })
  @IsString()
  @IsNotEmpty()
  createdBy!: string;

  @ApiProperty({ type: [CreateTradeItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTradeItemDto)
  items!: CreateTradeItemDto[];
}
