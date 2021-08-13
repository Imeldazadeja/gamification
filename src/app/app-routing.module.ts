import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { AuthGuard } from "./auth/auth.guard";
import {UserListDetailsComponent} from "./auth/user-list-details/user-list-details.component";
import {LecturerListComponent} from "./auth/lecturer-list/lecturer-list.component";
import {CoursesComponent} from "./courses/courses/courses.component";
import {CourseComponent} from "./courses/course/course.component";
import {QuizCreateComponent} from "./quiz/quiz-create/quiz-create.component";
import {QuizDisplayComponent} from "./quiz/quiz-display/quiz-display.component";
import {QuizPlayComponent} from "./quiz/quiz-play/quiz-play.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },

  // {path: '', children: [...], canActivate: [AuthGuard]},
  { path: "signup", component: SignupComponent },
  { path: "userList", component: UserListDetailsComponent, canActivate: [AuthGuard]},
  { path: "", component: PostListComponent, canActivate: [AuthGuard] },
  { path: "create", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "edit/:postId", component: PostCreateComponent, canActivate: [AuthGuard] },
  // { path: "lecturerList", component: LecturerListComponent, canActivate: [AuthGuard]},
  { path: "course", component: CourseComponent, canActivate: [AuthGuard]},
  { path: "courses", component: CoursesComponent, canActivate: [AuthGuard]},
  {path: 'quiz', component: QuizCreateComponent, canActivate: [AuthGuard]},
  {path: 'quiz-display', component: QuizDisplayComponent},
  {path: 'quiz-play', component: QuizPlayComponent},
  // {path: 'editUser/:userId', component: SignupComponent},
  {path: 'quizEdit/:quizId', component: QuizCreateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
