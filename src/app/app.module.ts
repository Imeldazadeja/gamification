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
import {MatOptionModule} from "@angular/material/core";
import {AppTooltipModule} from "./_core/tooltip/tooltip.module";
import { QuizCreateComponent } from './quiz/quiz-create/quiz-create.component';
import {MatStepperModule} from "@angular/material/stepper";
import { QuizPlayComponent } from './quiz/quiz-play/quiz-play.component';
import { QuizDisplayComponent } from './quiz/quiz-display/quiz-display.component';
import {MatGridListModule} from "@angular/material/grid-list";
import { CoreComponent } from './core/core.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import {ChangePasswordComponent} from "./auth/change-password/change-password.component";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { QuizViewComponent } from './quiz/quiz-view/quiz-view.component';

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
    QuizCreateComponent,
    QuizPlayComponent,
    QuizDisplayComponent,
    CoreComponent,
    UserProfileComponent,
    ChangePasswordComponent,
    QuizViewComponent
  ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatCardModule,
        AppRoutingModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
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
        MatProgressBarModule
    ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
