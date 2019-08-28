import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private router: Router, private ngZone: NgZone) { }

  tokenKey: string = 'jwt';
  localStorage: boolean = false;

  sessionOrLocalStorage(rememberMe: boolean) {
    this.localStorage = rememberMe;
  }

  loggedOn() {
    var token = this.getToken();
    if (token != null) {
      this.ngZone.run(() => this.router.navigate([''])).then();
    }
  }

  setToken(jwt: string) {
    if (jwt != null) {
      if (this.localStorage) {
        localStorage.setItem(this.tokenKey, jwt);
      } else {
        sessionStorage.setItem(this.tokenKey, jwt);
      }
    }
  }

  getToken(): string {
    var token;
    token = localStorage.getItem(this.tokenKey);
    if (token == null) {
      token = sessionStorage.getItem(this.tokenKey)
    }
    return token;
  }

  logOut() {
    sessionStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['Account/Login']);
  }

  getDecodJWT(): any {
    return jwt_decode(this.getToken());
  }
}
