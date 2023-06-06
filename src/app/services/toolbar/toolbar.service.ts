import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {

  private title = new BehaviorSubject<string>('Project Guidance');
  currentTitle = this.title.asObservable();

  constructor() {}

  changeTitle(title: string) {
    this.title.next(title);
  }
}
