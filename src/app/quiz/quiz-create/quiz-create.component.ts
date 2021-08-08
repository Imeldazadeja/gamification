import { Component, OnInit } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {QuestionDataSchema, Quiz} from "../quiz.model";
import {QuizService} from "../quiz.service";
import {MatDialog} from "@angular/material/dialog";
import {QuestionDialogComponent} from "../question-dialog/question-dialog.component";
import {MatTableDataSource} from "@angular/material/table";
import {NgForm} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-quiz-create',
  templateUrl: './quiz-create.component.html',
  styleUrls: ['./quiz-create.component.scss']
})
export class QuizCreateComponent implements OnInit {
  dataSource = new BehaviorSubject<QuestionDataSchema[]>([]);
  title: string;

  constructor(private quizService: QuizService,
              private dialog: MatDialog,
              private snackbar: MatSnackBar,
              private router: Router) {
  }

  async openAddQuestionDialog(): Promise<void> {
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      width: '500px'
    });
    const result = await dialogRef.afterClosed().toPromise();
    if(!result) return;
    console.log('result', result);
    this.dataSource.next([...this.dataSource.value, result]);

    // await this.quizService.create(result);
    //
    // const quiz = await this.quizService.find();
    // this.dataSource.next(quiz);
  }

  addQuestion(form: NgForm) {
    const question = {...form.value};
    form.resetForm();
    this.dataSource.next([...this.dataSource.value, question]);
    this.snackbar.open('Question added!', null, {duration: 3000});
  }

  removeQuestion(index: number) {
    this.dataSource.next(this.dataSource.value.filter((__, i) => i !== index));
  }

  async save() {
    const quiz = await this.quizService.create({
      title: this.title,
      child: this.dataSource.value,
    });
    this.snackbar.open('Quiz saved!', null, {duration: 3000});
    this.router.navigate(['quiz-display']);
  }

  ngOnInit(): void {
      // this.quizService.find().then(question => {
      //   this.dataSource.next(question);
      // });
    }
}
