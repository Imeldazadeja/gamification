import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {QuestionDataSchema, Quiz} from "../quiz.model";
import {QuizService} from "../quiz.service";
import {MatDialog} from "@angular/material/dialog";
import {FormGroup, NgForm} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-quiz-create',
  templateUrl: './quiz-detail.component.html',
  styleUrls: ['./quiz-detail.component.scss']
})
export class QuizDetailComponent implements OnInit {
  dataSource = new BehaviorSubject<QuestionDataSchema[]>([]);
  quiz: Partial<Quiz> = {};
  form: FormGroup;

  constructor(private quizService: QuizService,
              private dialog: MatDialog,
              private snackbar: MatSnackBar,
              private router: Router,
              public route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(async params => {
      if (params.quizId && params.quizId !== this.quiz._id) {
        this.quiz = await this.quizService.findById(params.quizId);
        this.dataSource.next(this.quiz.child);
      }
    });
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
    if (this.quiz._id) {
      await this.quizService.update({...this.quiz, child: this.dataSource.value});
    } else {
      const quiz = await this.quizService.create({
        title: this.quiz.title,
        child: this.dataSource.value,
        courseId: this.route.snapshot.params.id,
      });
      this.quiz = quiz;
      await this.router.navigate(['quiz', quiz._id]);
    }

    this.snackbar.open('Quiz saved!', null, {duration: 3000});

  }
}
