import {Component, OnInit} from '@angular/core';
import {QuizService} from "../quiz.service";
import {BehaviorSubject, Subject} from "rxjs";
import {Quiz} from "../quiz.model";
import {filter} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {CourseService} from "../../courses/course.service";
import {CoreService} from "../../core/core.service";


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

  constructor(private quizService: QuizService,
              private courseService: CourseService,
              private coreService: CoreService,
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
  }

  async delete(quizId: string): Promise<void> {
    const quiz = await this.quizService.delete(quizId);
    this.dataSource.next(this.dataSource.value.filter(item => item._id !== quizId));
    this.snackbar.open('Quiz deleted successfully!', null, {duration: 3000});
  }
}