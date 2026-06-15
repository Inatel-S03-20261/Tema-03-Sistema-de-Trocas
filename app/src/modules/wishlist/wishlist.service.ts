import { Injectable, NotFoundException } from '@nestjs/common';
import { Wishlist, WishlistItem } from '@prisma/client';
import { CreateWishlistDto, WishlistItemDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistItemResponseDto } from './dto/wishlist-response.dto';
import { WishlistItemFactory } from './strategies/wishlist-item.factory';
import { WishlistRepository } from './wishlist.repository';

type WishlistWithItems = Wishlist & { items: WishlistItem[] };

@Injectable()
export class WishlistService {
  constructor(private readonly wishlistRepository: WishlistRepository) {}

  create(dto: CreateWishlistDto): Promise<WishlistWithItems> {
    return this.wishlistRepository.create(dto);
  }

  async findOne(id: string): Promise<WishlistWithItems> {
    const wishlist = await this.wishlistRepository.findById(id);

    if (!wishlist) {
      throw new NotFoundException(`Wishlist com id "${id}" não encontrada`);
    }

    return wishlist;
  }

  async update(id: string, dto: UpdateWishlistDto): Promise<WishlistWithItems> {
    const existing = await this.wishlistRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Wishlist com id "${id}" não encontrada`);
    }

    return this.wishlistRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.wishlistRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Wishlist com id "${id}" não encontrada`);
    }

    await this.wishlistRepository.delete(id);
  }

  async addItemToWishlist(wishlistId: string, dto: WishlistItemDto): Promise<WishlistItemResponseDto> {
    const wishlist = await this.wishlistRepository.findById(wishlistId);

    if (!wishlist) {
      throw new NotFoundException(`Wishlist com id "${wishlistId}" não encontrada`);
    }

    WishlistItemFactory.create(dto);

    return this.wishlistRepository.addItem(wishlistId, dto);
  }

  async removeItemFromWishlist(wishlistId: string, itemId: string): Promise<void> {
    const item = await this.wishlistRepository.findItem(itemId, wishlistId);

    if (!item) {
      throw new NotFoundException(
        `Item com id "${itemId}" não encontrado na wishlist "${wishlistId}"`,
      );
    }

    await this.wishlistRepository.deleteItem(itemId);
  }
}
