import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {Quiz} from "../quiz.model";
import {QuizService} from "../quiz.service";
import {MatDialog} from "@angular/material/dialog";
import {QuestionDialogComponent} from "../question-dialog/question-dialog.component";

@Component({
  selector: 'app-quiz-create',
  templateUrl: './quiz-create.component.html',
  styleUrls: ['./quiz-create.component.css']
})
export class QuizCreateComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  questionNo: number[] = [16, 25, 36];
  isEditable = false;
  readonly columns = ['questionTopic', 'question', 'actions'];
  dataSource = new BehaviorSubject<Quiz[]>([]);

  constructor(private _formBuilder: FormBuilder,
              private quizService: QuizService,
              private dialog: MatDialog) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      quizTitle: ['', Validators.required],
      quizQuestions: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      question: ['', Validators.required]
    });

    this.quizService.find().then(question => {
      this.dataSource.next(question);
    });
  }

  async openAddQuestionDialog(): Promise<void> {
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      width: '500px'
    });
    const result = await dialogRef.afterClosed().toPromise();
    if(!result) return;

    await this.quizService.create(result);

    const quiz = await this.quizService.find();
    this.dataSource.next(quiz);
  }

  // async onSubmitForm(form: NgForm) {
  //   if(form.invalid) {
  //     return;
  //   }
  //   await this.quizService.create(form.value);
  // }

}
