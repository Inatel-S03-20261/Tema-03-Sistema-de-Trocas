import { ProposalStatus } from '@prisma/client';
import { ProposalState } from '../proposal-state';

export class AcceptedProposalState extends ProposalState {
  readonly status = ProposalStatus.ACCEPTED;
}
