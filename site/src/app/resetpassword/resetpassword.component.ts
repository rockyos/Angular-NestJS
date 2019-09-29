import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../http.service';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  errorMessage: string;
  resetPassForm: FormGroup;
  code: string;
  email: string;

  constructor(private service: HttpService, private router: Router, private activateRoute: ActivatedRoute, private fb: FormBuilder) {
    this.code = this.activateRoute.snapshot.queryParamMap.get("code");
    this.email = this.activateRoute.snapshot.queryParamMap.get("email");
    this.code = this.code.replace(/\s+/g, '+');
    this.resetPassForm = this.fb.group({
      resPass: ["", Validators.required],
      resPassConfirm: ["", Validators.required]
    }, {validator: this.checkIfMatchingPasswords('resPass', 'resPassConfirm')});
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
  }

  resetPassSend(pass: string){
    this.service.resetPassPost(this.email, pass, this.code).subscribe(resualt => 
      this.router.navigate(['Account/ResetPasswordConfirmation']),
      error => this.errorMessage = error['error']['message']
      );
  }

}
