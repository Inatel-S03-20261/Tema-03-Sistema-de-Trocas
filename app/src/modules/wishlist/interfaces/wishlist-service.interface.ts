import { WishlistItemDto } from '../dto/create-wishlist.dto';
import { WishlistItemResponseDto } from '../dto/wishlist-response.dto';

export interface IWishlistService {
  addItemToWishlist(
    wishlistId: string,
    dto: WishlistItemDto,
  ): Promise<WishlistItemResponseDto>;

  removeItemFromWishlist(wishlistId: string, itemId: string): Promise<void>;
}
