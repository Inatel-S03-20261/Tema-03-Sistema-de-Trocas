import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist, WishlistItem } from '@prisma/client';

type WishlistWithItems = Wishlist & { items: WishlistItem[] };

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createWishlistDto: CreateWishlistDto,
  ): Promise<WishlistWithItems> {
    const { userId, name, items } = createWishlistDto;

    return this.prisma.wishlist.create({
      data: {
        userId,
        name,
        items: {
          create: items ?? [],
        },
      },
      include: { items: true },
    });
  }

  async findOne(id: string): Promise<WishlistWithItems> {
    const wishlist = await this.prisma.wishlist.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist com id "${id}" não encontrada`);
    }

    return wishlist;
  }