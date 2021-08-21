import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";
import {User, UserType} from "../auth/auth-data.model";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user!: User;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.getUserData();
  }

  ngOnInit(): void {
    this.getUserData();
  }

  get isStudent(): boolean {
    return this.authService.user?.type === UserType.student;
  }

  get isLecturer():boolean {
    return this.authService.user?.type === UserType.lecturer;
  }

  getUserData() {
    this.user = {...this.authService.user!};
  }

  onChangePassword() {
    this.router.navigate(['change-password']);
  }

}
