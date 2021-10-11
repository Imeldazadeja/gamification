import {Injectable} from "@angular/core";
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router} from "@angular/router";
import {filter, map} from "rxjs/operators";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: "root"
})

export class CoreService {
  private _title = '';
  private _nonCompiledTitles = new BehaviorSubject<Array<{ title: string; url: string }>>([]);
  private _titleParams: { [key: string]: string } = {};

  titles = this._nonCompiledTitles.pipe(map(nonCompiledTitles => {
    // Example: ['Courses', 'Course {{courseName}}']
    const patternRegex = new RegExp('\{\{(\\w+)\}\}');
    return nonCompiledTitles.map(segment => {
      const title = segment.title.split(new RegExp('(\{\{\w+\}\})')).map(patternOrStatic => {
        const match = patternRegex.exec(patternOrStatic);
        if (match) {
          const dynamicVar = match[1];
          return this._titleParams[dynamicVar];
        } else {
          return patternOrStatic
        }
      }).filter(e => e).join('');

      return title ? {title: title, url: segment.url} : null;
    }).filter(e => e);
  }));

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe(async () => {
      const segments: ActivatedRouteSnapshot[] = [];
      const addSegments = (route: ActivatedRouteSnapshot) => {
        segments.push(route);
        if (route.firstChild) addSegments(route.firstChild);
      };
      addSegments(this.activatedRoute.snapshot);
      const segmentsWithTitle = segments.filter(e => e.data?.title);

      this._nonCompiledTitles.next(segmentsWithTitle.map(e => ({
        title: e.data.title,
        url: e.pathFromRoot.filter(e => e.url.length).map(e => e.url.join('/')).join('/')
      })));

    });
  }

  get title(): string {
    return this._title;
  }

  set title(title: string) {
    this._title = title;
  }

  setTitleParam(paramName: string, value: string) {
    this._titleParams[paramName] = value;
    this._nonCompiledTitles.next(this._nonCompiledTitles.value);
  }
}
