import { Module } from '@nestjs/common';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';
import { TradesRepository } from './trades.repository';
import { EventsModule } from '../../providers/events/events.module';

@Module({
  imports: [EventsModule],
  controllers: [TradesController],
  providers: [TradesService, TradesRepository],
})
export class TradesModule {}
