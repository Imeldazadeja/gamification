import {Component, OnInit} from '@angular/core';
import {QuizService} from "../quiz.service";
import {BehaviorSubject} from "rxjs";
import {Quiz} from "../quiz.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {CourseService} from "../../courses/course.service";
import {CoreService} from "../../core/core.service";
import {AuthService} from "../../auth/auth.service";
import {UserType} from "../../auth/auth-data.model";


@Component({
  selector: 'app-quiz-display',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})

export class QuizListComponent implements OnInit {
  dataSource = new BehaviorSubject<Quiz[]>([]);
  readonly displayedColumns: string[] = [
    'quizTitle',
    'actions',
  ];
  isRunningQuiz: boolean;
  runningQuizes: Quiz[] = [];

  get isStudent(): boolean {
    return this.authService.user.type === UserType.student;
  }

  constructor(private quizService: QuizService,
              private courseService: CourseService,
              private coreService: CoreService,
              private authService: AuthService,
              private snackbar: MatSnackBar,
              private route: ActivatedRoute) {
  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async params => {
      const [quiz, course] = await Promise.all([
        this.quizService.find({where: {courseId: params.id}}),
        this.courseService.findById(params.id),
      ]);
      this.dataSource.next(quiz);
      this.coreService.setTitleParam('courseName', course.title);
    })
    if (this.isStudent) {
      this.quizService.getRunningQuizes().then(quizzes => {
        this.runningQuizes = quizzes;
      });
    }
  }

  isDisableQuiz(quizId): boolean {
    // return true//TODO uncomment code below
    return this.isStudent?
      this.isRunningQuiz = this.runningQuizes.some(item => item._id === quizId)
      : true
  }

  async delete(quizId: string): Promise<void> {
    const quiz = await this.quizService.delete(quizId);
    this.dataSource.next(this.dataSource.value.filter(item => item._id !== quizId));
    this.snackbar.open('Quiz deleted successfully!', null, {duration: 3000});
  }

  get canEdit(): boolean {
    return this.authService.user.type !== UserType.student;
  }
}
