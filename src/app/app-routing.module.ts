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
import {transferArrayItem} from "@angular/cdk/drag-drop";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: '', component: CoreComponent, children: [
      {path: 'signup', component: SignupComponent},
      {path: 'users', component: UserListDetailsComponent, data: {title: 'Register'}},
      {
        path: 'courses',
        children: [
          {path: 'new', component: CourseComponent},
          {path: '', component: CoursesComponent},
          {path: ':id', component: QuizListComponent},
          {path: ':id/new', component: QuizDetailComponent},
          {path: ':id/:quizId', component: QuizDetailComponent},
          {path: '**', redirectTo: ''},
        ],
        data: {title: 'Courses'},
      },
      // {path: 'quiz', component: QuizDetailComponent},
      {path: 'quiz-play/:quizId', component: QuizPlayComponent},
      // {path: 'quiz-list', component: QuizListComponent},

      {path: 'user-profile', component: UserProfileComponent, data: {title: 'User Profile'}},
      {path: 'change-password', component: ChangePasswordComponent},
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
