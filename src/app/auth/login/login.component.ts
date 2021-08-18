import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  hide = true;

  constructor(public authService: AuthService, public router: Router) { }

  async onLogin (form: NgForm) {
    if(form.invalid) {
      console.log('invalid form');
      return;
    }
    await this.authService.login({...form.value});
  }

  setErrorFalse() {
    this.authService.loginError = false;
  }

  ngOnInit(): void {
  }

}
