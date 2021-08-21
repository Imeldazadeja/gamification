import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
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
  private authStatusListener = new Subject<boolean>();
  private dataUser: User[] = [];
  private userUpdated = new Subject<User[]>();
  public loginError: boolean = false;

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

  /** Login user ***/
  async login(data: Omit<User, 'id'>): Promise<void> {
    try {
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
    }
    catch (error) {
      this.loginError = true;
    }
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

  delete(_id: string): Promise<User> {
    return this.http
      .delete<User>('http://localhost:3000/api/user/' + _id).toPromise() as any;
  }

  update(data: Partial<User>): Promise<User>{
    return this.http.put<User>('http://localhost:3000/api/user', data).toPromise() as any;
  }

  findById(id: string): Promise<User> {
    return this.http.get<User>('http://localhost:3000/api/user/' + id).toPromise() as any;
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
    this.loginError = false;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
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
