import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async signup(username: string, passwordHash: string): Promise<User> {
        const user = this.userRepository.create({
            username,
            passwordHash, // In a real app, hash this!
            email: `${username}@example.com`, // Placeholder
            xp: 0,
            level: 1,
            gold: 0,
            currentVibe: 'neutral',
            isVerified: false,
        });
        return this.userRepository.save(user);
    }

    async login(username: string, passwordHash: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { username } });
        if (user && user.passwordHash === passwordHash) {
            return user;
        }
        return null;
    }

    async updateProfile(userId: string, fullName: string, age: number, interests?: string[]): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        user.fullName = fullName;
        user.age = age;
        if (interests) {
            user.interests = interests;
        }
        return this.userRepository.save(user);
    }

    async uploadVerificationVideo(userId: string, videoUrl: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        user.profileVideoUrl = videoUrl;
        user.isVerified = true; // Auto-verify for MVP
        return this.userRepository.save(user);
    }
}
