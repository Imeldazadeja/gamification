import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {BehaviorSubject} from "rxjs";
import {QuestionDataSchema, Quiz} from "../quiz.model";
import {QuizService} from "../quiz.service";
import {ActivatedRoute, ParamMap} from "@angular/router";

@Component({
  selector: 'app-question-dialog',
  templateUrl: './quiz-play.component.html',
  styleUrls: ['./quiz-play.component.scss'],
  animations: [
    trigger('flipCard', [
      state('true', style({
        transform: 'rotateY(180deg)'
      })),
      state('false', style({
        transform: 'rotateY(0)'
      })),
      transition('true => false', animate('800ms ease-out')),
      transition('false => true', animate('800ms ease-out'))
    ])
  ]
})

export class QuizPlayComponent implements OnInit {
  dataSource = new BehaviorSubject<QuestionDataSchema[]>([]);
  prevCard = null;
  isProcessing: boolean = false;
  private quizId: string;
  quiz: Quiz;

  constructor(private quizService: QuizService,
              private activatedRoute: ActivatedRoute) {
  }

  playGame(card) {
    card.isFlipped = !card.isFlipped;
  }


  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('quizId')) {
        this.quizId = paramMap.get("quizId");
        this.quizService.findById(this.quizId).then(quizData => {
          // console.log(quizData);
          console.log(quizData);
          // this.dataSource.next(quizData.child);
          this.dataSource.next([...quizData.child, ...quizData.child, ...quizData.child, ...quizData.child, ...quizData.child, ...quizData.child, ...quizData.child, ...quizData.child, ...quizData.child]);
        });
      }
    });
    // const quiz = await this.quizService.findById(this.quizId);
    //  this.dataSource.next(quiz.child);
  }

}
