import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../auth.service";
// import {AuthDataStudent} from "../auth-data.model";
import {BehaviorSubject} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatPaginator} from "@angular/material/paginator";
import {User, UserDescriptions, UserType} from "../auth-data.model";
import {SignupComponent} from "../signup/signup.component";

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})

export class StudentListComponent implements OnInit, OnDestroy {
  readonly userDescriptions = UserDescriptions;
  readonly columns = [
    'firstName',
    'lastName',
    'email',
    'type',
    'faculty',
    'studyProgramme',
    this.authService.user.type === UserType.admin ? 'actions' : null
  ].filter(e => e);
  dataSource = new BehaviorSubject<User[]>([]);

  constructor(private authService: AuthService, private dialog: MatDialog, private _snackBar: MatSnackBar) {
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.authService.getUser().then(user => {
      this.dataSource.next(user);
    });
  }

  async openAddUserDialog(): Promise<void> {
    const dialogRef = this.dialog.open(SignupComponent, {
      width: '500px'
    });
    const result = await dialogRef.afterClosed().toPromise();
    if (!result) return;

    await this.authService.signup(result);

    const user = await this.authService.getUser();
    this.dataSource.next(user);
    this._snackBar.open('User created successfully!', null, {duration: 3000});
  }

  ngOnDestroy() {
  }

}
