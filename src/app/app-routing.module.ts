import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {LoginComponent} from "./auth/login/login.component";
import {SignupComponent} from "./auth/signup/signup.component";
import {AuthGuard} from "./auth/auth.guard";
import {UserListDetailsComponent} from "./auth/user-list-details/user-list-details.component";
import {CoursesComponent} from "./courses/courses/courses.component";
import {CourseComponent} from "./courses/course/course.component";
import {QuizCreateComponent} from "./quiz/quiz-create/quiz-create.component";
import {QuizDisplayComponent} from "./quiz/quiz-display/quiz-display.component";
import {QuizPlayComponent} from "./quiz/quiz-play/quiz-play.component";
import {CoreComponent} from "./core/core.component";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {ChangePasswordComponent} from "./auth/change-password/change-password.component";
import {QuizViewComponent} from "./quiz/quiz-view/quiz-view.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: '', component: CoreComponent, children: [
      {path: 'signup', component: SignupComponent},
      {path: 'users', component: UserListDetailsComponent},
      {
        path: 'courses',
        children: [
          {path: 'new', component: CourseComponent},
          {path: '', component: CoursesComponent},
          {path: ':id', component: QuizDisplayComponent},
          {path: ':id/new', component: QuizCreateComponent},
          {path: '**', redirectTo: ''},
        ],
      },
      {path: 'quiz', component: QuizCreateComponent},
      {path: 'quiz-display', component: QuizDisplayComponent},

      {path: 'user-profile', component: UserProfileComponent},
      {path: 'change-password', component: ChangePasswordComponent},
      {path: 'quiz-play/:quizId', component: QuizPlayComponent},
      {path: 'quiz-view/:quizId', component: QuizViewComponent}
    ], canActivate: [AuthGuard]
  }

  // {path: '', children: [...], canActivate: [AuthGuard]},
  // {path: 'quiz-play/:id', component: QuizPlayComponent},
  // {path: 'editUser/:userId', component: SignupComponent},
  // {path: 'quizEdit/:quizId', component: QuizCreateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {
}
