import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {UserType} from "../auth/auth-data.model";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {map, shareReplay} from "rxjs/operators";
import {Router} from "@angular/router";
import {CoreService} from "../core/core.service";

@Component({
  selector: 'app-header',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss']
})
export class NavigatorComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    public authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public coreService: CoreService
    ) {
  }

  get isStudent(): boolean {
    return this.authService.user?.type === UserType.student;
  }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login'])
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
