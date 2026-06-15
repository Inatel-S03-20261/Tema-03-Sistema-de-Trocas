import { Injectable } from '@nestjs/common';
import { Wishlist, WishlistItem } from '@prisma/client';
import { DatabaseService } from '../../providers/database/database.service';
import { CreateWishlistDto, WishlistItemDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

type WishlistWithItems = Wishlist & { items: WishlistItem[] };

@Injectable()
export class WishlistRepository {
  constructor(private readonly db: DatabaseService) {}

  create(dto: CreateWishlistDto): Promise<WishlistWithItems> {
    return this.db.wishlist.create({
      data: {
        userId: dto.userId,
        name: dto.name,
        items: { create: dto.items ?? [] },
      },
      include: { items: true },
    });
  }

  findById(id: string): Promise<WishlistWithItems | null> {
    return this.db.wishlist.findUnique({
      where: { id },
      include: { items: true },
    });
  }

  update(id: string, dto: UpdateWishlistDto): Promise<WishlistWithItems> {
    const { name, items } = dto;
    return this.db.wishlist.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(items !== undefined && {
          items: { deleteMany: {}, create: items },
        }),
      },
      include: { items: true },
    });
  }

  delete(id: string): Promise<Wishlist> {
    return this.db.wishlist.delete({ where: { id } });
  }

  addItem(wishlistId: string, dto: WishlistItemDto): Promise<WishlistItem> {
    return this.db.wishlistItem.create({
      data: {
        wishlistId,
        itemType: dto.itemType,
        cardId: dto.cardId ?? null,
        filterType: dto.filterType ?? null,
        filterRarity: dto.filterRarity ?? null,
      },
    });
  }

  findItem(itemId: string, wishlistId: string): Promise<WishlistItem | null> {
    return this.db.wishlistItem.findFirst({
      where: { id: itemId, wishlistId },
    });
  }

  deleteItem(itemId: string): Promise<WishlistItem> {
    return this.db.wishlistItem.delete({ where: { id: itemId } });
  }
}
