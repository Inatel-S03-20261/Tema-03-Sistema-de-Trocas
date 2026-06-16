import { ProposalStatus } from '@prisma/client';
import { ProposalStateFactory } from './proposal-state.factory';

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
