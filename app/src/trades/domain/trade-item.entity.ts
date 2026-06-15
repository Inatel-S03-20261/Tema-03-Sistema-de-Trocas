/**
 * Item actually moved in a settled Trade (TradeItem in the v5 diagram).
 *
 * `originalOwnerId` records who owned the card BEFORE the trade — information that only
 * exists at settlement time and that the TradeProposal does not hold.
 */
export class TradeItem {
  constructor(
    public readonly id: string,
    public readonly cardId: string,
    public readonly quantity: number,
    public readonly originalOwnerId: string,
  ) {}
}
