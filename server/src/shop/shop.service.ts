import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShopItem } from './shop-item.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ShopService implements OnModuleInit {
    constructor(
        @InjectRepository(ShopItem)
        private shopItemRepository: Repository<ShopItem>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async onModuleInit() {
        await this.seedItems();
    }

    async findAll(): Promise<ShopItem[]> {
        return this.shopItemRepository.find();
    }

    async buyItem(userId: string, itemId: number): Promise<User> {
        const user = await this.userRepository.findOne(userId);
        const item = await this.shopItemRepository.findOne(itemId);

        if (!user || !item) {
            throw new Error('User or Item not found');
        }

        if (user.gold < item.cost) {
            throw new Error('Not enough gold');
        }

        user.gold -= item.cost;
        // In a real app, we would add the item to the user's inventory here
        return this.userRepository.save(user);
    }

    async seedItems() {
        const count = await this.shopItemRepository.count();
        if (count === 0) {
            const items = [
                { name: 'Coffee Voucher', description: 'Get a free coffee', cost: 50, icon: 'coffee' },
                { name: 'XP Boost', description: 'Double XP for 1 hour', cost: 100, icon: 'zap' },
                { name: 'Golden Ticket', description: 'Skip one quest', cost: 200, icon: 'ticket' },
                { name: 'Cool Hat', description: 'Virtual cosmetic item', cost: 500, icon: 'crown' },
            ];
            await this.shopItemRepository.save(items);
        }
    }
}
