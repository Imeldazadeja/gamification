import {HttpClient} from "@angular/common/http";
import {map, tap} from "rxjs/operators";
import {Subject} from "rxjs";

export interface Course {
  _id: string;
  title: string,
  courseCycle: string,
  studentIds: string[],
  lecturerIds: string[],
}
export class CourseService {
  private courses: Course[] = [];
  private courseUpdated = new Subject<Course[]>();
  constructor(private http: HttpClient) {
  }

  find(): Promise<Course[]>{
    return this.http.get<{ message: string, posts: any}>('http://localhost:3000/api/courses')
      .pipe(
        map((findCourses) => {
          return findCourses.posts.map(course => {
            return {
              _id: course._id,
              title: course.title,
              courseCycle: course.courseCycle,
              studentIds: course.studentIds,
              lecturerIds: course.lecturerIds
            };
          });
        }),
        tap( courses => {
          this.courses = courses;
          this.courseUpdated.next([...this.courses]);
        })
      ).toPromise() as any;
  }

  count(): Promise<Course[]> {
    return this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/courses').pipe()
      .toPromise() as any;
  }

  findById(): Promise<Course[]> {
    return this.http.get('http://localhost:3000/api/courses').toPromise() as any
  }

  create(data: Omit<Course, '_id'>): Promise<Course> {
    return this.http.post('http://localhost:3000/api/courses', data).toPromise() as any;
  }
}
