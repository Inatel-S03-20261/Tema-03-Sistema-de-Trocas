/**
 * Status of a settled Trade (TradeStatus in the v5 diagram).
 *
 * Unlike the old "listing" model (which used OPEN), in v5 the Trade only exists as the
 * RESULT of an accepted proposal: that is why it is born COMPLETED and may eventually
 * become CANCELLED.
 */
export enum TradeStatus {
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
