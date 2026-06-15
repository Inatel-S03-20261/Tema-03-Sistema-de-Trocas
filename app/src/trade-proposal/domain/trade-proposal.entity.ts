import { ProposalStatus } from '@prisma/client';
import { ProposalStateFactory } from './proposal-state.factory';

/**
 * Domain wrapper around a TradeProposal's status (TradeProposal in the v5 diagram).
 *
 * accept/reject/cancel delegate to the current ProposalState (State pattern): the
 * allowed transitions and the resulting status depend solely on the current state,
 * not on conditionals scattered through the service.
 */
export class TradeProposalEntity {
  status: ProposalStatus;

  constructor(status: ProposalStatus) {
    this.status = status;
  }

  accept(): ProposalStatus {
    this.status = ProposalStateFactory.create(this.status).accept();
    return this.status;
  }

  reject(): ProposalStatus {
    this.status = ProposalStateFactory.create(this.status).reject();
    return this.status;
  }

  cancel(): ProposalStatus {
    this.status = ProposalStateFactory.create(this.status).cancel();
    return this.status;
  }
}
