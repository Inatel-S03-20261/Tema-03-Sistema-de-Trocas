import { DomainEvent } from './event.contracts';

/**
 * Events emitted by a TradeProposal lifecycle (ProposalEvents in the v5 diagram).
 * They are published by the Trade and may be consumed by other modules (e.g. Wishlist).
 */

export const PROPOSAL_ACCEPTED = 'proposal.accepted';
export const PROPOSAL_REJECTED = 'proposal.rejected';
export const PROPOSAL_CANCELLED = 'proposal.cancelled';

export class ProposalAccepted extends DomainEvent {
  readonly name = PROPOSAL_ACCEPTED;

  constructor(
    public readonly proposalId: string,
    public readonly proposerId: string,
    public readonly recipientId: string,
  ) {
    super();
  }
}

export class ProposalRejected extends DomainEvent {
  readonly name = PROPOSAL_REJECTED;

  constructor(
    public readonly proposalId: string,
    public readonly proposerId: string,
    public readonly recipientId: string,
  ) {
    super();
  }
}

export class ProposalCancelled extends DomainEvent {
  readonly name = PROPOSAL_CANCELLED;

  constructor(
    public readonly proposalId: string,
    public readonly proposerId: string,
    public readonly recipientId: string,
  ) {
    super();
  }
}
