import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EVENT_SUBSCRIBER } from '../events/event.contracts';
import type { DomainEvent, IEventSubscriber } from '../events/event.contracts';
import { TRADE_COMPLETED, TradeCompleted } from '../events/trade.events';
import { TRADE_PUBLISHER } from './rabbitmq.module';

@Injectable()
export class TradeDonePublisher implements OnModuleInit {
  constructor(
    @Inject(EVENT_SUBSCRIBER) private readonly subscriber: IEventSubscriber,
    @Inject(TRADE_PUBLISHER) private readonly client: ClientProxy,
  ) {}

  onModuleInit() {
    this.subscriber.subscribe(TRADE_COMPLETED, (event: DomainEvent) => {
      const e = event as TradeCompleted;

      this.client.emit('trade.done', {
        userId: e.createdBy,
        cardsGived: e.tradeOfferedItems,
        cardsReceived: e.proposalOfferedItems,
      });

      this.client.emit('trade.done', {
        userId: e.proposerId,
        cardsGived: e.proposalOfferedItems,
        cardsReceived: e.tradeOfferedItems,
      });
    });
  }
}
