import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopItem } from './shop-item.entity';

@Controller('shop')
export class ShopController {
    constructor(private readonly shopService: ShopService) { }

    @Get()
    findAll(): Promise<ShopItem[]> {
        return this.shopService.findAll();
    }

    @Post('buy/:userId/:itemId')
    buyItem(
        @Param('userId') userId: string,
        @Param('itemId') itemId: number,
    ): Promise<any> {
        return this.shopService.buyItem(userId, itemId);
    }

    @Post('seed')
    seed(): Promise<void> {
        return this.shopService.seedItems();
    }
}
