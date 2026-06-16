import { ConflictException } from '@nestjs/common';
import { ProposalStatus } from '@prisma/client';

export abstract class ProposalState {
  abstract readonly status: ProposalStatus;

  accept(): ProposalStatus {
    this.throwInvalidTransition('aceita');
  }

  reject(): ProposalStatus {
    this.throwInvalidTransition('rejeitada');
  }

  cancel(): ProposalStatus {
    this.throwInvalidTransition('cancelada');
  }

  protected throwInvalidTransition(action: string): never {
    throw new ConflictException(
      `Proposta com status ${this.status} não pode ser ${action}`,
    );
  }
}
