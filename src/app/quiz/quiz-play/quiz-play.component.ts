import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {BehaviorSubject} from "rxjs";
import {QuestionDataSchema, QuestionType, Quiz} from "../quiz.model";
import {QuizService} from "../quiz.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {AuthService} from "../../auth/auth.service";
import {CourseService} from "../../courses/course.service";
import {CoreService} from "../../core/core.service";

type QuestionProgress = QuestionDataSchema & { answer?: string | number; opened?: boolean; finished?: boolean };

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
  completed: number;
  isCorrectAnswer: boolean;

  readonly TypeSelect = QuestionType.select;
  readonly TypeText = QuestionType.text;

  constructor(private quizService: QuizService,
              private courseService: CourseService,
              private coreService: CoreService,
              private userService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  playGame(card) {
    card.isFlipped = !card.isFlipped;
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
      if (paramMap.has('quizId')) {
        this.quizId = paramMap.get("quizId");

        const [quiz, course] = await Promise.all([
          this.quizService.findById(this.quizId),
          this.courseService.findById(paramMap.get('id'))
        ]);

        if (!quiz || !course) {
          return this.router.navigate(['..'], {relativeTo: this.activatedRoute});
        }

        this.coreService.setTitleParam('courseName', course.title);
        this.coreService.setTitleParam('quizName', quiz.title);
        this.quiz = quiz;
        this.dataSource.next(quiz.child);

        const myAnswers = quiz.answers?.[this.userService.user._id] || {};
        for (const [questionId, answer] of Object.entries(myAnswers)) {
          const question = this.dataSource.value.find(e => e._id === questionId);
          if (question) {
            question.opened = true;
            if (answer !== null) {
              question.answer = answer;
              question.finished = true;
            }
          }
        }
        const questionsAnswers = this.dataSource.value.reduce((total, elem) => total + (elem.finished ? 1 : 0), 0);
        this.completed = (questionsAnswers / this.dataSource.value.length) * 100;
      }
    });
    // const quiz = await this.quizService.findById(this.quizId);
    //  this.dataSource.next(quiz.child);
  }

  async openQuestion(questionIndex: number): Promise<void> {
    const question = this.dataSource.value[questionIndex];
    await this.quizService.openQuestion({quizId: this.quiz._id, questionId: question._id});
    question.opened = true;
  }

  async postAnswer(questionIndex: number): Promise<void> {
    const question = this.dataSource.value[questionIndex];
    const answer = question.type === QuestionType.text ? (question.answer as string)?.trim() : question.answer;
    if (!answer && answer !== 0) {
      // TODO
    }

    await this.quizService.postAnswer({quizId: this.quiz._id, questionId: question._id, answer});
    question.finished = true;

    this.isCorrectAnswer = question.correctOptionIndex === answer;

    const questionsAnswers = this.dataSource.value.reduce((total, elem) => total + (elem.finished ? 1 : 0), 0);
    this.completed = (questionsAnswers / this.dataSource.value.length) * 100;
  }

  isFocused(element: HTMLElement): boolean {
    return document.activeElement === element;
  }
}
