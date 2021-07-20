import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-signup-lecturer',
  templateUrl: './signup-lecturer.component.html',
  styleUrls: ['./signup-lecturer.component.css']
})
export class SignupLecturerComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SignupLecturerComponent>) { }

  ngOnInit(): void {
  }

  async onSignupLecturer(form: NgForm) {
    if(form.invalid){
      return;
    }
    console.log(form);
    this.dialogRef.close(form.value);
  }
}
