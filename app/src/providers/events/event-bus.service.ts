import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  DomainEvent,
  IEventPublisher,
  IEventSubscriber,
} from './event.contracts';

/**
 * Concrete event bus implementation on top of Nest's EventEmitter2.
 *
 * Fulfills both contracts (IEventPublisher and IEventSubscriber). It is the only piece
 * that knows about EventEmitter2 — the rest of the system depends only on the interfaces,
 * keeping the coupling isolated here (Liskov: it can be swapped for another impl).
 */
@Injectable()
export class EventBus implements IEventPublisher, IEventSubscriber {
  constructor(private readonly emitter: EventEmitter2) {}

  publish(event: DomainEvent): void {
    this.emitter.emit(event.name, event);
  }

  subscribe(eventName: string, handler: (event: DomainEvent) => void): void {
    this.emitter.on(eventName, handler);
  }
}
