import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { TradeProposalService } from './trade-proposal.service';
import { CreateTradeProposalDto } from './dto/create-trade-proposal.dto';
import { UpdateTradeProposalDto } from './dto/update-trade-proposal.dto';
import { TradeProposalResponseDto } from './dto/trade-proposal-response.dto';

@ApiTags('Trade Proposals')
@Controller('trade-proposals')
export class TradeProposalController {
  constructor(private readonly tradeProposalService: TradeProposalService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova proposta de troca' })
  create(
    @Body() createTradeProposalDto: CreateTradeProposalDto,
  ): Promise<TradeProposalResponseDto> {
    return this.tradeProposalService.create(createTradeProposalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as propostas de troca' })
  findAll(
    @Query('proposerId') proposerId?: string,
  ): Promise<TradeProposalResponseDto[]> {
    return this.tradeProposalService.findAll(proposerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar proposta pelo id' })
  @ApiParam({ name: 'id', schema: { type: 'string', format: 'uuid' } })
  findOne(@Param('id') id: string): Promise<TradeProposalResponseDto> {
    return this.tradeProposalService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar status da proposta' })
  @ApiParam({ name: 'id', schema: { type: 'string', format: 'uuid' } })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTradeProposalDto,
  ): Promise<TradeProposalResponseDto> {
    return this.tradeProposalService.update(id, dto);
  }

  @Post(':id/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Aceitar uma proposta e encerrar a troca' })
  @ApiParam({ name: 'id', schema: { type: 'string', format: 'uuid' } })
  acceptProposal(@Param('id') id: string): Promise<TradeProposalResponseDto> {
    return this.tradeProposalService.acceptProposal(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover proposta' })
  @ApiParam({ name: 'id', schema: { type: 'string', format: 'uuid' } })
  delete(@Param('id') id: string): Promise<void> {
    return this.tradeProposalService.delete(id);
  }
}
