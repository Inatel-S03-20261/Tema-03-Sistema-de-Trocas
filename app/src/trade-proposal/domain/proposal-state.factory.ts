import { ProposalStatus } from '@prisma/client';
import { ProposalState } from './proposal-state';
import { PendingProposalState } from './states/pending-proposal.state';
import { AcceptedProposalState } from './states/accepted-proposal.state';
import { RejectedProposalState } from './states/rejected-proposal.state';
import { CancelledProposalState } from './states/cancelled-proposal.state';

/** Builds the ProposalState that matches the given ProposalStatus. */
export class ProposalStateFactory {
  static create(status: ProposalStatus): ProposalState {
    switch (status) {
      case ProposalStatus.PENDING:
        return new PendingProposalState();
      case ProposalStatus.ACCEPTED:
        return new AcceptedProposalState();
      case ProposalStatus.REJECTED:
        return new RejectedProposalState();
      case ProposalStatus.CANCELLED:
        return new CancelledProposalState();
    }
  }
}
