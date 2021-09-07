import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Quiz} from "../quiz.model";
import {QuizService} from "../quiz.service";
import {CourseService} from "../../courses/course.service";
import {CoreService} from "../../core/core.service";
import {BehaviorSubject} from "rxjs";
import {Course} from "../../courses/course.model";

@Component({
  selector: 'app-quiz-review',
  templateUrl: './quiz-review.component.html',
  styleUrls: ['./quiz-review.component.scss']
})
export class QuizReviewComponent implements OnInit {

  private quizId: string;
  quiz: Partial<Quiz> = {};
  course: Partial<Course>;
  dataSource = new BehaviorSubject<string[]>([]);
  readonly displayedColumns: string[] = [
    'studentsFirstName',
    'studentsLastName',
    'actions',
  ]

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private quizService: QuizService,
              private courseService: CourseService,
              private coreService: CoreService) { }

  async ngOnInit(): Promise<void> {
    this.activatedRoute.paramMap.subscribe(async (paramMap: ParamMap) => {
      if(paramMap.has('quizId')) {
        this.quizId = paramMap.get("quizId");

        const [quiz, course] = await Promise.all([
          this.quizService.findById(this.quizId),
          this.courseService.findById(paramMap.get('id'))
        ]);

        if(!quiz || !course) {
          return this.router.navigate(['..'], {relativeTo: this.activatedRoute});
        }

        this.coreService.setTitleParam('courseName', course.title);
        this.coreService.setTitleParam('quizName', quiz.title);
        this.quiz = quiz;
        this.course = course;
        this.dataSource.next(course.usersId);
      }
    });
  }

}
