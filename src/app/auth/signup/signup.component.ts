import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {UserType} from "../auth-data.model";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading = false;
  userType: string;
  userType1 = UserType.student;
  userType2 = UserType.lecturer;
  userTypes = [this.userType1, this.userType2];
  studyCycle: string;
  studyCycleOptions: string [] = ['Bachelor', 'Master', 'PhD'];
  // StudentList -> StudentDetail (edit + new) User.save({...studentForm, type: 'S'})
  // LecturerList -> LecturerDetail (edit + new) User.save({type: 'L'})
  //

  constructor(public authService: AuthService, public dialogRef: MatDialogRef<SignupComponent>) { }

  async onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form.value);
    // await this.authService.signup(form.value);
    // this.router.navigate(['/login']);
    this.dialogRef.close(form.value);
  }

  ngOnInit(): void {
  }

}
