import { ProposalStatus } from '@prisma/client';
import { ProposalState } from '../proposal-state';

export class CancelledProposalState extends ProposalState {
  readonly status = ProposalStatus.CANCELLED;
}
