import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventBus } from './event-bus.service';
import { EVENT_PUBLISHER, EVENT_SUBSCRIBER } from './event.contracts';

/**
 * (Shareable) module that exposes the event bus.
 *
 * Binds EventBus to the IEventPublisher/IEventSubscriber tokens and exports them, so that
 * the Trade (publisher) and future handlers (subscribers, e.g. Wishlist) inject them
 * through the abstraction, never through the concrete implementation.
 */
@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [
    EventBus,
    { provide: EVENT_PUBLISHER, useExisting: EventBus },
    { provide: EVENT_SUBSCRIBER, useExisting: EventBus },
  ],
  exports: [EVENT_PUBLISHER, EVENT_SUBSCRIBER],
})
export class EventsModule {}
