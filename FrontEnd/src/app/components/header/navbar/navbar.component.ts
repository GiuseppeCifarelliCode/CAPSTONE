import { JwtHelperService } from '@auth0/angular-jwt';
import { Iuser } from './../../../models/iuser';
import { Component } from '@angular/core';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/pages/auth/auth.service';
import { HomeService } from 'src/app/pages/home/home.service';
import { Token } from '@angular/compiler';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/language.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  logged!: boolean;
  user!: Iuser | null;
  decodedToken!: any;
  currentLang!:string;

  constructor(
    public authSvc: AuthService,
    private homeSvc: HomeService,
    private translate: TranslateService,
    public languageSvc:LanguageService
  ) {
    this.languageSvc.currentLanguage$.subscribe(lang =>{
      this.currentLang = lang
      console.log(this.currentLang);

      this.translate.use(this.currentLang)
    })

    // Verifico se un utente è loggato
    this.authSvc.isLoggedIn$.subscribe((log) => {
      this.logged = log;
      if (this.logged) {
        this.authSvc.user$.subscribe((data) => {
          this.decodedToken = data;
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
        });
      }
    });
  }

  logout() {
    this.authSvc.logout();
    this.user = null;
  }

  toggleLanguage(){
    this.currentLang = this.currentLang === 'en'?'it':'en'
    this.translate.use(this.currentLang)
    this.languageSvc.languageSubject.next(this.currentLang)
  }
}
