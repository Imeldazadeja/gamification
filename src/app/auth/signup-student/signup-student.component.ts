import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth.service";
import {FormsModule, NgForm} from "@angular/forms";

@Component({
  selector: 'app-signup-student',
  templateUrl: './signup-student.component.html',
  styleUrls: ['./signup-student.component.css']
})
export class SignupStudentComponent implements OnInit {

  isLoading = false;
  studyCycle: string;
  studyCycleOptions: string [] = ['Bachelor', 'Master', 'PhD'];

  constructor(public authService: AuthService) { }

  onSignupStudent(form: NgForm) {
    if(form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createStudent(
      form.value.firstName,
      form.value.lastName,
      form.value.email,
      form.value.password,
      form.value.faculty,
      form.value.studyProgramme,
      form.value.studyCycle,
      form.value.registrationDate
    )
    console.log(form);
  }

  ngOnInit(): void {
  }

}
