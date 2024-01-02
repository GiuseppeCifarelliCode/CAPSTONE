import { Injectable } from '@angular/core';
import { TranslateCompiler, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public languageSubject = new BehaviorSubject<string>('it')
  currentLanguage$ = this.languageSubject.asObservable()

  constructor(private translate:TranslateService) {
    translate.setDefaultLang('it');
    const storedLanguage = localStorage.getItem('selectedLanguage');
    if (storedLanguage) {
      this.languageSubject.next(storedLanguage);
      translate.use(storedLanguage);
    } else {
      this.languageSubject.next('it');
    }
  }
}
