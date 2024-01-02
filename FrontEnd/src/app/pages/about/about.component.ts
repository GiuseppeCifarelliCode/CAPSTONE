import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/language.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  currentLanguage !: string
  constructor(private translate:TranslateService, private languageSvc:LanguageService){}
  ngOnInit(){
    this.languageSvc.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang
      this.translate.use(this.currentLanguage)
    })
  }
}
