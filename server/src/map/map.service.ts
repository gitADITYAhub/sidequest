import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExploredTile } from './explored-tile.entity';
import { UserService } from '../user/user.service';
const S2 = require('s2-geometry').S2;

@Injectable()
export class MapService {
    constructor(
        @InjectRepository(ExploredTile)
        private tileRepo: Repository<ExploredTile>,
        private userService: UserService,
    ) { }

    /**
     * Process user location ping and unlock new tiles
     * Returns discovery status and awards XP for new areas
     */
    async updateFog(userId: string, lat: number, lng: number) {
        try {
            console.log('=== updateFog called ===');
            console.log('userId:', userId, 'lat:', lat, 'lng:', lng);
            console.log('S2 object:', typeof S2);
            console.log('S2.latLngToKey:', typeof S2.latLngToKey);

            // Convert Lat/Lon to a Grid ID (Level 15 = ~500m squares)
            console.log('About to call S2.latLngToKey...');
            const tileId = S2.latLngToKey(lat, lng, 15);
            console.log('tileId generated:', tileId);

            console.log(`User ${userId} at tile ${tileId} (${lat}, ${lng})`);

            // Check if already unlocked
            const exists = await this.tileRepo.findOne({
                where: { userId, tileId }
            });

            if (!exists) {
                // UNLOCK NEW AREA!
                await this.tileRepo.save({ userId, tileId });

                // Award discovery XP
                await this.userService.addXP(userId, 10);

                console.log(`NEW TILE UNLOCKED: ${tileId} for user ${userId}`);

                return {
                    status: 'NEW_UNLOCK',
                    tileId,
                    message: 'New Zone Discovered! +10 XP',
                    xpAwarded: 10,
                };
            }

            return {
                status: 'ALREADY_UNLOCKED',
                tileId,
            };
        } catch (error) {
            console.error('=== ERROR in updateFog ===');
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            throw error;
        }
    }

    /**
     * Get all tiles unlocked by a user
     * Returns array of S2 tile IDs
     */
    async getUnlockedTiles(userId: string): Promise<string[]> {
        const tiles = await this.tileRepo.find({
            where: { userId },
            select: ['tileId'],
        });
        return tiles.map((t) => t.tileId);
    }

    /**
     * Get exploration statistics for a user
     */
    async getExplorationStats(userId: string) {
        const tileCount = await this.tileRepo.count({ where: { userId } });

        return {
            tilesUnlocked: tileCount,
            areaExplored: `${(tileCount * 0.25).toFixed(1)} km²`, // ~0.25 km² per tile
            explorationRank: this.getExplorationRank(tileCount),
        };
    }

    /**
     * Get exploration rank based on tiles unlocked
     */
    private getExplorationRank(tileCount: number): string {
        if (tileCount >= 100) return 'Master Explorer';
        if (tileCount >= 50) return 'Urban Adventurer';
        if (tileCount >= 25) return 'City Scout';
        if (tileCount >= 10) return 'Neighborhood Walker';
        return 'Beginner';
    }
}
