import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { ShopItem } from './shop-item.entity';
import { User } from '../user/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ShopItem, User])],
    controllers: [ShopController],
    providers: [ShopService],
})
export class ShopModule { }
