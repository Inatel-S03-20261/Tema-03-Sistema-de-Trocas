import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { TradeProposal } from '../domain/trade-proposal.entity';
import { Trade } from '../domain/trade.entity';
import { TradeItem } from '../domain/trade-item.entity';
import { TradeStatus } from '../domain/trade-status.enum';

/**
 * Trade factory (TradeFactory in the v5 diagram) — Factory Method pattern.
 *
 * Centralizes building a settled Trade from an accepted proposal, isolating that logic
 * from the TradeService (SRP). Rules encapsulated here:
 *   - offered cards were originally owned by the `proposerId`;
 *   - requested cards were originally owned by the `recipientId`;
 *   - the trade is born COMPLETED with `completedAt` set to the current instant.
 */
@Injectable()
export class TradeFactory {
  fromAcceptedProposal(proposal: TradeProposal): Trade {
    const offeredItems = proposal.offeredCards.map(
      (card) =>
        new TradeItem(
          randomUUID(),
          card.cardId,
          card.quantity,
          proposal.proposerId,
        ),
    );

    const requestedItems = proposal.requestedCards.map(
      (card) =>
        new TradeItem(
          randomUUID(),
          card.cardId,
          card.quantity,
          proposal.recipientId,
        ),
    );

    return new Trade(
      randomUUID(),
      proposal.id,
      proposal.proposerId,
      proposal.recipientId,
      TradeStatus.COMPLETED,
      new Date(),
      [...offeredItems, ...requestedItems],
    );
  }
}
