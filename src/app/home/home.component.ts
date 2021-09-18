import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {User, UserType} from "../auth/auth-data.model";
import {QuizService} from "../quiz/quiz.service";
import {Quiz} from "../quiz/quiz.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  runningQuizes: Quiz[] = [];

  get isStudent(): boolean {
    return this.authService.user.type === UserType.student;
  }

  constructor(
    private authService: AuthService,
    private quizService: QuizService,
  ) {
    this.getUserData();
  }

  user!: User;

  ngOnInit(): void {
    this.getUserData();
    if (this.isStudent) {
      this.quizService.getRunningQuizes().then(quizes => {
        this.runningQuizes = quizes;
      });
    }
  }

  getUserData() {
    this.user = {...this.authService.user!};
  }

}
