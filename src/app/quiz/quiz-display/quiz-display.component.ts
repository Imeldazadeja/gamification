import { Component, OnInit } from '@angular/core';
import {QuizService} from "../quiz.service";
import {BehaviorSubject, Subject} from "rxjs";
import { Quiz} from "../quiz.model";
import {filter} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'app-quiz-display',
  templateUrl: './quiz-display.component.html',
  styleUrls: ['./quiz-display.component.scss']
})

export class QuizDisplayComponent implements OnInit {
  dataSource = new BehaviorSubject<Quiz[]>([]);
  constructor(private quizService: QuizService,
              private snackbar: MatSnackBar) { }

  async ngOnInit(): Promise<void> {
    const quiz = await this.quizService.find();
    this.dataSource.next(quiz);

    // this.quizTitle = quiz.map(question => question.child.map(el => el.questionTopic))
  }

   async delete(quizId: string): Promise<void> {
      const quiz = await this.quizService.delete(quizId);
      this.dataSource.next(this.dataSource.value.filter(item => item._id !== quizId));
      this.snackbar.open('Quiz deleted successfully!', null, {duration: 3000});
   }
}