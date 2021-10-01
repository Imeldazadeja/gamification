import {Component, HostBinding, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {BehaviorSubject} from "rxjs";
import {QuestionDataSchema, QuestionType, Quiz} from "../quiz.model";
import {QuizService} from "../quiz.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {AuthService} from "../../auth/auth.service";
import {CourseService} from "../../courses/course.service";
import {CoreService} from "../../core/core.service";
import {User, UserType} from "../../auth/auth-data.model";
import {Course} from "../../courses/course.model";
import {MatSelectionList, MatSelectionListChange} from "@angular/material/list";
import {MatDialog} from "@angular/material/dialog";
import {StartQuizDialogComponent} from "./start-quiz-dialog/start-quiz-dialog.component";
import {EvaluateQuestionDialogComponent} from "./evaluate-question-dialog/evaluate-question-dialog.component";

type QuestionProgress = QuestionDataSchema & {
  answer?: string | number;
  opened?: boolean;
  finished?: boolean;
  result?: number;
};

function getQuestionsByStudent(quiz: Quiz, studentId: string): QuestionProgress[] {
  const studentAnswers = quiz.answers?.[studentId] || {};
  const results = quiz.points?.[studentId] || {};

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

    if (Object.prototype.hasOwnProperty.call(results, question._id)) {
      _question.result = results[question._id];
    }

    return _question;
  })
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
  readonly TypeSelect = QuestionType.select;
  readonly TypeText = QuestionType.text;
  readonly isStudent = this.userService.user.type === UserType.student;
  readonly isLecturer = this.userService.user.type === UserType.lecturer;

  private quizId: string;

  quiz: Partial<Quiz> = {};
  course?: Course;
  dataSource = new BehaviorSubject<Array<QuestionProgress>>([]);
  prevCard = null;
  isProcessing: boolean = false;
  selectedStudent?: User;

  completed: number;
  isCorrectAnswer: boolean;
  isRunningQuiz: boolean;
  runningQuizes: Quiz[] = [];

  @HostBinding('class.horizontal') horizontalContainer = !this.isStudent;
  @ViewChild('studentsList', {static: false}) studentsList: MatSelectionList;
  @ViewChild('stopQuizDialogTemplate') private _stopQuizDialogTemplate: TemplateRef<any>;


  get isQuizStarted(): boolean {
    return !!this.quiz.startTime;
  }

  constructor(private quizService: QuizService,
              private courseService: CourseService,
              private coreService: CoreService,
              private userService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog) {
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
          this.completed = (questionsAnswers / this.quiz.numQuestions) * 100;
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
    if (this.isStudent) {
      this.quizService.getRunningQuizes().then(quizzes => {
        this.runningQuizes = quizzes;
      });
    }
  }

  async openQuestion(questionIndex: number): Promise<void> {
    if (!this.isStudent) return;
    const questionsOpened = this.dataSource.value.reduce((total, elem) => total + (elem.opened ? 1 : 0), 0);
    if(questionsOpened < this.quiz.numQuestions) {
      const question = this.dataSource.value[questionIndex];
      await this.quizService.openQuestion({quizId: this.quiz._id, questionId: question._id});
      question.opened = true;
    }
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


    const questionsAnswers = this.dataSource.value.reduce((total, elem) => total + (elem.finished ? 1 : 0), 0);
    this.completed = (questionsAnswers / this.quiz.numQuestions) * 100;
  }

  correctAnswer(questionIndex: number): boolean {
    const question = this.dataSource.value[questionIndex];
    if(question.type === QuestionType.select && question.answer !== undefined && question.finished) {
      return question.correctOptionIndex === question.answer;
    }
  }

  // async postScore(form: NgForm): Promise<void> {
  //   if(form.invalid) return;
  //   const points = {...form.value};
  //   await this.quizService.postScore({quizId: this.quiz._id, points});
  // }

  isFocused(element: HTMLElement): boolean {
    return document.activeElement === element;
  }

  onReview(i) {
    i.select = !i.select;
  }

  isDisableQuiz(quizId): boolean {
    return true; // TODO remove
    // return this.isStudent?
    //   this.isRunningQuiz = this.runningQuizes.some(item => item._id === quizId)
    //   : true
  }

  isCompletingQuiz(quizId): boolean {
    return this.isLecturer ?
      this.isRunningQuiz = this.runningQuizes.some(item => item._id === quizId)
      : true
  }

  onSelectStudent(change: MatSelectionListChange): void {
    if (!change.options.length) return;
    console.log('student', change.options[0].value);
    this.selectedStudent = change.options[0].value;
    this.dataSource.next(getQuestionsByStudent(this.quiz as Quiz, change.options[0].value._id));
  }

  numberOfQuestionsCompleted(studentId: string): number {
    return Object.values(this.quiz.answers[studentId] || {}).filter(item => item !== null).length;
  }

  questionNeedsAction(question: QuestionProgress): boolean {
    return question.type === QuestionType.text ? question.finished && !Number.isInteger(question.result) : false;
  }

  async openEvaluateQuestion(question: QuestionProgress): Promise<void> {
    const result: number = await this.dialog.open(EvaluateQuestionDialogComponent, {
      width: '450px',
      height: '330px',
      data: question,
    }).afterClosed().toPromise();
    if (!Number.isInteger(result)) return;

    await this.quizService.postScore({
      quizId: this.quiz._id,
      questionId: question._id,
      studentId: this.selectedStudent._id,
      points: result,
    });
  }

  async openStartQuizDialog(): Promise<void> {
    const result = await this.dialog.open(StartQuizDialogComponent, {
      width: '450px',
      height: '330px'
    }).afterClosed().toPromise();
    if (!result) return;

    const {start, end}: { start: Date; end: Date } = result;
    await this.quizService.start(this.quiz._id, start, end);
    this.quiz.startTime = start.toISOString();
    this.quiz.endTime = end.toISOString();
    // TODO popup
  }

  async stopQuiz(): Promise<void> {
    const confirm = await this.dialog.open(this._stopQuizDialogTemplate, {}).afterClosed().toPromise();
    if (!confirm) return;

    await this.quizService.stop(this.quiz._id);
    delete this.quiz.startTime;
    delete this.quiz.endTime;
  }
}
