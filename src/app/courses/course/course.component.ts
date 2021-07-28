import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {BehaviorSubject, Observable} from "rxjs";
import {AuthService} from "../../auth/auth.service";
import {FormControl, NgForm} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from "rxjs/operators";
import {CourseService} from "../course.service";
import {AuthDataLecturer, AuthDataStudent} from "../../auth/auth-data.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  visible = true;
  studyCycleOptions: string [] = ['Bachelor', 'Master', 'PhD'];
  courseCycle: string;

  allStudents: AuthDataStudent[] = [];
  allLecturers: AuthDataLecturer[] = [];

  /*** chips autocomplete for students ***/
  studentCtrl = new FormControl();
  filteredStudents = this.studentCtrl.valueChanges.pipe(map(search => {
    search = (typeof search === 'string' ? search : '').trim().toLowerCase();
    return this.allStudents.filter(s => s.firstName.toLowerCase().includes(search) || s.lastName.toLowerCase().includes(search));
  }));

  students: AuthDataStudent[] = [];

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
  lecturer?: AuthDataLecturer;

  @ViewChild('studentInput') studentInput: ElementRef<HTMLInputElement>;
  @ViewChild('lecturerInput') lecturerInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;


  constructor(private authService: AuthService,
              private courseService: CourseService,
              private router: Router) {
  }


  ngOnInit(): void {
    this._init();
  }

  // removeStudent(student: string): void {
  //   const index = this.students.indexOf(student);
  //
  //   if (index >= 0) {
  //     this.students.splice(index, 1);
  //   }
  // }


  selectedStudent(event: MatAutocompleteSelectedEvent): void {
    this.students.push(event.option.value);
    console.log('value', event.option.value)
    this.studentInput.nativeElement.value = '';
    this.studentCtrl.setValue(null);
  }


  // private _filterStudent(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //
  //   return this.allStudents
  //     .filter(student =>
  //       student.toLowerCase().includes(filterValue));
  // }

  async onCreateCourse(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form);
    console.log('students', this.students);

    await this.courseService.create({...form.value, studentIds: this.students.map(e => e._id)});
    this.router.navigate(['/courses']);
    // populate
  }

  private async _init() {
    const [allStudents, allLecturers] = await Promise.all([
      this.authService.getStudents(),
      this.authService.getLecturer(),
    ]);
    this.allStudents = allStudents;
    this.allLecturers = allLecturers;
    this.studentCtrl.setValue(null);
    this.lecturerCtrl.setValue(null);

    // this.studentSearch.subscribe(search => console.log('search:', search));
    // this.filteredStudents = this.studentCtrl.valueChanges.pipe(
    //   startWith(null),
    //   map((student: string | null) => student ? this._filterStudent(student) :
    //     this.allStudents.slice()));
  }
}
