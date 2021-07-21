import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading = false;

  constructor(public authService: AuthService, private router: Router) { }

  async onSignup(form: NgForm) {
    if (form.invalid) {
      return
    }
    await this.authService.createUser(form.value)
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
  }

}
