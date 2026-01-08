import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async findOne(id: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { id } });
    }

    async addXP(userId: string, xpAmount: number): Promise<User> {
        try {
            console.log('addXP called with:', { userId, xpAmount, xpAmountType: typeof xpAmount });

            // Validate xpAmount
            if (typeof xpAmount !== 'number' || isNaN(xpAmount)) {
                throw new Error(`Invalid XP amount: ${xpAmount}`);
            }

            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new Error('User not found');
            }

            // Ensure current values are numbers (handle null/undefined)
            const currentXP = Number(user.xp) || 0;
            const currentGold = Number(user.gold) || 0;
            const currentLevel = Number(user.level) || 1;

            console.log('Current user values:', { currentXP, currentGold, currentLevel });

            // Add XP
            user.xp = currentXP + xpAmount;

            // Calculate gold: 1 gold per 100 XP
            user.gold = Math.floor(user.xp / 100);

            // Calculate level (simple: level = XP / 100 + 1)
            user.level = Math.floor(user.xp / 100) + 1;

            console.log('Updating user:', {
                id: user.id,
                oldXP: currentXP,
                newXP: user.xp,
                gold: user.gold,
                level: user.level
            });

            return await this.userRepository.save(user);
        } catch (error) {
            console.error('Error adding XP:', error);
            throw error;
        }
    }

    async addGold(userId: string, gold: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }

        const currentGold = user.gold || 0;
        user.gold = currentGold + gold;

        const updatedUser = await this.userRepository.save(user);
        console.log(`Added ${gold} gold to user ${userId}. New total: ${updatedUser.gold}`);
        return updatedUser;
    }

    async updateProfile(userId: string, data: { fullName?: string; age?: number; interests?: string[] }): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }

        if (data.fullName) user.fullName = data.fullName;
        if (data.age) user.age = data.age;
        if (data.interests) user.interests = data.interests;

        return this.userRepository.save(user);
    }
}
