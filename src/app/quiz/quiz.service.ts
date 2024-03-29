import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {QuestionDataSchema, Quiz} from "./quiz.model";
import {filter, tap} from "rxjs/operators";
import {Filter} from "../utils";
import {Subject} from "rxjs";

@Injectable({providedIn: "root"})
export class QuizService {
  private quizzes: Quiz[] = [];
  private quizUpdate = new Subject<Quiz[]>();

  constructor(private http: HttpClient) {
  }

  //#region admin & lecturer routes
  find(filter?: Filter): Promise<Quiz[]> {
    return this.http.get<Quiz[]>('http://localhost:3000/api/quiz', {params: {filter: filter ? JSON.stringify(filter) : undefined}})
      .pipe(
        tap(quizzes => {
          this.quizzes = quizzes;
          this.quizUpdate.next([...this.quizzes]);
        })
      ).toPromise() as any
  }

  findById(id: string): Promise<Quiz> {
    return this.http.get<Quiz>(`http://localhost:3000/api/quiz/${id}`).toPromise().catch(() => null) as any;
  }

  create(data: Partial<Quiz>): Promise<Quiz> {
    return this.http.post<Quiz>('http://localhost:3000/api/quiz/admin', data).toPromise() as any;
  }

  update(data: Partial<Quiz>): Promise<Quiz> {
    return this.http.put<Quiz>(`http://localhost:3000/api/quiz/admin/${data._id}`, data).toPromise() as any;
  }

  delete(id: string): Promise<Quiz> {
    return this.http
      .delete<Quiz>(`http://localhost:3000/api/quiz/admin/${id}`).toPromise() as any;
  }

  start(id: string, startTime: Date, endTime: Date): Promise<void> {
    return this.http.post<void>(`http://localhost:3000/api/quiz/admin/${id}/start`, {
      startTime,
      endTime
    }).toPromise();
  }

  stop(id: string): Promise<void> {
    return this.http.post<void>(`http://localhost:3000/api/quiz/admin/${id}/stop`, {}).toPromise();
  }

  postScore(args: { quizId: string; studentId: string; questionId: string; points: number }): Promise<void> {
    return this.http.post<void>(`http://localhost:3000/api/quiz/admin/${args.quizId}/evaluate/${args.studentId}/${args.questionId}`, {points: args.points}).toPromise();
  }

  //#endregion

  //#region student routes
  openQuestion(args: { quizId: string; questionId: string }): Promise<Partial<QuestionDataSchema>> {
    return this.http.post<void>(`http://localhost:3000/api/quiz/student/${args.quizId}/${args.questionId}/open`, {}).toPromise() as any;
  }

  postAnswer(args: { quizId: string; questionId: string; answer: string | number }): Promise<void> {
    return this.http.post<void>(`http://localhost:3000/api/quiz/student/${args.quizId}/${args.questionId}/answer`, {answer: args.answer}).toPromise();
  }

  getRunningQuizes(): Promise<Array<Quiz>> {
    return this.http.get<Array<Quiz>>(`http://localhost:3000/api/quiz/student/running-quizes`).toPromise();
  }

  //#endregion
}
