import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";

import {Course} from "../course.model";
import {CourseService} from "../course.service";
import {MatPaginator} from "@angular/material/paginator";
import {AuthService} from "../../auth/auth.service";
import {UserType} from "../../auth/auth-data.model";
import {BehaviorSubject} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, AfterViewInit {
  courseData: any = [];
  // dataSource: MatTableDataSource<Course>;
  dataSource = new BehaviorSubject<Course[]>([]);
  readonly displayedColumns: string[] = [
    'courseTitle',
    'courseCycle',
    'students',
    'lecturer',
    'actions',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private courseService: CourseService,
              private authService: AuthService,
              private snackbar: MatSnackBar) {
  }

  get isAdmin(): boolean {
    return this.authService.user.type === UserType.admin;
  }

  ngOnInit(): void {
    this.courseService.find({
      populate: [{path: 'lecturer'}, {path: 'students'}]
    }).then(data => {
      this.courseData = data;
      this.dataSource.next(this.courseData);
      // this.dataSource = new MatTableDataSource<Course>(this.courseData);
      // setTimeout(() => {
      //   this.dataSource.paginator = this.paginator;
      // }, 0);
    });
  }

  // lecturerId, lecturer

  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
  }

  lecturer(course) {
    if (course.lecturer) {
      return `${course.lecturer.firstName} ${course.lecturer.lastName}`;
    }
    return '-';
  }

  async delete(courseId: string): Promise<void> {
    const course = await this.courseService.delete(courseId);
    this.dataSource.next(this.dataSource.value.filter(item => item._id !== courseId));
    this.snackbar.open(`Course deleted successfully!`, null, {duration: 3000});
  }
}
