import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-signup-student',
  templateUrl: './signup-student.component.html',
  styleUrls: ['./signup-student.component.css']
})
export class SignupStudentComponent implements OnInit {
  studyCycle: string;
  studyCycleOptions: string [] = ['Bachelor', 'Master', 'PhD'];

  constructor(public dialogRef: MatDialogRef<SignupStudentComponent>) {
  }

  onSignupStudent(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form);
    this.dialogRef.close(form.value);
  }

  ngOnInit(): void {
  }

}