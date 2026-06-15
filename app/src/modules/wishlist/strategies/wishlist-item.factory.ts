import { BadRequestException } from '@nestjs/common';
import { WishlistItemType } from '@prisma/client';
import { WishlistItemDto } from '../dto/create-wishlist.dto';
import { IWishlistItem } from '../interfaces/wishlist-item.interface';
import { FilterItem } from './filter-item.strategy';
import { SpecificCardItem } from './specific-card-item.strategy';

export class WishlistItemFactory {
  static create(dto: WishlistItemDto): IWishlistItem {
    switch (dto.itemType) {
      case WishlistItemType.SPECIFIC_CARD:
        if (!dto.cardId) {
          throw new BadRequestException(
            'cardId é obrigatório para itens do tipo SPECIFIC_CARD',
          );
        }
        return new SpecificCardItem(dto.cardId);
      case WishlistItemType.FILTER:
        return new FilterItem(dto.filterType ?? undefined, dto.filterRarity ?? undefined);
    }
  }
}
