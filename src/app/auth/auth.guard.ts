import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router, UrlTree
} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

import {AuthService} from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Promise<boolean | UrlTree> {
    if (this.authService.isInit) {
      if (this.authService.user) {
        return true;
      } else {
        return this.router.createUrlTree(['login']);
      }
    } else {
      return this.authService.getCurrentUser()
        .then(() => true)
        .catch(() => this.router.createUrlTree(['login']));
    }
  }
}
