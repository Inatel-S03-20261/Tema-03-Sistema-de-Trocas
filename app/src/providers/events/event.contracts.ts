/**
 * Event bus contracts (Observer / Publish-Subscribe pattern).
 *
 * The Trade entity depends on these ABSTRACTIONS (DIP): TradeService only publishes
 * events through IEventPublisher, without knowing who consumes them. This way, new side
 * effects (e.g. updating a Wishlist) can be added by other modules just by subscribing —
 * without changing the Trade (Open/Closed principle).
 */

/** Base domain event. Every event carries a name and the instant it occurred. */
export abstract class DomainEvent {
  abstract readonly name: string;
  readonly occurredAt: Date = new Date();
}

/** Publisher side of the bus — used by the Trade to emit events. */
export interface IEventPublisher {
  publish(event: DomainEvent): void;
}

/** Subscriber side of the bus — used by handlers (e.g. Wishlist) to react. */
export interface IEventSubscriber {
  subscribe(eventName: string, handler: (event: DomainEvent) => void): void;
}

/** Injection tokens (interfaces do not exist at runtime in TypeScript). */
export const EVENT_PUBLISHER = Symbol('EVENT_PUBLISHER');
export const EVENT_SUBSCRIBER = Symbol('EVENT_SUBSCRIBER');
