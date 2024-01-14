import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/language.service';
import { ThemeService } from 'src/app/theme.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  currentLanguage !: string
  currentTheme!:string
  constructor(private translate:TranslateService, private languageSvc:LanguageService, private themeSvc:ThemeService){}
  ngOnInit(){
    this.themeSvc.themeFilePathSubject.subscribe(theme =>{
      this.currentTheme = theme
    })
    this.languageSvc.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang
      this.translate.use(this.currentLanguage)
    })
  }
}
