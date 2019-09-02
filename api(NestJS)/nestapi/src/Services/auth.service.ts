import { Injectable, HttpService } from '@nestjs/common';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { User } from '../Models/Entity/user.entity';
import * as crypto from 'crypto';
import { map } from 'rxjs/operators';
import { UserDto } from 'src/Models/DTO/userDto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly httpService: HttpService
    ) { }


    private hashPassword(pass: string) {
        return crypto.createHmac('sha256', pass).digest('hex');
    }

    private async validate(userData: UserDto): Promise<User> {
        return await this.userService.findByEmail(userData.email);
    }

    public async login(userDto: UserDto): Promise<any> {
        return await this.validate(userDto).then((userData) => {
            if (!userData) {
                throw new UnauthorizedException('Invalid login attempt!')
            }
            if (userData.password !== this.hashPassword(userDto.password)) {
                throw new UnauthorizedException('Invalid password attempt!');
            }
            return this.getAuthToken(userDto);
        });
    }

    public async register(userDto: UserDto): Promise<any> {
        return await this.validate(userDto).then(async(userData) => {
            if (userData) {
                throw new UnauthorizedException('Invalid login attempt!')
            }
            let newUser = new User();
            newUser.email = userDto.email;
            newUser.password = userDto.password;
            let newUserAdded = await this.userService.create(newUser);
            if(newUserAdded){
                return this.getAuthToken(newUser);
            } else {
                throw new UnauthorizedException('Error write to DataBase')
            }
         
        });
    }


    public async googleTokenAuth(token: string): Promise<any> {
        const actionUrl = `https://www.googleapis.com/plus/v1/people/me?access_token=${token}`;
        const email = await this.httpService
            .get(actionUrl)
            .pipe(map(async (response: any) => {
                return response.data['emails'][0]['value'];
            })).toPromise();
        const result = await this.socialLoginRegistration(email)
        return result;
    }

    public async facebookTokenAuth(token: string): Promise<any> {
        const actionUrl = `https://graph.facebook.com/v2.8/me?fields=email&access_token=${token}`;
        const email = await this.httpService
            .get(actionUrl)
            .pipe(map(async (response: any) => {
                return response.data['email'];
            })).toPromise();
        const result = await this.socialLoginRegistration(email)
        return result;
    }

    private async socialLoginRegistration(email: string) {
        if (email == null) {
            throw new InternalServerErrorException('Error loading external login information!');
        }
        let user = await this.userService.findByEmail(email);
        if (!user) {
            user = new User();
            user.email = email;
            user.password = this.generatePassword();
            let newUser = await this.userService.create(user);
            if (newUser) {
                return this.getAuthToken(newUser);
            } else {
                return new InternalServerErrorException('Error write to DataBase');
            }
        }
        return this.getAuthToken(user);
    }

    private getAuthToken(userDto: UserDto) {
        const payload = { sub: userDto.email };
        const accessToken = this.jwtService.sign(payload);
        return { access_token: accessToken };
    }

    private generatePassword() {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

}
