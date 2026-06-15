import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TradesService } from './trades.service';
import { AcceptProposalDto } from './dto/accept-proposal.dto';
import { RejectProposalDto } from './dto/reject-proposal.dto';
import { CancelProposalDto } from './dto/cancel-proposal.dto';
import {
  AcceptProposalResponseDto,
  CancelProposalResponseDto,
  RejectProposalResponseDto,
} from './dto/proposal-action-response.dto';
import { NotFoundResponseDto } from '../common/dto/not-found-response.dto';
import { ValidationErrorResponseDto } from '../common/dto/validation-error-response.dto';

/**
 * Trade controller (TradeController in the v5 diagram) — thin View/HTTP layer: it only
 * validates the payload (via ValidationPipe + DTOs) and delegates to the TradesService.
 *
 * Per v5, the Trade exposes no CRUD: it exists as the result of a proposal's lifecycle
 * (accept / reject / cancel).
 */
@ApiTags('Trades')
@Controller('trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Post('accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Aceitar uma proposta e concretizar a troca' })
  @ApiOkResponse({
    description: 'Proposta aceita e troca concretizada.',
    type: AcceptProposalResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Payload inválido.',
    type: ValidationErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Proposta não encontrada.',
    type: NotFoundResponseDto,
  })
  @ApiConflictResponse({
    description: 'Proposta não está com status PENDING.',
  })
  async acceptProposal(
    @Body() dto: AcceptProposalDto,
  ): Promise<AcceptProposalResponseDto> {
    const proposal = await this.tradesService.acceptProposal(dto.tradeId);
    return { proposal };
  }

  @Post('reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rejeitar uma proposta' })
  @ApiOkResponse({
    description: 'Proposta rejeitada.',
    type: RejectProposalResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Payload inválido.',
    type: ValidationErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Proposta não encontrada.',
    type: NotFoundResponseDto,
  })
  @ApiConflictResponse({
    description: 'Proposta não está com status PENDING.',
  })
  async rejectProposal(
    @Body() dto: RejectProposalDto,
  ): Promise<RejectProposalResponseDto> {
    const proposal = await this.tradesService.rejectProposal(dto.tradeId);
    return { proposal };
  }

  @Post('cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelar uma proposta' })
  @ApiOkResponse({
    description: 'Proposta cancelada.',
    type: CancelProposalResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Payload inválido.',
    type: ValidationErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Proposta não encontrada.',
    type: NotFoundResponseDto,
  })
  @ApiConflictResponse({
    description: 'Proposta não está com status PENDING.',
  })
  async cancelProposal(
    @Body() dto: CancelProposalDto,
  ): Promise<CancelProposalResponseDto> {
    const proposal = await this.tradesService.cancelProposal(dto.tradeId);
    return { proposal };
  }
}
