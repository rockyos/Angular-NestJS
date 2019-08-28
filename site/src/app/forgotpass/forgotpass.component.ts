import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.css']
})
export class ForgotpassComponent implements OnInit {
  errorMessage: string;
  forgotPassForm: FormGroup;

  constructor(private service: HttpService, private router: Router, private fb: FormBuilder) {
    this.forgotPassForm = this.fb.group({
      forgotEmail: ["", [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
  }

  forgotPassSend(email: string) {
    this.service.forgotPassPost(email).subscribe(resualt =>
      this.router.navigate(['Account/ForgotPasswordConfirmation']),
      error => this.errorMessage = error['error']
    );
  }

}
