import { Module } from '@nestjs/common';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';
import { TradeFactory } from './factories/trade.factory';
import { EventsModule } from '../events/events.module';

/**
 * Trade entity module.
 *
 * IMPORTANT — persistence layer (another teammate's responsibility):
 * TradesService depends on the TRADE_REPOSITORY and PROPOSAL_REPOSITORY tokens
 * (interfaces ITradeRepository / IProposalRepository). The concrete (Prisma)
 * implementations are NOT part of this scope. For the app to boot, just register the
 * providers below once the schema/Prisma is ready, for example:
 *
 *   providers: [
 *     TradesService,
 *     TradeFactory,
 *     { provide: TRADE_REPOSITORY,    useClass: PrismaTradeRepository },
 *     { provide: PROPOSAL_REPOSITORY, useClass: PrismaProposalRepository },
 *   ],
 *
 * (importing the tokens from ./repositories/trade.repository and
 *  ./repositories/proposal.repository).
 */
@Module({
  imports: [EventsModule],
  controllers: [TradesController],
  providers: [TradesService, TradeFactory],
})
export class TradesModule {}
