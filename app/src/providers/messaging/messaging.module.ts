import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { RabbitMQModule } from './rabbitmq.module';
import { TradeDonePublisher } from './trade-done.publisher';

@Module({
  imports: [EventsModule, RabbitMQModule],
  providers: [TradeDonePublisher],
})
export class MessagingModule {}
