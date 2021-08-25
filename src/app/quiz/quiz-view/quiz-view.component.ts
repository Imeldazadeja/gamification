import { Component, OnInit } from '@angular/core';
import {QuizService} from "../quiz.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {QuestionDataSchema, Quiz} from "../quiz.model";

@Component({
  selector: 'app-quiz-view',
  templateUrl: './quiz-view.component.html',
  styleUrls: ['./quiz-view.component.scss']
})
export class QuizViewComponent implements OnInit {

  constructor(private quizService: QuizService,
              private activatedRoute: ActivatedRoute) { }
  panelOpenState = false;
  private quizId: string;
  quiz: Quiz;
  dataSource = new BehaviorSubject<QuestionDataSchema[]>([]);

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('quizId')) {
        this.quizId = paramMap.get("quizId");
        this.quizService.findById(this.quizId).then(quizData => {
          console.log(quizData);
          this.dataSource.next([...quizData.child]);
        });
      }
    });
  }

}
