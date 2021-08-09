import { Component, OnInit } from '@angular/core';
import {QuizService} from "../quiz.service";
import {BehaviorSubject, Subject} from "rxjs";
import { Quiz} from "../quiz.model";
import {filter} from "rxjs/operators";


@Component({
  selector: 'app-quiz-display',
  templateUrl: './quiz-display.component.html',
  styleUrls: ['./quiz-display.component.scss']
})

export class QuizDisplayComponent implements OnInit {
  dataSource = new BehaviorSubject<Quiz[]>([]);
  constructor(private quizService: QuizService) { }

  // async getQuiz() {
  //   const question = await this.quizService.find();
  //   this.dataSource.next(question);
  // }
  async ngOnInit(): Promise<void> {
    const quiz = await this.quizService.find();
    this.dataSource.next(quiz);

    // this.quizTitle = quiz.map(question => question.child.map(el => el.questionTopic))
  }

     async delete(quizId: string) {
      this.quizService.delete(quizId).then(() => {
       this.quizService.find();
     });
  }

}
