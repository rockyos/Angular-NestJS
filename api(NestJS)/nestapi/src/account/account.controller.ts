import { Controller, Post, Body, Res, Get, Query } from '@nestjs/common';
import { User } from './user.entity';
import { AuthService } from './auth/auth.service';


@Controller('Account')
export class AccountController {
    constructor(private readonly authService: AuthService) { }

    @Post('Register')
    async register(@Body() user: User): Promise<any> {
        return await this.authService.register(user);
    }

    @Post('Login')
    async login(@Body() user: User): Promise<any> {
        return await this.authService.login(user);
    }

    @Get('GoogleGetInfoByToken')
    async googleGetInfoByToken(@Query('token') token): Promise<any> {
        const googleToken = await this.authService.googleTokenAuth(token);
        return googleToken;
    }

    @Get('FacebookGetInfoByToken')
    async facebookGetInfoByToken(@Query('token') token): Promise<any> {
        const facebookToken = await this.authService.facebookTokenAuth(token);
        return facebookToken;
    }

}
