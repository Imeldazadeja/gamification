import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {AuthDataStudent} from "../auth-data.model";
import {BehaviorSubject, Subscription} from "rxjs";

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit, OnDestroy {
  readonly columns = ['firstName', 'lastName', 'actions'];
  dataSource = new BehaviorSubject<AuthDataStudent[]>([]);

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.getStudents().then(students => {
      this.dataSource.next(students);
    });
  }

  ngOnDestroy() {
  }

}
