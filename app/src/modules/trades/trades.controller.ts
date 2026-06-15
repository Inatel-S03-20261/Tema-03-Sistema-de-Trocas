import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { NotFoundResponseDto } from '../../common/dto/not-found-response.dto';
import { TradesService } from './trades.service';
import { CreateTradeDto } from './dto/create-trade.dto';
import { ValidationErrorResponseDto } from '../../common/dto/validation-error-response.dto';

@ApiTags('Trades')
@Controller('trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova troca' })
  @ApiCreatedResponse({ description: 'Troca criada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Payload inválido.', type: ValidationErrorResponseDto })
  create(@Body() dto: CreateTradeDto) {
    return this.tradesService.create(dto);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelar uma troca' })
  @ApiParam({ name: 'id', schema: { type: 'string', format: 'uuid' } })
  @ApiOkResponse({ description: 'Troca cancelada com sucesso.' })
  @ApiNotFoundResponse({ description: 'Troca não encontrada.', type: NotFoundResponseDto })
  @ApiConflictResponse({ description: 'Troca não está com status OPENED.' })
  cancel(@Param('id') id: string) {
    return this.tradesService.cancel(id);
  }
}
