import { Trade } from '../domain/trade.entity';

/**
 * Persistence contract for the settled Trade (ITradeRepository in the v5 diagram).
 *
 * TradeService depends on THIS abstraction (DIP), not on Prisma. The concrete
 * implementation (PrismaTradeRepository) is another teammate's responsibility and will be
 * bound to the TRADE_REPOSITORY token in TradesModule. The interface is kept narrow (ISP):
 * only what the Trade flow needs.
 */
export interface ITradeRepository {
  save(trade: Trade): Promise<void>;
  findById(id: string): Promise<Trade | null>;
}

/** Injection token for ITradeRepository. */
export const TRADE_REPOSITORY = Symbol('TRADE_REPOSITORY');
