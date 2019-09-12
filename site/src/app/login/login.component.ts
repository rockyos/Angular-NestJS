import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpService } from '../http.service';
import { environment } from 'src/environments/environment.prod';
import { TokenService } from '../token.service';
import { Router } from '@angular/router';
import { AuthService } from "angular2-social-login"


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage: string;
  url = `${environment.apiUrl}`;
  clientUrl = `${environment.clientUrl}`;
  loginForm: FormGroup;
  jwt: string;
  user: any;
  rememberMe: boolean = false;

  constructor(private service: HttpService, private token: TokenService, private router: Router, private fb: FormBuilder, private _auth: AuthService) {
    this.loginForm = this.fb.group({
      userEmail: ["", [Validators.required, Validators.email]],
      userPassword: ["", Validators.required],
      userCheckbox: [false]
    });
  }

  ngOnInit() {
    this.token.loggedOn();
  }

  loginSend(email: string, pass: string) {
    this.rememberMe = this.loginForm.controls['userCheckbox'].value;
    this.token.sessionOrLocalStorage(this.rememberMe);
    this.service.loginPost(email, pass).subscribe(resualt => { 
       this.jwt = resualt['access_token'],
         this.token.setToken(this.jwt),
         this.token.loggedOn();
    }, error => this.errorMessage = error['error']['message']);
  }


  googleBtn() {
    this._auth.login("google").subscribe(
      resualt => {
        this.user = resualt; 
        if (this.user['token'] != null) {
          this.service.googleToken(this.user['token']).subscribe(resualt => {
            this.jwt = resualt['access_token'],
              this.token.setToken(this.jwt),
              this.token.loggedOn()
          }, error => {
          error['error'] === "401 Unauthorized" ? this.router.navigate(['Account/RegisterExternal']) : null,
            typeof error['error'] === 'string' ? this.errorMessage = error['error'] : this.errorMessage = "error"
          });
        }
      }, error => {
        typeof error['error'] === 'string' ? this.errorMessage = error['error'] : this.errorMessage = "error"
      }
    )
  }

  facebookBtn() {
    this._auth.login("facebook").subscribe( resualt => {
      this.user = resualt;
      if (this.user['token'] != null) {
        this.service.facebookToken(this.user['token']).subscribe(resualt => {
          this.jwt = resualt['access_token'], 
            this.token.setToken(this.jwt),
            this.token.loggedOn()
        }, error => {
        error['error'] === "401 Unauthorized" ? this.router.navigate(['Account/RegisterExternal']) : null,
          typeof error['error'] === 'string' ? this.errorMessage = error['error'] : this.errorMessage = "error"
        });
      }
    }, error => {
      typeof error['error'] === 'string' ? this.errorMessage = error['error'] : this.errorMessage = "error"
    }
    )
  }
}
