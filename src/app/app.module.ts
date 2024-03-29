import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input'
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {NavigatorComponent} from './navigator/navigator.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatExpansionModule} from "@angular/material/expansion";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatPaginatorModule} from "@angular/material/paginator";
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {AuthInterceptor} from "./auth/auth-interceptor";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FlexModule} from "@angular/flex-layout";
import {MatMenuModule} from "@angular/material/menu";
import {UserListDetailsComponent} from './auth/user-list-details/user-list-details.component';
import {MatTableModule} from "@angular/material/table";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSortHeader, MatSortModule} from "@angular/material/sort";
import {CoursesComponent} from './courses/courses/courses.component';
import {CourseComponent} from './courses/course/course.component';
import {MatChipsModule} from "@angular/material/chips";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatNativeDateModule, MatOptionModule, MatRippleModule} from "@angular/material/core";
import {AppTooltipModule} from "./_core/tooltip/tooltip.module";
import {QuizDetailComponent} from './quiz/quiz-detail/quiz-detail.component';
import {MatStepperModule} from "@angular/material/stepper";
import {QuizPlayComponent} from './quiz/quiz-play/quiz-play.component';
import {QuizListComponent} from './quiz/quiz-list/quiz-list.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {CoreComponent} from './core/core.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {ChangePasswordComponent} from "./auth/change-password/change-password.component";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {HomeComponent} from './home/home.component';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {StartQuizDialogComponent} from "./quiz/quiz-play/start-quiz-dialog/start-quiz-dialog.component";
import {EvaluateQuestionDialogComponent} from "./quiz/quiz-play/evaluate-question-dialog/evaluate-question-dialog.component";

// @ts-ignore
@NgModule({
  declarations: [
    AppComponent,
    NavigatorComponent,
    LoginComponent,
    SignupComponent,
    UserListDetailsComponent,
    CoursesComponent,
    CourseComponent,
    QuizDetailComponent,
    QuizPlayComponent,
    StartQuizDialogComponent,
    EvaluateQuestionDialogComponent,
    QuizListComponent,
    CoreComponent,
    UserProfileComponent,
    ChangePasswordComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    AppRoutingModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatToolbarModule,
    MatExpansionModule,
    MatRippleModule,
    HttpClientModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    FormsModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatRadioModule,
    MatSelectModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    FlexModule,
    MatMenuModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatSortModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatInputModule,
    AppTooltipModule,
    MatStepperModule,
    MatGridListModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,

  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
