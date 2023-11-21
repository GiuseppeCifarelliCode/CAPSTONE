import { Iuser } from './../../../models/iuser';
import { Component } from '@angular/core';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/pages/auth/auth.service';
import { HomeService } from 'src/app/pages/home/home.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  logged!:boolean
  user!:Iuser | null

  constructor(public authSvc:AuthService, private homeSvc:HomeService){
    // Verifico se un utente è loggato
    this.authSvc.isLoggedIn$.subscribe(log => {
      this.logged = log
      })

    this.authSvc.user$.subscribe(user => {
      this.user = user;
      if(this.user && this.user.Avatar != "user.png"){
        this.homeSvc.GetImage(this.user?.Avatar).subscribe((imageURL:any) => {
          this.user!.Avatar = 'data:image/jpeg;base64,' + imageURL.base64Image;
          console.log(this.user?.Avatar);

        })
      } else user!.Avatar = "../../../../assets/user.png"
    })
  }

  logout(){
    this.authSvc.logout()
  }
}
