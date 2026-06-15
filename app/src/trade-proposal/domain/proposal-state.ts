import { ConflictException } from '@nestjs/common';
import { ProposalStatus } from '@prisma/client';

/**
 * State pattern: each ProposalStatus has its own rules for accept/reject/cancel.
 *
 * By default a state does not allow any transition — only `PendingProposalState`
 * overrides accept/reject/cancel to move the proposal to a new status. Any other
 * state (ACCEPTED, REJECTED, CANCELLED) keeps the inherited behavior and throws.
 */
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
