import { ProposalStatus } from '@prisma/client';
import { ProposalState } from '../proposal-state';

/** A proposal already CANCELLED is final: no further transition is allowed. */
export class CancelledProposalState extends ProposalState {
  readonly status = ProposalStatus.CANCELLED;
}
