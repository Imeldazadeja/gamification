import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AuthData, AuthDataLecturer, AuthDataStudent} from "./auth-data.model";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {map, tap} from "rxjs/operators";

@Injectable({providedIn: "root"})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private dataStudents: AuthDataStudent[] = [];
  private studentsUpdated = new Subject<AuthDataStudent[]>();
  private authStatusListener = new Subject<boolean>();


  constructor(private http: HttpClient, private router: Router) {
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getStudentsUpdateListener() {
    return this.studentsUpdated.asObservable();
  }

  createUser(firstName: string, lastName: string, email: string, password: string) {
    const authData: AuthData = {firstName: firstName, lastName: lastName, email: email, password: password}
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['/login']);
      });
  }

  createStudent(
    data: Omit<AuthDataStudent, 'id'>
  ): Promise<AuthDataStudent> {
    return this.http.post<AuthDataStudent>("http://localhost:3000/api/user/signup-student", data).toPromise() as any;
  }

  getStudents(): Promise<AuthDataStudent[]> {
    return this.http.get<{ message: string, posts: any }>(
      "http://localhost:3000/api/user/signup-student"
    )
      .pipe(
        map((postStudents) => {
          return postStudents.posts.map(student => {
            return {
              firstName: student.firstName,
              lastName: student.lastName,
              email: student.email,
              password: student.password,
              faculty: student.faculty,
              studyProgramme: student.studyProgramme,
              studyCycle: student.studyCycle,
              id: student._id
            };
          });
        }),
        tap(students => {
          this.dataStudents = students;
          this.studentsUpdated.next([...this.dataStudents]);
        })
      ).toPromise();
  }

  createLecturer(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    faculty: string) {
    const authDataLecturer: AuthDataLecturer = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      faculty: faculty
    }
    console.log(authDataLecturer);
    this.http.post("http://localhost:3000/api/user/signup-lecturer", authDataLecturer)
      .subscribe(response => {
        console.log(response);
      });
  }

  // async login (email: string, password: string) {
  //   const response = await this.http
  //     .post<{token: string, expiresIn: number}>(
  //       "http://localhost:3000/api/user/login",
  //       {email, password}
  //     ).toPromise();
  //   this.token = response.token;
  //   if (this.token) {
  //     const expiresInDuration = response.expiresIn;
  //     this.setAuthTimer(expiresInDuration);
  //     this.isAuthenticated = true;
  //     this.authStatusListener.next(true);
  //     const now = new Date();
  //     const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
  //     console.log(expirationDate);
  //     this.saveAuthData(this.token, expirationDate);
  //     this.router.navigate(['/']);
  //   }
  // }
  login(email: string, password: string) {
    this.http
      .post<{ token: string; expiresIn: number }>(
        "http://localhost:3000/api/user/login",
        {email: email, password: password}
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate);
          this.router.navigate(["/"]);
        }
      });
  }

  getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next();
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer" + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }
}
