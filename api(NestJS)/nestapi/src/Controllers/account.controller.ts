import { Controller, Post, Body, Get, Query, Res, Param } from '@nestjs/common';
import { AuthService } from '../Services/auth.service';
import { UserDto } from 'src/Models/DTO/userDto';
import { Response } from 'express';
import { ResetPassDto } from 'src/Models/DTO/resetpassDto';


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

    @Post('ForgotPassword')
    async forgotPass(@Body('email') email: string): Promise<any> {
        return await this.authService.forgotpass(email);
    }

    @Post('ResetPassword')
    async resetPassPost(@Body() resetPass: ResetPassDto): Promise<any> {
        return await this.authService.resetPass(resetPass);
    }

    @Get('ResetPassword')
    async resetPassGet(@Query('code') code, @Res() res: Response): Promise<any> {
        const redirectUrl = 'http://localhost:4200/Account/ResetPassword?code=' + code;
        return res.redirect(redirectUrl);
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
