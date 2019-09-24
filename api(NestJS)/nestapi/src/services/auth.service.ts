import { Injectable, HttpService } from '@nestjs/common';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { User } from '../models/entity/user.entity';
import * as crypto from 'crypto';
import { map } from 'rxjs/operators';
import { UserDto } from 'src/models/dto/userDto';
var nodemailer = require('nodemailer');
import { ResetPassDto } from 'src/models/dto/resetpassDto';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly httpService: HttpService,
        private readonly config: ConfigService
    ) {  }

    private async validate(userData: UserDto): Promise<User> {
        return await this.userService.findByEmail(userData.email);
    }

    private async dateValidUpdate(user: User): Promise<User> {
        let userDiffDate = user.createOrResetPassDate.getTime() + this.config.MailLinkValid * 60 * 60 * 1000;
        let nowDate = new Date().getTime();
        if (userDiffDate < nowDate) {
            user.createOrResetPassDate = new Date();
            return await this.userService.createOrUpdate(user);
        }
        return user;
    }

    public async login(userDto: UserDto): Promise<any> {
        const user = await this.validate(userDto);
        if (!user) {
            throw new UnauthorizedException('Invalid login attempt!');
        }
        if (user.password !== this.hashPassword(userDto.password)) {
            throw new UnauthorizedException('Invalid password attempt!');
        }
        return this.getAuthToken(user);
    }

    public async register(userDto: UserDto): Promise<any> {
        const emailValid = this.isValidEmail(userDto.email);
        const user = await this.validate(userDto);
        if (!emailValid) {
            throw new UnauthorizedException('Wrong email format!');
        }
        if (user) {
            throw new UnauthorizedException('Invalid login attempt!');
        }
        let newUser = new User();
        newUser.email = userDto.email;
        newUser.password = userDto.password;
        newUser.createOrResetPassDate = new Date();
        let newUserAdded = await this.userService.createOrUpdate(newUser);
        if (newUserAdded) {
            return this.getAuthToken(newUser);
        } else {
            throw new UnauthorizedException('Error write to DataBase')
        }
    }

    public async forgotpass(email: string): Promise<any> {
        const emailValid = this.isValidEmail(email);
        let user = await this.userService.findByEmail(email);
        if (!emailValid) {
            throw new UnauthorizedException('Wrong email format!');
        }
        if (!user) {
            throw new UnauthorizedException('Wrong email. User not found!')
        }
        user.createOrResetPassDate = new Date();
        const updateUser = await this.userService.createOrUpdate(user);
        const code = this.hashPassword(email + updateUser.createOrResetPassDate.toString());
        let transporter = nodemailer.createTransport({
            host: this.config.MailHost,
            port: this.config.MailPort,
            secure: this.config.MailSecure,
            auth: {
                user: this.config.MailUser,
                pass: this.config.MailPass
            }
        });
        let mailOptions = {
            from: '"Peaceofart Gallery" <' + this.config.MailUser + '>',
            to: email,
            subject: 'Frogotten Password',
            text: 'Forgot Password',
            html: 'Hi! <br><br> If you requested to reset your password(Link valid: ' + this.config.MailLinkValid + ' hours)<br><br>' +
                '<a href=' + this.config.HostUrl + ':' + this.config.HostPort + '/Account/ResetPassword?code=' + code + '>Click here</a>'
        };
        return await transporter.sendMail(mailOptions);
    }

    public async resetPass(resetPass: ResetPassDto): Promise<any> {
        const user = await this.userService.findByEmail(resetPass.email);
        if (!user) {
            throw new UnauthorizedException('Wrong email. User not found!')
        }
        const updateUser = await this.dateValidUpdate(user);
        const getHashPass = this.hashPassword(updateUser.email + updateUser.createOrResetPassDate.toString())
        if (getHashPass === resetPass.code) {
            updateUser.password = this.hashPassword(resetPass.password); //resetPass.password
            updateUser.createOrResetPassDate = new Date();
            return await this.userService.createOrUpdate(updateUser);
        }
        throw new UnauthorizedException('Sorry, code was expired or used! Use reset form again.')
    }


    public async googleTokenAuth(token: string): Promise<any> {
        const actionUrl = `https://www.googleapis.com/plus/v1/people/me?access_token=${token}`;
        const email = await this.httpService
            .get(actionUrl)
            .pipe(map(async (response: any) => {
                return response.data['emails'][0]['value'];
            })).toPromise();
        return await this.socialLoginRegistration(email);
    }

    public async facebookTokenAuth(token: string): Promise<any> {
        const actionUrl = `https://graph.facebook.com/v2.8/me?fields=email&access_token=${token}`;
        const email = await this.httpService
            .get(actionUrl)
            .pipe(map(async (response: any) => {
                return response.data['email'];
            })).toPromise();
        return await this.socialLoginRegistration(email);
    }

    private async socialLoginRegistration(email: string) {
        if (email == null) {
            throw new InternalServerErrorException('Error loading external login information!');
        }
        let user = await this.userService.findByEmail(email);
        if (!user) {
            user = new User();
            user.email = email;
            user.password = this.generatePassword(8);
            user.createOrResetPassDate = new Date();
            let newUser = await this.userService.createOrUpdate(user);
            if (newUser) {
                return this.getAuthToken(newUser);
            } else {
                return new InternalServerErrorException('Error write to DataBase');
            }
        }
        return this.getAuthToken(user);
    }

    private getAuthToken(user: User) {
        const payload = { sub: user.id, username: user.email };
        const accessToken = this.jwtService.sign(payload);
        return { access_token: accessToken };
    }

    private generatePassword(length: number) {
        var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    private hashPassword(pass: string) {
        return crypto.createHmac('sha256', pass).digest('hex');
    }

    private isValidEmail(email: string) {
        if (email) {
            var result = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return result.test(email);
        }
        return false
    }
}
