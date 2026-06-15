import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IProposalRepository,
  PROPOSAL_REPOSITORY,
} from './repositories/proposal.repository';
import {
  ITradeRepository,
  TRADE_REPOSITORY,
} from './repositories/trade.repository';
import { EVENT_PUBLISHER, IEventPublisher } from '../events/event.contracts';
import { TradeFactory } from './factories/trade.factory';
import { TradeProposal } from './domain/trade-proposal.entity';

/**
 * Trade service layer — orchestrates the v5 use cases: accept, reject and cancel a proposal.
 *
 * SOLID in action:
 *  - Depends on ABSTRACTIONS (repositories and publisher) injected by token (DIP).
 *  - Knows nothing about Prisma or the EventEmitter (low coupling).
 *  - Building the Trade lives in the TradeFactory and state transitions live in the
 *    TradeProposal itself (SRP): the service only coordinates the flow.
 *  - Side effects (e.g. Wishlist) come in via event subscription, without changing this
 *    service (OCP).
 */
@Injectable()
export class TradesService {
  constructor(
    @Inject(PROPOSAL_REPOSITORY)
    private readonly proposalRepo: IProposalRepository,
    @Inject(TRADE_REPOSITORY)
    private readonly tradeRepo: ITradeRepository,
    @Inject(EVENT_PUBLISHER)
    private readonly eventBus: IEventPublisher,
    private readonly tradeFactory: TradeFactory,
  ) {}

  /**
   * Accepts the proposal and settles the trade: transitions the proposal, builds the Trade
   * via the factory, persists both and publishes the ProposalAccepted event.
   */
  async acceptProposal(proposalId: string): Promise<TradeProposal> {
    const proposal = await this.getProposalOrFail(proposalId);

    const event = proposal.accept();
    await this.proposalRepo.save(proposal);

    const trade = this.tradeFactory.fromAcceptedProposal(proposal);
    await this.tradeRepo.save(trade);

    this.eventBus.publish(event);
    return proposal;
  }

  /** Rejects the proposal and publishes the ProposalRejected event. */
  async rejectProposal(proposalId: string): Promise<TradeProposal> {
    const proposal = await this.getProposalOrFail(proposalId);

    const event = proposal.reject();
    await this.proposalRepo.save(proposal);

    this.eventBus.publish(event);
    return proposal;
  }

  /** Cancels the proposal and publishes the ProposalCancelled event. */
  async cancelProposal(proposalId: string): Promise<TradeProposal> {
    const proposal = await this.getProposalOrFail(proposalId);

    const event = proposal.cancel();
    await this.proposalRepo.save(proposal);

    this.eventBus.publish(event);
    return proposal;
  }

  private async getProposalOrFail(id: string): Promise<TradeProposal> {
    const proposal = await this.proposalRepo.findById(id);
    if (!proposal) {
      throw new NotFoundException(`Proposta com id "${id}" não encontrada`);
    }
    return proposal;
  }
}
