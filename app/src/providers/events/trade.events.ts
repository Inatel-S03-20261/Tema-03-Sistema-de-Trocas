import { DomainEvent } from './event.contracts';

export const TRADE_COMPLETED = 'trade.completed';

export type CardRef = { cardId: string; quantity: number };

export class TradeCompleted extends DomainEvent {
  readonly name = TRADE_COMPLETED;

  constructor(
    public readonly tradeId: string,
    public readonly createdBy: string,
    public readonly proposerId: string,
    public readonly tradeOfferedItems: CardRef[],
    public readonly proposalOfferedItems: CardRef[],
  ) {
    super();
  }
}
