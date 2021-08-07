import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";

import {Course} from "../course.model";
import {CourseService} from "../course.service";
import {MatPaginator} from "@angular/material/paginator";
import {AuthService} from "../../auth/auth.service";
import {UserType} from "../../auth/auth-data.model";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, AfterViewInit {
  courseData: any = [];
  dataSource: MatTableDataSource<Course>;
  readonly displayedColumns: string[] = [
    'courseTitle',
    'courseCycle',
    'students',
    'lecturer',
    'courseEnter',
    this.authService.user.type === UserType.admin? 'actions' : null
    ].filter(e => e);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private courseService: CourseService, private authService: AuthService) { }

  ngOnInit(): void {
    this.courseService.find({
      populate: [{path: 'lecturer'}, {path: 'students'}]
    }).then(data => {
      this.courseData = data;
      this.dataSource = new MatTableDataSource<Course>(this.courseData);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
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
}
