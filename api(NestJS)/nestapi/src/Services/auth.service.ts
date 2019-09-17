import { Injectable, HttpService } from '@nestjs/common';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { User } from '../Models/Entity/user.entity';
import * as crypto from 'crypto';
import { map } from 'rxjs/operators';
import { UserDto } from 'src/Models/DTO/userDto';
//import { nodemailer } from 'nodemailer'
var nodemailer = require('nodemailer');
import { ResetPassDto } from 'src/Models/DTO/resetpassDto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly httpService: HttpService
    ) { }

    private async validate(userData: UserDto): Promise<User> {
        return await this.userService.findByEmail(userData.email);
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
        let newUserAdded = await this.userService.create(newUser);
        if (newUserAdded) {
            return this.getAuthToken(newUser);
        } else {
            throw new UnauthorizedException('Error write to DataBase')
        }
    }

    public async forgotpass(email: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Wrong email. User not found!')
        }
        const code = this.hashPassword(email);
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, 
            auth: {
                user: "peaceartgallery2019@gmail.com",
                pass: "Peaceofart_gallery1983"
            }
        });
        let mailOptions = {
            from: '"Peaceofart Gallery" <' + 'peaceartgallery2019@gmail.com' + '>',
            to: email, 
            subject: 'Frogotten Password',
            text: 'Forgot Password',
            html: 'Hi! <br><br> If you requested to reset your password<br><br>' +
                '<a href=' + 'http://localhost' + ':' + 3000 + '/Account/ResetPassword?code=' + code + '>Click here</a>'
        };
        const sended = await new Promise<boolean>(async function (resolve, reject) {
            return await transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                   // console.log('Message sent: %s', error);
                    return reject(false);
                }
               // console.log('Message sent: %s', info.messageId);
                resolve(true);
            });
        })
        return sended;
    }

    public async resetPass(resetPass: ResetPassDto): Promise<any>{

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
            let newUser = await this.userService.create(user);
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
