import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import { Observable} from "rxjs";
import {AuthService} from "../../auth/auth.service";
import {FormControl, NgForm} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  visible = true;
  studyCycleOptions: string [] = ['Bachelor', 'Master', 'PhD'];
  courseCycle: string;

  /*** chips autocomplete for students ***/
  studentCtrl = new FormControl();
  filteredStudents: Observable<string[]>;
  students: string[] = [];
  allStudents: string[] = [];
  selectableStudent = true;
  removableStudent = true;
  separatorKeysCodesStudent: number[] = [ENTER, COMMA];
  addOnBlurStudent = true;


  /*** chips autocomplete for lecturer ***/
  lecturerCtrl = new FormControl();
  filteredLecturer: Observable<string[]>;
  lecturers: string[] = [];
  allLecturer: string[] = [];
  selectableLecturer = true;
  removableLecturer = true;
  separatorKeysCodesLecturer: number[] = [ENTER, COMMA];
  addOnBlurLecturer = true;


  @ViewChild('studentInput') studentInput: ElementRef<HTMLInputElement>;
  @ViewChild('lecturerInput') lecturerInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;


  constructor(private authService: AuthService) {}


  ngOnInit(): void {
    this.authService.getStudents().then(
      (value: any[]) => {
      this.allStudents = value.map(student => student.email);
      this.studentCtrl.setValue(null);
    });

    this.authService.getLecturer().then(
      (value: any[]) => {
        this.allLecturer = value.map(lecturer => lecturer.email);
        this.lecturerCtrl.setValue(null);
      });

    this.filteredStudents = this.studentCtrl.valueChanges.pipe(
      startWith(null),
      map((student: string | null) => student ? this._filterStudent(student) :
        this.allStudents.slice()));

    this.filteredLecturer = this.lecturerCtrl.valueChanges.pipe(
      startWith(null),
      map((lecturer: string | null) => lecturer ? this._filterLecturer(lecturer) :
        this.allLecturer.slice()));
  }

  removeStudent(student: string): void {
    const index = this.students.indexOf(student);

    if(index >= 0) {
      this.students.splice(index, 1);
    }
  }

  removeLecturer(lecturer: string): void {
    const index = this.lecturers.indexOf(lecturer);

    if(index >= 0) {
      this.lecturers.splice(index, 1);
    }
  }

  selectedStudent(event: MatAutocompleteSelectedEvent): void {
    this.students.push(event.option.viewValue);
    this.studentInput.nativeElement.value = '';
    this.studentCtrl.setValue(null);
  }

  selectedLecturer(event: MatAutocompleteSelectedEvent): void {
    this.lecturers.push(event.option.viewValue);
    this.lecturerInput.nativeElement.value = '';
    this.lecturerCtrl.setValue(null);
  }

  private _filterStudent(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allStudents
      .filter(student =>
      student.toLowerCase().includes(filterValue));
  }

  private _filterLecturer(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allLecturer
      .filter(lecturer =>
        lecturer.toLowerCase().includes(filterValue));
  }
  //
  // onCreateCourse(form: NgForm) {
  //   if(form.invalid){
  //     return;
  //   }
  //   console.log(form);
  //   // this.courseService.create().then();
  //
  // }

}
