import { Controller, Post, Body, Res, Get, Query } from '@nestjs/common';
import { User } from './user.entity';
import { AuthService } from './auth/auth.service';
import { Response } from 'express';


@Controller('Account')
export class AccountController {
    constructor(private readonly authService: AuthService) { }

    @Post('Register')
    async register(@Res() res: Response, @Body() user: User): Promise<any> {
        return this.authService.register(user);
    }

    @Post('Login')
    async login(@Res() res: Response, @Body() user: User): Promise<any> {
        return this.authService.login(user);
    }

    @Get('GoogleGetInfoByToken')
    async googleGetInfoByToken(@Query('token') token): Promise<any> {
        const googleToken = await this.authService.googleTokenAuth(token);
        return googleToken;
    }

    @Get('FacebookGetInfoByToken')
    async facebookGetInfoByToken(@Res() res: Response, @Query('token') token): Promise<any> {
        return this.authService.facebookTokenAuth(res, token);
    }

}
