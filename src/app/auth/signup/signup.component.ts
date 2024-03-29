import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm, NgModel} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {UserDescriptions, UserType} from "../auth-data.model";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  isLoading = false;
  userType: string;
  hidePass = true;
  hideRepeatPass = true;

  // Min. 8 chars, 1 between !$%&?@#, 1 num and 1 capital letter
  passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\S)(?=.*[!$%&?@#])([\S!$%&?@#]{8,})$/;

  @ViewChild('signupForm') signupForm!: NgForm;
  @ViewChild('passwordControl', {read: NgModel}) passwordControl?: NgModel;
  userTypes = Object.entries(UserDescriptions).filter(([id]) => id !== UserType.admin).map(([id, name]) => ({
    id,
    name
  }));
  studyCycle: string;
  studyCycleOptions: string [] = ['Bachelor', 'Master', 'PhD'];
  // StudentList -> StudentDetail (edit + new) User.save({...studentForm, type: 'S'})
  // LecturerList -> LecturerDetail (edit + new) User.save({type: 'L'})
  //

  constructor(
    public authService: AuthService,
    public dialogRef: MatDialogRef<SignupComponent>,
    private router: Router) {
    dialogRef.disableClose = true;
  }

  async onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // console.log(form.value);
    // await this.authService.signup(form.value);
    // this.router.navigate(['/login']);
    this.dialogRef.close(form.value);
  }

  onConfirmPassword() {
    if(this.signupForm.form.value.password !== this.signupForm.form.value.confirmPassword) {
      this.signupForm.controls['confirmPassword']?.setErrors({'notEqual': true});
    }
  }

  getConfirmPasswordErrorDescription(passwordControl: NgModel): string {
    if(passwordControl.errors?.notEqual){
      return 'Passwords must match!'
    } else {
      return 'This is a required field!'
    }
  }



  ngOnInit(): void {
  }

}
