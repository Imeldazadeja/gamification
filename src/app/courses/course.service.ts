import {HttpClient} from "@angular/common/http";
import {map, tap} from "rxjs/operators";
import {Subject} from "rxjs";
import {Course} from "./course.model";
import {Injectable} from "@angular/core";
import {Filter} from "../utils";

@Injectable({providedIn: "root"})

export class CourseService {
  private courses: Course[] = [];
  private courseUpdated = new Subject<Course[]>();

  constructor(private http: HttpClient) {
  }

  find(filter?: Filter): Promise<Course[]> {
    return this.http.get<Course[]>('http://localhost:3000/api/courses', {params: {filter: filter ? JSON.stringify(filter) : undefined}})
      .pipe(
        tap(courses => {
          this.courses = courses;
          this.courseUpdated.next([...this.courses]);
        })
      ).toPromise() as any;
  }

  count(): Promise<Course[]> {
    return this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/courses').pipe()
      .toPromise() as any;
  }

  findById(id: string): Promise<Course> {
    return this.http.get<Course>(`http://localhost:3000/api/courses/${id}`).toPromise().catch(() => null) as any;
  }

  delete(id: string): Promise<Course> {
    return this.http.delete<Course>(`http://localhost:3000/api/courses/${id}`).toPromise() as any;
  }

  update(data: Partial<Course>): Promise<Course> {
    return this.http.put<Course>('http://localhost:3000/api/courses', data).toPromise() as any
  }

  create(data: Omit<Course, '_id'>): Promise<Course> {
    return this.http.post('http://localhost:3000/api/courses', data).toPromise() as any;
  }
}
