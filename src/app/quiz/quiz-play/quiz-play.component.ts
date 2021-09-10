import {AfterViewInit, Component, HostBinding, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {BehaviorSubject} from "rxjs";
import {QuestionDataSchema, QuestionType, Quiz} from "../quiz.model";
import {QuizService} from "../quiz.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {AuthService} from "../../auth/auth.service";
import {CourseService} from "../../courses/course.service";
import {CoreService} from "../../core/core.service";
import {UserType} from "../../auth/auth-data.model";
import {Course} from "../../courses/course.model";
import {MatSelectionList, MatSelectionListChange} from "@angular/material/list";

type QuestionProgress = QuestionDataSchema & { answer?: string | number; opened?: boolean; finished?: boolean };

function getQuestionsByStudent(quiz: Quiz, studentId: string): QuestionProgress[] {
  const studentAnswers = quiz.answers?.[studentId] || {};

  return quiz.child.map(question => {
    const _question = {...question} as QuestionProgress;

    if (Object.prototype.hasOwnProperty.call(studentAnswers, question._id)) {
      const answer = studentAnswers[question._id];
      _question.opened = true;
      if (answer !== null) {
        _question.answer = answer;
        _question.finished = true;
      }
    }

    return _question;
  })

  // return Object.entries(studentAnswers).map(([questionId, answer]) => {
  //   const question = {...quiz.child.find(e => e._id === questionId)} as QuestionProgress;
  //   if (question) {
  //     question.opened = true;
  //     if (answer !== null) {
  //       question.answer = answer;
  //       question.finished = true;
  //     }
  //   }
  //
  //   return question;
  // });
}

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
  quiz: Partial<Quiz> = {};
  course?: Course;
  dataSource = new BehaviorSubject<Array<QuestionProgress>>([]);
  prevCard = null;
  isProcessing: boolean = false;
  private quizId: string;

  completed: number;
  isCorrectAnswer: boolean;
  readonly isStudent = this.userService.user.type === UserType.student;

  @HostBinding('class.horizontal') horizontalContainer = !this.isStudent;
  @ViewChild('studentsList', {static: false}) studentsList: MatSelectionList;

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
          this.courseService.findById(paramMap.get('id'), {populate: [{path: 'students'}]})
        ]);

        if (!quiz || !course) {
          return this.router.navigate(['..'], {relativeTo: this.activatedRoute});
        }

        this.coreService.setTitleParam('courseName', course.title);
        this.coreService.setTitleParam('quizName', quiz.title);
        this.quiz = quiz;
        this.course = course;

        if (this.isStudent) {
          this.dataSource.next(getQuestionsByStudent(quiz, this.userService.user._id));
          const questionsAnswers = this.dataSource.value.reduce((total, elem) => total + (elem.finished ? 1 : 0), 0);
          this.completed = (questionsAnswers / this.dataSource.value.length) * 100;
        }

        this.studentsList?.options.changes.subscribe(options => {
          setTimeout(() => {
            if (this.course.students?.length) {
              options?.first?.toggle();
              this.dataSource.next(getQuestionsByStudent(this.quiz as Quiz, this.course.students[0]._id));
            }
          })
        });
      }
    });
  }

  async openQuestion(questionIndex: number): Promise<void> {
    if (!this.isStudent) return;

    const question = this.dataSource.value[questionIndex];
    await this.quizService.openQuestion({quizId: this.quiz._id, questionId: question._id});
    question.opened = true;
  }

  async postAnswer(questionIndex: number): Promise<void> {
    if (!this.isStudent) return;

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

  onReview(i) {
    i.select = !i.select;
  }

  onSelectStudent(change: MatSelectionListChange): void {
    if (!change.options.length) return;
    console.log('student',change.options[0].value);
    this.dataSource.next(getQuestionsByStudent(this.quiz as Quiz, change.options[0].value._id));
  }
}
