import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {PostCreateComponent} from './posts/post-create/post-create.component'
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input'
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import { HeaderComponent } from './header/header.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import { PostListComponent } from './posts/post-list/post-list.component';
import { MatExpansionModule} from "@angular/material/expansion";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatPaginatorModule} from "@angular/material/paginator";
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import {AuthInterceptor} from "./auth/auth-interceptor";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import { SignupStudentComponent } from './auth/signup-student/signup-student.component';
import { MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FlexModule} from "@angular/flex-layout";
import { SignupLecturerComponent } from './auth/signup-lecturer/signup-lecturer.component';
import {MatMenuModule} from "@angular/material/menu";
import { LecturerListComponent } from './auth/lecturer-list/lecturer-list.component';
import { StudentListComponent } from './auth/student-list/student-list.component';
import {MatTableModule} from "@angular/material/table";

// @ts-ignore
@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    LoginComponent,
    SignupComponent,
    SignupStudentComponent,
    SignupLecturerComponent,
    LecturerListComponent,
    StudentListComponent
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
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
