import { Injectable, HttpService } from '@nestjs/common';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user.entity';

import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly httpService: HttpService
    ) { }

    private async validate(userData: User): Promise<User> {
        return await this.userService.findByEmail(userData.email);
    }

    public async login(user: User): Promise<any> {
        return await this.validate(user).then((userData) => {
            if (!userData) {
                throw new UnauthorizedException('Invalid login attempt!')
            }
            if (userData.password !== user.password) {
                throw new UnauthorizedException('Invalid password attempt!');
            }
            return this.getAuthToken(user);
        });
    }

    public async register(user: User): Promise<any> {
        return await this.validate(user).then((userData) => {
            if (userData) {
                throw new UnauthorizedException('Invalid login attempt!')
            }
            let newUser = new User();
            newUser.email = user.email;
            newUser.password = user.password;
            this.userService.create(newUser);
            return this.getAuthToken(newUser);
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
            this.userService.create(user);
        }
        return this.getAuthToken(user);
    }

    private getAuthToken(user: User) {
        const payload = { sub: user.email };
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
