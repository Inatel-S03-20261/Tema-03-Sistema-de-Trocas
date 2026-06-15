import { ProposalStatus } from '@prisma/client';
import { ProposalState } from '../proposal-state';

/** A proposal already REJECTED is final: no further transition is allowed. */
export class RejectedProposalState extends ProposalState {
  readonly status = ProposalStatus.REJECTED;
}
