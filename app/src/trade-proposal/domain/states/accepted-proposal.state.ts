import { ProposalStatus } from '@prisma/client';
import { ProposalState } from '../proposal-state';

/** A proposal already ACCEPTED is final: no further transition is allowed. */
export class AcceptedProposalState extends ProposalState {
  readonly status = ProposalStatus.ACCEPTED;
}
