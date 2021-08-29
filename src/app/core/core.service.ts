import {Injectable} from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class CoreService {
  private _title = ''

  constructor() {
  }

  get title(): string {
    return this._title;
  }

  set title(title: string) {
    this._title = title;
  }

}
