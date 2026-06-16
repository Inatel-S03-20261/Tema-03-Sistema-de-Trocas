import { ProposalStatus } from '@prisma/client';
import { ProposalState } from '../proposal-state';

export class RejectedProposalState extends ProposalState {
  readonly status = ProposalStatus.REJECTED;
}
