import { TradeProposal } from '../domain/trade-proposal.entity';

/**
 * Persistence contract for the proposal (IProposalRepository in the v5 diagram).
 *
 * The Trade needs to load/save the proposal to drive its lifecycle, but does NOT know how
 * it is persisted. The concrete implementation belongs to the module that owns the
 * proposal and will be bound to the PROPOSAL_REPOSITORY token in TradesModule.
 */
export interface IProposalRepository {
  save(proposal: TradeProposal): Promise<void>;
  findById(id: string): Promise<TradeProposal | null>;
}

/** Injection token for IProposalRepository. */
export const PROPOSAL_REPOSITORY = Symbol('PROPOSAL_REPOSITORY');
