import { Injectable, HttpService } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user.entity';
import { Response } from 'express';
import { strict } from 'assert';

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

    public async login(res: Response, user: User): Promise<any> {
        return this.validate(user).then((userData) => {
            if (!userData) {
                return res.status(401).send('Invalid login attempt!');
            }
            if (userData.password !== user.password) {
                return res.status(401).send('Invalid password attempt!');
            }
            const payload = { sub: user.email };
            const accessToken = this.jwtService.sign(payload);
            return res.status(200).send({ access_token: accessToken });
        });
    }

    public async register(res: Response, user: User): Promise<any> {
        return this.validate(user).then((userData) => {
            if (userData) {
                return res.status(401).send('Account already exist!');
            }
            this.userService.create(user);
            const payload = { sub: user.email };
            const accessToken = this.jwtService.sign(payload);
            return res.status(200).send({ access_token: accessToken });
        });
    }

    // public async googleTokenAuth(res: Response, token: string): Promise<any> {
    //     let email: string;
    //     this.httpService.get(`https://www.googleapis.com/plus/v1/people/me?access_token=${token}`).subscribe(resualt => {
    //         email = resualt['data']['emails'][0]['value'], console.log("Get: ", email)
    //     });

    //     console.log("In next:", email);
    //     if (email == null) {
    //         return res.status(500).send('Error loading external login information!');
    //     }
    //     return this.userService.findByEmail(email).then((userData) => {
    //         if (!userData) {
    //             userData.email = email;
    //             userData.password = this.generatePassword();
    //             this.userService.create(userData);
    //         }
    //         const payload = { sub: userData.email };
    //         const accessToken = this.jwtService.sign(payload);
    //         return res.status(200).send({ access_token: accessToken });
    //     });
    // }

    public async googleTokenAuth(res: Response, token: string): Promise<any> {
        let email: string;
        this.httpService.get(`https://www.googleapis.com/plus/v1/people/me?access_token=${token}`).subscribe(resualt => {
            email = resualt['data']['emails'][0]['value'], this.socialLoginRegistration(res, email)
        });
    }

    public async facebookTokenAuth(res: Response, token: string): Promise<any> {
        let email: string;
        this.httpService.get(`https://graph.facebook.com/v2.8/me?fields=email&access_token=${token}`).subscribe(resualt => {
            email = resualt['data']['email'], this.socialLoginRegistration(res, email)
        });
    }

    private socialLoginRegistration(res: Response, email: string) {
        if (email == null) {
            return res.status(500).send('Error loading external login information!');
        }
        return this.userService.findByEmail(email).then((userData) => {
            if (!userData) {
                userData.email = email;
                userData.password = this.generatePassword();
                this.userService.create(userData);
            }
            const payload = { sub: userData.email };
            const accessToken = this.jwtService.sign(payload);
            return res.status(200).send({ access_token: accessToken });
        });
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
