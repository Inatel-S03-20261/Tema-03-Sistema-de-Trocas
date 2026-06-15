import { IWishlistItem } from '../interfaces/wishlist-item.interface';

export class FilterItem implements IWishlistItem {
  constructor(
    public readonly filterType?: string,
    public readonly filterRarity?: string,
  ) {}

  matches(_cardId: string): boolean {
    // full matching requires a Card object (type + rarity); not available yet
    return true;
  }
}
