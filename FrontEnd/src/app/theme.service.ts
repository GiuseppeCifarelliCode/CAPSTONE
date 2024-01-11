import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public themeFilePathSubject = new BehaviorSubject<string>('light');
  themeFilePath$ = this.themeFilePathSubject.asObservable();
  constructor() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      this.themeFilePathSubject.next(storedTheme);
    } else {
      this.themeFilePathSubject.next('light')
    }
  }
}
