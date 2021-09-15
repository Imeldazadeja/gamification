import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatExpansionPanel} from "@angular/material/expansion";
import {MatDialog} from "@angular/material/dialog";
import {FormGroup, NgForm} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {QuestionDataSchema, QuestionType, Quiz} from "../quiz.model";
import {QuizService} from "../quiz.service";
import {CourseService} from "../../courses/course.service";
import {CoreService} from "../../core/core.service";

@Component({
  selector: 'app-quiz-create',
  templateUrl: './quiz-detail.component.html',
  styleUrls: ['./quiz-detail.component.scss']
})
export class QuizDetailComponent implements AfterViewInit, OnInit {
  @ViewChild('addQuestionExpansionPanel') addQuestionExpansionPanel: MatExpansionPanel;
  dataSource = new BehaviorSubject<QuestionDataSchema[]>([]);
  quiz: Partial<Quiz> = {};

  form: FormGroup;
  readonly TypeSelect = QuestionType.select;
  readonly TypeText = QuestionType.text;
  questionType = QuestionType.select;
  currentOptionText = '';
  correctOptionIndex = 0;
  currentOptions: string[] = [];

  quizDate = new Date();
  startTime: any;
  endTime: any;
  @ViewChild('quizForm') quizForm?: NgForm;

  constructor(private quizService: QuizService,
              private courseService: CourseService,
              private coreService: CoreService,
              private dialog: MatDialog,
              private snackbar: MatSnackBar,
              private router: Router,
              public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(async params => {
      if (params.quizId && params.quizId !== this.quiz?._id) {
        const [quiz, course] = await Promise.all([
          this.quizService.findById(params.quizId).catch(() => null),
          this.courseService.findById(params.id).catch(() => null),
        ]);
        if (!quiz || !course) {
          return this.router.navigate(['..'], {relativeTo: this.route});
        }

        this.quiz = quiz;
        this.dataSource.next(this.quiz.child);
        this.coreService.setTitleParam('courseName', course.title)
        this.coreService.setTitleParam('quizName', quiz.title);
      }
    });
  }

  ngAfterViewInit() {
    // this.route.params.subscribe(async params => {
    //   if (!(params.quizId && params.quizId !== this.quiz._id)) {
    //     this.addQuestionExpansionPanel.open();
    //   }
    // });
  }

  validateDate() {
    if (!this.quizForm) return;
    if (!this.quizDate) return;

    if (this.quizDate.getTime() < Date.now() ) {
      this.quizForm.control.get('appointmentDate')?.setErrors({wrongDate: true});
    }
  }

  validateTime() {
    if (!this.quizForm) return;
    if (!this.startTime || !this.endTime) return;
    const startTime = this.startTime.split(':');
    const endTime = this.endTime.split(':');
    const startTimeDate = new Date(0, 0 , 0 , startTime[0], startTime[1]);
    const endTimeDate =  new Date(0, 0 , 0 , endTime[0], endTime[1]);

    if (startTimeDate.getTime() >= endTimeDate.getTime()) {
      this.quizForm.control.get('endTime')?.setErrors({endTimeHigher: true})
    } else {
      this.quizForm.control.get('endTime')?.setErrors(null);
    }
  }

  addQuestion(form: NgForm) {
    if (form.invalid) return;
    const question = {...form.value};
    form.resetForm();
    if (question.type === QuestionType.select) {
      question.options = this.currentOptions;
      question.correctOptionIndex = this.correctOptionIndex;
      delete question.optionText;
    }

    this.questionType = QuestionType.select;
    this.currentOptions = [];
    this.currentOptionText = '';
    this.correctOptionIndex = 0;
    this.dataSource.next([...this.dataSource.value, question]);
    this.snackbar.open('Question added!', null, {duration: 3000});
  }

  removeQuestion(index: number) {
    this.dataSource.next(this.dataSource.value.filter((__, i) => i !== index));
  }

  addNewOption() {
    if(this.currentOptionText) {
      this.currentOptions.push(this.currentOptionText);
    }
    this.currentOptionText = '';
  }

  deleteOption() {
    this.currentOptions.pop();
  }

  async save(form: NgForm) {
    if (this.quiz._id) {
      await this.quizService.update({...this.quiz, child: this.dataSource.value});
    } else {
      const quiz = await this.quizService.create({
        title: this.quiz.title,
        quizDate: form.value.quizDate,
        child: this.dataSource.value,
        courseId: this.route.snapshot.params.id,
      });
      this.quiz = quiz;
      await this.router.navigate(['courses', this.route.snapshot.params.id]);
    }

    this.snackbar.open('Quiz saved!', null, {duration: 3000});

  }
}
