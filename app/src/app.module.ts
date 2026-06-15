import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TradesModule } from './trades/trades.module';
import { TradeProposalModule } from './trade-proposal/trade-proposal.module';

@Module({
  imports: [TradesModule, TradeProposalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
