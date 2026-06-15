import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './providers/database/database.module';
import { TradesModule } from './modules/trades/trades.module';
import { TradeProposalModule } from './modules/trade-proposal/trade-proposal.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';

@Module({
  imports: [PrismaModule, TradesModule, TradeProposalModule, WishlistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
