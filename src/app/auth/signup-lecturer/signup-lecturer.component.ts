import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth.service";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup-lecturer',
  templateUrl: './signup-lecturer.component.html',
  styleUrls: ['./signup-lecturer.component.css']
})
export class SignupLecturerComponent implements OnInit {

  isLoading = false;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSignupLecturer(form: NgForm) {
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.createLecturer(
      form.value.firstName,
      form.value.lastName,
      form.value.email,
      form.value.password,
      form.value.faculty
    )
    console.log(form);
  }

}
