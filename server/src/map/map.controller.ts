import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { MapService } from './map.service';

@Controller('map')
export class MapController {
    constructor(private mapService: MapService) { }

    /**
     * Ping user location to unlock fog
     * Call this every 30-60 seconds while user has app open
     */
    @Post('ping')
    async pingLocation(
        @Body() body: { userId: string; lat: number; lng: number },
    ) {
        return this.mapService.updateFog(body.userId, body.lat, body.lng);
    }

    /**
     * Get all unlocked tiles for a user
     * Call this when Map page loads
     */
    @Get('tiles/:userId')
    async getMyTiles(@Param('userId') userId: string) {
        const tiles = await this.mapService.getUnlockedTiles(userId);
        return { tiles };
    }

    /**
     * Get exploration statistics
     */
    @Get('stats/:userId')
    async getStats(@Param('userId') userId: string) {
        return this.mapService.getExplorationStats(userId);
    }
}
