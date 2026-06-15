import { TradeStatus } from './trade-status.enum';
import { TradeItem } from './trade-item.entity';

/**
 * Settled Trade entity (Trade in the v5 diagram).
 *
 * Domain model WITH behavior (not anemic): the `cancel()` method is the only state
 * transition allowed once the trade exists. It is built exclusively by the TradeFactory
 * from an accepted proposal.
 *
 * `userAId`/`userBId` correspond to `userA_Id`/`userB_Id` in the diagram (renamed to
 * camelCase, the project's convention).
 */
export class Trade {
  constructor(
    public readonly id: string,
    public readonly proposalId: string,
    public readonly userAId: string,
    public readonly userBId: string,
    public status: TradeStatus,
    public completedAt: Date | null,
    public readonly items: TradeItem[],
  ) {}

  cancel(): void {
    if (this.status === TradeStatus.CANCELLED) {
      return;
    }
    this.status = TradeStatus.CANCELLED;
  }
}
