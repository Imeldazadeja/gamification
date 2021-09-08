import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {LoginComponent} from "./auth/login/login.component";
import {SignupComponent} from "./auth/signup/signup.component";
import {AuthGuard} from "./auth/auth.guard";
import {UserListDetailsComponent} from "./auth/user-list-details/user-list-details.component";
import {CoursesComponent} from "./courses/courses/courses.component";
import {CourseComponent} from "./courses/course/course.component";
import {QuizDetailComponent} from "./quiz/quiz-detail/quiz-detail.component";
import {QuizListComponent} from "./quiz/quiz-list/quiz-list.component";
import {QuizPlayComponent} from "./quiz/quiz-play/quiz-play.component";
import {CoreComponent} from "./core/core.component";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {ChangePasswordComponent} from "./auth/change-password/change-password.component";
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: '', component: CoreComponent, children: [
      {path: '', component: HomeComponent, data: {title: 'Home'}},
      {path: 'signup', component: SignupComponent},
      {path: 'users', component: UserListDetailsComponent, data: {title: 'Register'}},
      {
        path: 'courses',
        data: {title: 'Courses'},
        children: [
          {path: 'new', component: CourseComponent, data: {title: 'New'}},
          {path: '', component: CoursesComponent, data: {title: null}},
          {
            path: ':id',
            data: {title: '{{courseName}}'},
            children: [
              {path: '', component: QuizListComponent, data: {title: null}},
              {path: 'new', component: QuizDetailComponent, data: {title: 'New quiz'}},
              {path: ':quizId', component: QuizDetailComponent, data: {title: '{{quizName}}'}},
              {path: 'play/:quizId', component: QuizPlayComponent, data: {title: '{{quizName}}'}},
            ],
          },
          {path: '**', redirectTo: ''},
        ],
      },

      {path: 'user-profile', component: UserProfileComponent, data: {title: 'User Profile'}},
      {path: 'change-password', component: ChangePasswordComponent, data: {title: 'Change password'}},
    ], canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {
}
