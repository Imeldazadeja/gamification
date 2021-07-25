import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import { Observable} from "rxjs";
import {AuthService} from "../../auth/auth.service";
import {FormControl} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  visible = true;
  courseCycle: string;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  studyCycleOptions: string [] = ['Bachelor', 'Master', 'PhD'];
  studentCtrl = new FormControl();
  filteredStudents: Observable<string[]>;
  students: string[] = [];
  allStudents: string[] = [];

  @ViewChild('studentInput') studentInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;


  constructor(private authService: AuthService) {
    this.filteredStudents = this.studentCtrl.valueChanges.pipe(
      startWith(null),
      map((student: string | null) => student ? this._filter(student) :
        this.allStudents.slice()));
  }


  ngOnInit(): void {
    this.authService.getStudents().then(
      (value: any[]) => {
      this.allStudents = value.map(student => student.email);
      this.studentCtrl.setValue(null);
    });

  }

  remove(student: string): void {
    const index = this.students.indexOf(student);

    if(index >= 0) {
      this.students.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.students.push(event.option.viewValue);
    this.studentInput.nativeElement.value = '';
    this.studentCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allStudents
      .filter(student =>
      student.toLowerCase().includes(filterValue));
  }
}
