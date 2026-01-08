import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get(':id')
    async getUser(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Post('watch-ad')
    async watchAd(@Body() body: { userId: string }) {
        // Award 20 XP for watching an ad
        const updatedUser = await this.userService.addXP(body.userId, 20);
        return updatedUser;
    }
}
