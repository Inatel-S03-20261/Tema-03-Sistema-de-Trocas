import { IWishlistItem } from '../interfaces/wishlist-item.interface';

export class SpecificCardItem implements IWishlistItem {
  constructor(
    public readonly cardId: string,
    public readonly quantity: number = 1,
  ) {}

  matches(cardId: string): boolean {
    return this.cardId === cardId;
  }
}
