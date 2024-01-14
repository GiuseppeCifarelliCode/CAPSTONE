import { Component } from '@angular/core';
import { Icategory } from 'src/app/models/icategory';
import { Iuser } from 'src/app/models/iuser';
import { HomeService } from '../home/home.service';
import { Iattendance } from 'src/app/models/iattendance';
import { Ievent } from 'src/app/models/ievent';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ThemeService } from 'src/app/theme.service';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent {

  user!:Iuser
  category!:Icategory[]
  decodedToken:any
  trueAttendance!:Iattendance[]
  events:Ievent[] = []
  randomNumber!:string
  currentTheme!:String

  constructor(private homeSvc:HomeService, private JwtHelper:JwtHelperService, private themeSvc:ThemeService){}

  ngOnInit(){
    this.themeSvc.themeFilePathSubject.subscribe(theme =>{
      this.currentTheme = theme
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
              this.homeSvc.GetUserAttendanceWithTicket(this.user.IdUser).subscribe(response =>{
                this.trueAttendance = response
                for(let i = 0; i < this.trueAttendance.length; i++){
                  this.homeSvc.GetEventById(this.trueAttendance[i].IdEvent).subscribe(event =>{
                    this.homeSvc.GetImage(event.Cover).subscribe((imageURL:any) => {
                      event.Cover = 'data:image/jpeg;base64,' + imageURL.base64Image;
                    })
                    this.homeSvc.GetImage(event.Img).subscribe((imageURL:any) => {
                      event.Img = 'data:image/jpeg;base64,' + imageURL.base64Image;
                    })
                    this.homeSvc.GetImage(event.BackGround).subscribe((imageURL:any) => {
                      event.BackGround = 'data:image/jpeg;base64,' + imageURL.base64Image;
                    })
                    this.events.push(event)
                    this.generateRandomNumber()
                  })
                }
              })
            });
        }
      }
    }
  }

  generateRandomNumber() {
    var number1 = Math.floor(Math.random() * 100) + 1;
    var number2 = Math.floor(Math.random() * 100) + 1;
    var number3 = Math.floor(Math.random() * 100) + 1;
    var number4 = Math.floor(Math.random() * 100) + 1;
    this.randomNumber = number1+" - " + number2+" - " + number3+" - " + number4
  }

}
