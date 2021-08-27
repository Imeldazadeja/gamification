import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {BehaviorSubject} from "rxjs";
import {AnswerQuestion, QuestionDataSchema, Quiz} from "../quiz.model";
import {QuizService} from "../quiz.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";

type QuestionProgress = QuestionDataSchema & { answerText?: string; opened?: boolean; finished?: boolean };

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
  dataSource = new BehaviorSubject<Array<QuestionProgress>>([]);
  prevCard = null;
  isProcessing: boolean = false;
  private quizId: string;
  quiz: Partial<Quiz> = {};

  constructor(private quizService: QuizService,
              private userService: AuthService,
              private activatedRoute: ActivatedRoute) {
  }

  playGame(card) {
    card.isFlipped = !card.isFlipped;
  }


  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('quizId')) {
        this.quizId = paramMap.get("quizId");
        this.quizService.findById(this.quizId).then(quiz => {
          this.quiz = quiz;
          this.dataSource.next(quiz.child);

          const myAnswers = quiz.answers?.[this.userService.user._id] || {};
          for (const [questionId, answer] of Object.entries(myAnswers)) {
            const question = this.dataSource.value.find(e => e._id === questionId);
            if (question) {
              question.opened = true;
              if (answer) {
                question.answerText = answer;
                question.finished = true;
              }
            }
          }

          // const ;'#
          // this.dataSource.next([...quiz.child, ...quiz.child, ...quiz.child, ...quiz.child, ...quiz.child, ...quiz.child, ...quiz.child, ...quiz.child, ...quiz.child]);
        });
      }
    });
    // const quiz = await this.quizService.findById(this.quizId);
    //  this.dataSource.next(quiz.child);
  }

  async addAnswer(form: NgForm) {
    //  const answer = {...form.value};
    // form.resetForm();
    // this.dataSource.next([...this.dataSource.value, answer]);
    // const answers = await this.quizService.create({
    //   child: [this.quiz],
    // });
    // this.quiz = answers;
  }

  async openQuestion(questionIndex: number): Promise<void> {
    const question = this.dataSource.value[questionIndex];
    await this.quizService.openQuestion({quizId: this.quiz._id, questionId: question._id});
    question.opened = true;
  }

  async postAnswer(questionIndex: number): Promise<void> {
    const question = this.dataSource.value[questionIndex];
    const answer = question.answerText?.trim()
    if (!answer) {
      // TODO
    }

    await this.quizService.postAnswer({quizId: this.quiz._id, questionId: question._id, answer});
    question.finished = true;
  }

  isFocused(element: HTMLElement): boolean {
    return document.activeElement === element;
  }
}
