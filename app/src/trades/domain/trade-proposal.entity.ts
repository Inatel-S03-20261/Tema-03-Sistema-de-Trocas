import { ConflictException } from '@nestjs/common';
import {
  ProposalAccepted,
  ProposalCancelled,
  ProposalRejected,
} from '../../events/proposal.events';

/**
 * Status of a proposal (ProposalStatus in the v5 diagram).
 */
export enum ProposalStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

/**
 * Card offered/requested in a proposal (ProposalItem in the v5 diagram).
 */
export class ProposalItem {
  constructor(
    public readonly cardId: string,
    public readonly quantity: number,
  ) {}
}

/**
 * Domain view of the TradeProposal used by the Trade flow.
 *
 * Ownership/persistence of the proposal belongs to ANOTHER module (trade-proposal), so
 * here it is treated as a domain model that the IProposalRepository hydrates. The
 * accept/reject/cancel methods:
 *   - validate the transition (only PENDING can change);
 *   - apply the new status;
 *   - RETURN the matching domain event (faithful to the diagram's "accept(): ProposalAccepted").
 *
 * Publishing the event on the bus is done by the TradeService (orchestrator).
 */
export class TradeProposal {
  constructor(
    public readonly id: string,
    public readonly proposerId: string,
    public readonly recipientId: string,
    public status: ProposalStatus,
    public readonly offeredCards: ProposalItem[],
    public readonly requestedCards: ProposalItem[],
    public readonly linkedWishlistId: string | null = null,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  accept(): ProposalAccepted {
    this.transitionTo(ProposalStatus.ACCEPTED, 'aceita');
    return new ProposalAccepted(this.id, this.proposerId, this.recipientId);
  }

  reject(): ProposalRejected {
    this.transitionTo(ProposalStatus.REJECTED, 'rejeitada');
    return new ProposalRejected(this.id, this.proposerId, this.recipientId);
  }

  cancel(): ProposalCancelled {
    this.transitionTo(ProposalStatus.CANCELLED, 'cancelada');
    return new ProposalCancelled(this.id, this.proposerId, this.recipientId);
  }

  private transitionTo(next: ProposalStatus, action: string): void {
    if (this.status !== ProposalStatus.PENDING) {
      throw new ConflictException(
        `Proposta com status ${this.status} não pode ser ${action}`,
      );
    }
    this.status = next;
    this.updatedAt = new Date();
  }
}
