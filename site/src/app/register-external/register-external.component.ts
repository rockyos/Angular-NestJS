import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-register-external',
  templateUrl: './register-external.component.html',
  styleUrls: ['./register-external.component.css']
})
export class RegisterExternalComponent implements OnInit {

  errorMessage: string;
  registerextForm: FormGroup;
  jwt: string;

  constructor(private service: HttpService, private router: Router,  private token: TokenService, private fb: FormBuilder) {
    this.registerextForm = this.fb.group({
      registerextEmail: ["", [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
  }

  registerExtSend(email: string) {
    this.token.sessionOrLocalStorage(false);
    this.service.registerExtPost(email).subscribe(resualt =>{
        this.jwt = resualt,
          this.token.setToken(this.jwt),
          this.token.loggedOn()
      }, error => { typeof error['error'] === 'string' ? this.errorMessage = error['error'] : this.errorMessage = "error" }
    );
  }

}
