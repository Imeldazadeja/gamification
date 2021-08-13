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

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
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

  users: User[] = [];

  selectableStudent = true;
  removableStudent = true;
  separatorKeysCodesStudent: number[] = [ENTER, COMMA];

  /*** select for lecturer ***/
  lecturerCtrl = new FormControl();
  filteredLecturer: Observable<string[]>;

  selectableLecturer = true;
  removableLecturer = true;
  separatorKeysCodesLecturer: number[] = [ENTER, COMMA];
  addOnBlurLecturer = true;
  lecturer?: User;

  @ViewChild('studentInput') studentInput: ElementRef<HTMLInputElement>;
  @ViewChild('lecturerInput') lecturerInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;


  constructor(private authService: AuthService,
              private courseService: CourseService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    //
    // const inserting = activatedRoute.snapshot.data.inserting;
    // this.courseState = inserting ? 'addCourse' : 'editCourse';
    // if(!inserting) {
    //   const element = this.router.getCurrentNavigation()?.extras.state?.element;
    //   if(element) {
    //     this.course = element;
    //   } else {
    //     const id = this.activatedRoute.snapshot.params.id;
    //     this.courseService.findById(id).then(course => {
    //       this.course = course;
    //     })
    //   }
    // }
  }


  ngOnInit(): void {
    this._init();
  }

  removeStudent(student: User): void {
    const index = this.users.indexOf(student);

    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }


  selectedStudent(event: MatAutocompleteSelectedEvent): void {
    this.users.push(event.option.value);
    console.log('value', event.option.value)
    this.studentInput.nativeElement.value = '';
    this.studentCtrl.setValue(null);
  }

  async onCreateCourse(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form);
    console.log('students', this.users);

    await this.courseService.create({...form.value, usersId: this.users.map(e => e._id)});
    this.router.navigate(['/courses']);
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
  }
}
