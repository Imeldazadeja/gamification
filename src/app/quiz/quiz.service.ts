import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Quiz} from "./quiz.model";
import {filter, tap} from "rxjs/operators";
import {Filter} from "../utils";
import {Subject} from "rxjs";

@Injectable({providedIn: "root"})
export class QuizService {
  private quizzes: Quiz[] = [];
  private quizUpdate = new Subject<Quiz[]>();

  constructor(private http: HttpClient) {
  }

  find(filter?: Filter): Promise<Quiz[]> {
    return this.http.get<Quiz[]>('http://localhost:3000/api/quiz', {params: {filter: filter ? JSON.stringify(filter) : undefined}})
      .pipe(
        tap(quizzes => {
          this.quizzes = quizzes;
          this.quizUpdate.next([...this.quizzes]);
        })
      ).toPromise() as any
  }

  create(data: Partial<Quiz>): Promise<Quiz> {
    return this.http.post<Quiz>('http://localhost:3000/api/quiz', data).toPromise() as any;
  }

  update(data: Partial<Quiz>): Promise<Quiz> {
    return this.http.put<Quiz>(`http://localhost:3000/api/quiz/${data._id}`, data).toPromise() as any;
  }

  findById(id: string): Promise<Quiz> {
    return this.http.get<Quiz>(`http://localhost:3000/api/quiz/${id}`).toPromise() as any;
  }

  delete(id: string): Promise<Quiz> {
    return this.http
      .delete<Quiz>(`http://localhost:3000/api/quiz/${id}`).toPromise() as any;
  }

  openQuestion(args: { quizId: string; questionId: string }): Promise<void> {
    return this.http.post<void>(`http://localhost:3000/api/quiz/${args.quizId}/${args.questionId}/open`, {}).toPromise();
  }

  postAnswer(args: { quizId: string; questionId: string; answer: string }): Promise<void> {
    return this.http.post<void>(`http://localhost:3000/api/quiz/${args.quizId}/${args.questionId}/answer`, {answer: args.answer}).toPromise();
  }
}
