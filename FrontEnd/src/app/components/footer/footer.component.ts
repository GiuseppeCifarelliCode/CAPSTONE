import { Component } from '@angular/core';
import { ThemeService } from 'src/app/theme.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  currentTheme!:string

  constructor(private themeSvc:ThemeService){
    this.themeSvc.themeFilePath$.subscribe(theme =>{
      this.currentTheme = theme
    })
  }
}
