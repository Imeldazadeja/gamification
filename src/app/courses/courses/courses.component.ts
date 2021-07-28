import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";

import {Course} from "../course.model";
import {CourseService} from "../course.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, AfterViewInit {
  courseData: any = [];
  dataSource: MatTableDataSource<Course>;
  readonly displayedColumns: string[] = ['courseTitle', 'courseCycle', 'students', 'lecturer', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private courseService: CourseService) { }

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
