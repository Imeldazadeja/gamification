import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BehaviorSubject} from "rxjs";
import {AuthDataLecturer} from "../auth-data.model";
import {SignupLecturerComponent} from "../signup-lecturer/signup-lecturer.component";

@Component({
  selector: 'app-lecturer-list',
  templateUrl: './lecturer-list.component.html',
  styleUrls: ['./lecturer-list.component.scss']
})
export class LecturerListComponent implements OnInit {

  constructor(private authService: AuthService, private dialog: MatDialog, private _snackBar: MatSnackBar) {
  }

  isLoading = false;
  dataSource = new BehaviorSubject<AuthDataLecturer[]>([]);
  readonly columns = ['firstName', 'lastName', 'email', 'faculty', 'actions'];

  ngOnInit(): void {
    this.authService.getLecturer().then(lecturer => {
      this.dataSource.next(lecturer);
    });
  }

  async openAddLecturerDialog(): Promise<void> {
    const dialogRef = this.dialog.open(SignupLecturerComponent, {
      width: '500px'
    });
    const result = await dialogRef.afterClosed().toPromise();
    if (!result) return;

    await this.authService.createLecturer(result);

    const lecturer = await this.authService.getLecturer();
    this.dataSource.next(lecturer);
    this._snackBar.open('Lecturer added successfully!', null, {duration: 3000});

  }
}
