import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../auth.service";
// import {AuthDataStudent} from "../auth-data.model";
import {BehaviorSubject} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatPaginator} from "@angular/material/paginator";
import {User, UserDescriptions, UserType} from "../auth-data.model";
import {SignupComponent} from "../signup/signup.component";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-student-list',
  templateUrl: './user-list-details.component.html',
  styleUrls: ['./user-list-details.component.scss']
})

export class UserListDetailsComponent implements OnInit, OnDestroy {
  readonly userDescriptions = UserDescriptions;
  readonly columns = [
    'firstName',
    'lastName',
    'email',
    'type',
    'faculty',
    'studyProgramme',
    // this.authService.user.type === UserType.admin ? 'modify' : null,
    this.authService.user.type === UserType.admin ? 'actions' : null,
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
    try {
      const dialogRef = this.dialog.open(SignupComponent, {
        width: '450px'
      });
      const result = await dialogRef.afterClosed().toPromise();
      if (!result) return;

      await this.authService.signup(result);

      const user = await this.authService.getUser();
      this.dataSource.next(user);
      this._snackBar.open('User created successfully!', null, {duration: 3000});
    }
    catch (error) {
      this._snackBar.open('User is already registered!', null, {duration: 3000});
    }
  }

  async delete(userId: string): Promise<void> {
    const user = await this.authService.delete(userId);
    this.dataSource.next(this.dataSource.value.filter(user => user._id !== userId));
    const index = this.dataSource.value.findIndex(item => item._id === userId);
    this._snackBar.open(`User ${this.dataSource.value[index].firstName} ${this.dataSource.value[index].lastName} deleted successfully!`, null, {duration: 3000});
  }

  ngOnDestroy() {
  }

}
