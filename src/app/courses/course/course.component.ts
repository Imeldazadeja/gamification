import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {BehaviorSubject, Observable} from "rxjs";
import {AuthService} from "../../auth/auth.service";
import {FormControl, NgForm} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from "rxjs/operators";
import {CourseService} from "../course.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User, UserType} from "../../auth/auth-data.model";
import {Course} from "../course.model";

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  visible = true;
  studyCycleOptions: string [] = ['Bachelor', 'Master', 'PhD'];
  courseCycle: string;

  allStudents: User[] = [];
  allLecturers: User[] = [];

  /*** chips autocomplete for students ***/
  studentCtrl = new FormControl();
  filteredStudents = this.studentCtrl.valueChanges.pipe(map(search => {
    search = (typeof search === 'string' ? search : '').trim().toLowerCase();
    return this.allStudents.filter(s => s.firstName.toLowerCase().includes(search) || s.lastName.toLowerCase().includes(search));
  }));

  selectableStudent = true;
  removableStudent = true;
  separatorKeysCodesStudent: number[] = [ENTER, COMMA];

  /*** select for lecturer ***/
  lecturerCtrl = new FormControl();
  selectableLecturer = true;
  removableLecturer = true;
  separatorKeysCodesLecturer: number[] = [ENTER, COMMA];
  addOnBlurLecturer = true;
  lecturer?: User;

  course: Partial<Course> = {students: []};

  @ViewChild('studentInput') studentInput: ElementRef<HTMLInputElement>;
  @ViewChild('lecturerInput') lecturerInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;


  constructor(private authService: AuthService,
              private courseService: CourseService,
              private router: Router,
              private route: ActivatedRoute) {
  }


  ngOnInit(): void {
    this._init();
  }

  removeStudent(student: Partial<User>): void {
    this.course.students = this.course.students.filter(e => e !== student);
  }


  selectedStudent(event: MatAutocompleteSelectedEvent): void {
    this.course.students.push(event.option.value);
    console.log('value', event.option.value)
    this.studentInput.nativeElement.value = '';
    this.studentCtrl.setValue(null);
  }

  async onCreateCourse(form: NgForm) {
    if (form.invalid) return;

    const upsertObj: any = {
      ...form.value,
      lecturerId: this.course.lecturerId,
      usersId: this.course.students.map(e => e._id)
    };

    if (this.course._id) {
      await this.courseService.update({...upsertObj, _id: this.course._id});
    } else {
      await this.courseService.create(upsertObj);
      this.router.navigate(['/courses']);
    }
    // [{id: 1}, {id: 2}, {id: 3}] {id: 3}
    // console.log(form);
    // console.log('students', this.users);
    // populate
  }

  private async _init() {
    const [allStudents, allLecturers] = await Promise.all([
      this.authService.find({where: {type: UserType.student}}),
      this.authService.find({where: {type: UserType.lecturer}}),
    ]);
    this.allStudents = allStudents;
    this.allLecturers = allLecturers;
    this.studentCtrl.setValue(null);
    this.lecturerCtrl.setValue(null);

    this.route.params.subscribe(async params => {
      if (params.courseId && params.courseId !== this.course?._id) {
        this.course = await this.courseService.findById(params.courseId, {populate: [{path: 'students'}, {path: 'lecturer'}]}).catch(() => null);

        if (this.course.lecturer) {
          this.allLecturers = this.allLecturers.filter(e => e._id !== this.course.lecturer._id);
          this.allLecturers.push(this.course.lecturer as any);
        }
      }
    });
  }
}
