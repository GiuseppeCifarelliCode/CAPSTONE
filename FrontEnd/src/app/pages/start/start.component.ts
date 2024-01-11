import { HomeService } from './../home/home.service';
import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/language.service';
import { Iuser } from 'src/app/models/iuser';
import { ThemeService } from 'src/app/theme.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent {

  decodedToken:any
  user!:Iuser
  currentLanguage!:string;
  currentTheme!:string

  constructor(private homeSvc:HomeService, private JwtHelper:JwtHelperService,private translate:TranslateService, private languageSvc:LanguageService, private themeSvc:ThemeService){}

  ngOnInit(){

    this.themeSvc.themeFilePath$.subscribe(theme =>{
      this.currentTheme = theme
    })

    this.languageSvc.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang
      this.translate.use(this.currentLanguage)
    })
    if(localStorage.getItem('token')){
      const token = localStorage.getItem('token')
      if(token) {
        this.decodedToken = this.JwtHelper.decodeToken(token)
        if (this.decodedToken) {
          // Decodifica il token per ottenere le informazioni sull'utente
          this.homeSvc
            .GetUserById(this.decodedToken.unique_name)
            .subscribe((user) => {
              this.user = user;
              if (this.user && this.user.Avatar != 'user.png') {
                this.homeSvc
                  .GetImage(this.user?.Avatar)
                  .subscribe((imageURL: any) => {
                    this.user!.Avatar =
                      'data:image/jpeg;base64,' + imageURL.base64Image;
                  });
              } else this.user!.Avatar = '../../../../assets/user.png';
            });
        }
      }
    }
    }
  }

