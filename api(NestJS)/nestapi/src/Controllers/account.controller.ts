import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AuthService } from '../Services/auth.service';
import { UserDto } from 'src/Models/DTO/userDto';


@Controller('Account')
export class AccountController {
    constructor(private readonly authService: AuthService) { }

    @Post('Register')
    async register(@Body() userDto: UserDto): Promise<any> {
        return await this.authService.register(userDto);
    }

    @Post('Login')
    async login(@Body() userDto: UserDto): Promise<any> {
        return await this.authService.login(userDto);
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
