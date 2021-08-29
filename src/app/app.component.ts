import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth/auth.service';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {CoreService} from "./core/core.service";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private coreService: CoreService,
              private router: Router) {}

  ngOnInit() {
    this.authService.autoAuthUser();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe(() => {
      const rt = this.getChild(this.activatedRoute);
      rt.data.subscribe((data: any) => {
        this.coreService.title = data?.title;
      });
    });
  }

  getChild(activatedRoute: ActivatedRoute): any {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }
}
