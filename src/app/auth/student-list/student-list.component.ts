import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../auth.service";
import {AuthDataStudent} from "../auth-data.model";
import {BehaviorSubject, Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {SignupStudentComponent} from "../signup-student/signup-student.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit, OnDestroy {
  readonly columns = ['firstName', 'lastName', 'email', 'faculty', 'studyProgramme', 'actions'];
  dataSource = new BehaviorSubject<AuthDataStudent[]>([]);

  constructor(private authService: AuthService, private dialog: MatDialog, private _snackBar: MatSnackBar) {
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.authService.getStudents().then(students => {
      this.dataSource.next(students);
    });
  }

  async openAddStudentDialog(): Promise<void> {
    const dialogRef = this.dialog.open(SignupStudentComponent, {
      width: '500px'
    });
    const result = await dialogRef.afterClosed().toPromise();
    if (!result) return;

    await this.authService.createStudent(result);

    const students = await this.authService.getStudents();
    this.dataSource.next(students);
    this._snackBar.open('Student created successfully!', null, {duration: 3000});

  }

  ngOnDestroy() {
  }

}
