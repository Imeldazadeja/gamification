import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Quiz} from "./quiz.model";
import {filter, tap} from "rxjs/operators";
import {Filter} from "../utils";
import { Subject} from "rxjs";

@Injectable({providedIn: "root"})
export class QuizService {
  private quizzes: Quiz[] = [];
  private quizUpdate = new Subject<Quiz[]>();
  constructor(private http: HttpClient) {
  }

  find(filter?: Filter): Promise<Quiz[]> {
    return this.http.get<Quiz[]>('http://localhost:3000/api/quiz')
      .pipe(
      tap(quizzes => {
        this.quizzes = quizzes;
        this.quizUpdate.next([...this.quizzes]);
      })
    ).toPromise() as any
  }

  create(data: Omit<Quiz, '_id'>): Promise<Quiz> {
    return this.http.post('http://localhost:3000/api/quiz', data).toPromise() as any;
  }

  update(data: Omit<Quiz, '_id'>): Promise<Quiz> {
    return this.http.put('http://localhost:3000/api/quiz', data).toPromise() as any;
  }

  findById(_id: string): Promise<Quiz> {
    return this.http.get('http://localhost:3000/api/quiz' + _id).toPromise() as any;
  }
}
