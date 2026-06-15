import { Module } from '@nestjs/common';
import { TradeProposalService } from './trade-proposal.service';
import { TradeProposalController } from './trade-proposal.controller';
import { TradeProposalRepository } from './trade-proposal.repository';

@Module({
  controllers: [TradeProposalController],
  providers: [TradeProposalService, TradeProposalRepository],
  exports: [TradeProposalRepository],
})
export class TradeProposalModule {}
