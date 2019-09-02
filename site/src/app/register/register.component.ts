import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TokenService } from '../token.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  errorMessage: string;
  registerForm: FormGroup;
  jwt: string;

  
  constructor(private service: HttpService, private token: TokenService, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      registerEmail: ["", [Validators.required, Validators.email]],
      registerPass: ["", Validators.required],
      registerPassConfirm: ["", Validators.required]
    }, {validator: this.checkIfMatchingPasswords('registerPass', 'registerPassConfirm')});
  }


  private checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      const passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true});
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

 
  ngOnInit() {
    this.token.loggedOn();
  }

  registerSend(email: string, pass: string) {
    this.token.sessionOrLocalStorage(false);
    this.service.registerPost(email, pass).subscribe(resualt => {
      this.jwt = resualt['access_token'],
        this.token.setToken(this.jwt),
        this.token.loggedOn()
    }, error => this.errorMessage = error['error']['message']);
  }
}
