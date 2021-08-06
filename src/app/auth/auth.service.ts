import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
// import {AuthData, AuthDataLecturer, AuthDataStudent} from "./auth-data.model";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {User, UserType} from "./auth-data.model";
import {tap} from "rxjs/operators";
import {Filter} from "../utils";
import {Course} from "../courses/course.model";

@Injectable({providedIn: "root"})
export class AuthService {
  private _user?: User;
  private _init = false;
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  // private dataStudents: AuthDataStudent[] = [];
  // private studentsUpdated = new Subject<AuthDataStudent[]>();
  // private dataLecturer: AuthDataLecturer[] = [];
  // private lecturerUpdated = new Subject<AuthDataLecturer[]>();
  private authStatusListener = new Subject<boolean>();
  private dataUser: User[] = [];
  private userUpdated = new Subject<User[]>();

  get isInit(): boolean {
    return this._init;
  }

  constructor(private http: HttpClient, private router: Router) {
  }

  getToken() {
    return this.token;
  }

  get user() {
    return this._user;
  }

  set User(currentUser: User | undefined) {
    this._user = currentUser;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  // getStudentsUpdateListener() {
  //   return this.studentsUpdated.asObservable();
  // }
  //
  // createUser(data: Omit<AuthData, 'id'>
  // ): Promise<AuthData> {
  //   return this.http.post<AuthData>("http://localhost:3000/api/user/signup", data).toPromise() as any;
  // }
  //
  // createStudent(
  //   data: Omit<AuthDataStudent, 'id'>
  // ): Promise<AuthDataStudent> {
  //   return this.http.post<AuthDataStudent>("http://localhost:3000/api/user/signup-student", data).toPromise() as any;
  // }
  //
  // getStudents(): Promise<AuthDataStudent[]> {
  //   return this.http.get<AuthDataStudent[]>(
  //     "http://localhost:3000/api/user/signup-student"
  //   )
  //     .pipe(
  //       tap(students => {
  //         this.dataStudents = students;
  //         this.studentsUpdated.next([...this.dataStudents]);
  //       })
  //     ).toPromise();
  // }
  //
  // createLecturer(data: Omit<AuthDataLecturer, 'id'>
  // ): Promise<AuthDataLecturer> {
  //   return this.http.post<AuthDataLecturer>("http://localhost:3000/api/user/signup-lecturer", data).toPromise() as any;
  // }
  //
  // getLecturer(): Promise<AuthDataLecturer[]> {
  //   return this.http.get<AuthDataLecturer[]>(
  //     "http://localhost:3000/api/user/signup-lecturer"
  //   )
  //     .pipe(
  //       tap(lecturer => {
  //         this.dataLecturer = lecturer;
  //         this.lecturerUpdated.next([...this.dataLecturer]);
  //       })
  //     ).toPromise();
  // }

  /** Login user ***/
  async login(data: Omit<User, 'id'>) {
    const response = await this.http
      .post<{ token: string, expiresIn: number, user: User }>(
        "http://localhost:3000/api/user/login", data)
      .toPromise();
    this.token = response.token;
    if (this.token) {
      this._user = response.user;
      this._init = true;
      const expiresInDuration = response.expiresIn;
      this.setAuthTimer(expiresInDuration);
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
      console.log(expirationDate);
      this.saveAuthData(this.token, expirationDate);
      await this.router.navigate(['/']);
    }

    // if (this._user.type === UserType.admin) {
    //   await this.router.navigate(['/admin']);
    // } else if (this._user.type === UserType.student) {
    //   await this.router.navigate(['/student']);
    // } else {
    //   await this.router.navigate(['/lecturer'])
    // }
  }

  /**** Signup user ****/
  async signup(data: Omit<User, '_id'>): Promise<User> {
    return await this.http.post('http://localhost:3000/api/user/signup', data).toPromise() as any
  }

  /*** Get current user ***/

  async getCurrentUser(): Promise<User> {
    return this.http.get<User>('http://localhost:3000/api/user/current').pipe(tap(user => {
      this._user = user;
      this._init = true;
    })).toPromise();
  }

  /**** Get user ****/

  find(filter?: Filter): Promise<User[]> {
    return this.http.get<Course[]>('http://localhost:3000/api/user', {params: {filter: filter ? JSON.stringify(filter) : undefined}})
      .toPromise() as any;
  }

  getUser(): Promise<User[]> {
    return this.http.get<User[]>('http://localhost:3000/api/user/getUser')
      .pipe(
        tap(user => {
          this.dataUser = user;
          this.userUpdated.next([...this.dataUser]);
        })).toPromise();
  }


  // login -> user -> init: true
  // login -> get current -> get current
  // refresh -> get current -> init: true

  // refresh, token, !user, GET /current (1s) -> guard,

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
    this._user = null;
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
