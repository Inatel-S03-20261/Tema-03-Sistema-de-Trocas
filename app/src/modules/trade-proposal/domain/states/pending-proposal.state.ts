import { ProposalStatus } from '@prisma/client';
import { ProposalState } from '../proposal-state';

export class PendingProposalState extends ProposalState {
  readonly status = ProposalStatus.PENDING;

  accept(): ProposalStatus {
    return ProposalStatus.ACCEPTED;
  }

  reject(): ProposalStatus {
    return ProposalStatus.REJECTED;
  }

  cancel(): ProposalStatus {
    return ProposalStatus.CANCELLED;
  }
}
