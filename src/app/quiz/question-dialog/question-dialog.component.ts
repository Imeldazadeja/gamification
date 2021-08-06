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

  questions: FormData[] = [];
  allQuestions: object[];
  ngOnInit(): void {
  }

   onSaveQuestions(form: NgForm) {
    if(form.invalid) {
      return;
    }
    this.questions.push(form.value);
    this.dialogRef.close({...form.value})
  }

  // onQuestionPost(form: NgForm) {
  //   if(form.invalid) {
  //     return;
  //   }
  //   console.log(form);
  //   this.dialogRef.close(form.value)
  // }

}
