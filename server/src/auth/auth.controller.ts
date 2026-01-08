import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signup(@Body() body: any) {
        return this.authService.signup(body.username, body.password);
    }

    @Post('login')
    async login(@Body() body: any) {
        const user = await this.authService.login(body.username, body.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return user;
    }

    @Post('profile')
    async updateProfile(@Body() body: any) {
        return this.authService.updateProfile(body.userId, body.fullName, body.age, body.interests);
    }

    @Post('verify-video')
    async verifyVideo(@Body() body: any) {
        return this.authService.uploadVerificationVideo(body.userId, body.videoUrl);
    }
}
