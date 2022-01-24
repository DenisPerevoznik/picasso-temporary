import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent implements OnInit {

  loader = false;
  errorMsg = '';
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
  });
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  loginSubmit(){
    if (this.loginForm.invalid) return;

    this.loader = true;
    this.errorMsg = '';
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
      .pipe(finalize(() => {this.loader = false}))
      .subscribe(() => {
        // this.router.navigate(['']);
      }, response => {
        this.errorMsg = response.error.message;
      })
  }
}
