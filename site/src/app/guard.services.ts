import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { TokenService } from './token.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private token: TokenService) { }

    canActivate() {
        if (this.token.getToken()) {
            return true;
        }
        this.router.navigate(['Account/Login']);
        return false;
    }
}