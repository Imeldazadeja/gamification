import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-question-dialog',
  templateUrl: './question-dialog.component.html',
  styleUrls: ['./question-dialog.component.scss']
})
export class QuestionDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<QuestionDialogComponent>) { }

  ngOnInit(): void {
  }

  onQuestionPost(form: NgForm) {
    if(form.invalid) {
      return;
    }
    console.log(form);
    this.dialogRef.close(form.value)
  }

}
