import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto, WishlistItemDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import {
  WishlistItemResponseDto,
  WishlistResponseDto,
} from './dto/wishlist-response.dto';

@ApiTags('Wishlists')
@ApiExtraModels(WishlistResponseDto)
@Controller('wishlists')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova wishlist' })
  create(
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<WishlistResponseDto> {
    return this.wishlistService.create(createWishlistDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma wishlist pelo identificador' })
  findOne(@Param('id') id: string): Promise<WishlistResponseDto> {
    return this.wishlistService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma wishlist existente' })
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<WishlistResponseDto> {
    return this.wishlistService.update(id, updateWishlistDto);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Adicionar item à wishlist' })
  addItem(
    @Param('id') id: string,
    @Body() dto: WishlistItemDto,
  ): Promise<WishlistItemResponseDto> {
    return this.wishlistService.addItemToWishlist(id, dto);
  }

  @Delete(':id/items/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover item da wishlist' })
  removeItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ): Promise<void> {
    return this.wishlistService.removeItemFromWishlist(id, itemId);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): Promise<void> {
    return this.wishlistService.delete(id);
  }
}
