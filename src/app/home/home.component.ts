import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {User} from "../auth/auth-data.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) {
    this.getUserData();
  }

  user!: User;

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData() {
    this.user = {...this.authService.user!};
  }

}
