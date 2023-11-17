import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Ievent } from 'src/app/models/ievent';
import { HomeService } from './home.service';
import { Icategory } from 'src/app/models/icategory';
import { Iattendance } from 'src/app/models/iattendance';
import { Iuser } from 'src/app/models/iuser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  event!:Ievent[]
  nextEvents!:Ievent[]
  category!:Icategory[]
  user!:Iuser
  attendance!:Iattendance
  trueAttendance!:Iattendance[]
  title:string = 'Eventi Oggi'

  constructor(private homeSvc:HomeService, private router:Router){}

  ngOnInit(){
    if(localStorage.getItem('User')){
      const userDataJSON = localStorage.getItem('User')
      if(userDataJSON) {
        this.user = JSON.parse(userDataJSON) as Iuser
        this.homeSvc.GetAttendanceByUser(this.user.IdUser).subscribe(response =>{
          this.trueAttendance = response
        })
      }
    }
    this.homeSvc.GetEvents().subscribe(response => {
      this.event = response
      for(let i = 0; i < this.event.length; i++) {
        this.homeSvc.GetImage(this.event[i].Cover).subscribe((imageURL:any) => {
          this.event[i].Cover = 'data:image/jpeg;base64,' + imageURL.base64Image;
        })
        this.homeSvc.GetImage(this.event[i].Img).subscribe((imageURL:any) => {
          this.event[i].Img = 'data:image/jpeg;base64,' + imageURL.base64Image;
        })
        this.homeSvc.GetImage(this.event[i].BackGround).subscribe((imageURL:any) => {
          this.event[i].BackGround = 'data:image/jpeg;base64,' + imageURL.base64Image;
        })
        }
    })

    this.homeSvc.GetNextEvents().subscribe(response => {
      this.nextEvents = response
      for(let i = 0; i < this.nextEvents.length; i++) {
        this.homeSvc.GetImage(this.nextEvents[i].Cover).subscribe((imageURL:any) => {
          this.nextEvents[i].Cover = 'data:image/jpeg;base64,' + imageURL.base64Image;
        })
        this.homeSvc.GetImage(this.nextEvents[i].Img).subscribe((imageURL:any) => {
          this.nextEvents[i].Img = 'data:image/jpeg;base64,' + imageURL.base64Image;
        })
        this.homeSvc.GetImage(this.nextEvents[i].BackGround).subscribe((imageURL:any) => {
          this.nextEvents[i].BackGround = 'data:image/jpeg;base64,' + imageURL.base64Image;
        })
      }
    })
    this.homeSvc.GetCategory().subscribe(response => {
      this.category = response
      console.log(response);
    })
  }

  addAttendance(idEvent:number){
    this.attendance = {
      IdAttendance: 0,
      Partecipated: true,
      Rating:0,
      Ticket:false,
      Favourite:false,
      IdUser: this.user.IdUser,
      IdEvent: idEvent,
  };
    this.homeSvc.AddAttendance(this.attendance)
    this.router.navigateByUrl("home/event/"+idEvent)
  }

  isAttending(eventId: number): boolean {
    return this.trueAttendance && this.trueAttendance.some(attendance => attendance.IdEvent === eventId);
  }

  searchByDate(event: any) {
    const selectedDate = event.target.value;
    if (selectedDate) {
      this.homeSvc.GetEventsByDate(selectedDate).subscribe(data => {
        this.event = data
        for(let i = 0; i < this.event.length; i++) {
          this.homeSvc.GetImage(this.event[i].Cover).subscribe((imageURL:any) => {
            this.event[i].Cover = 'data:image/jpeg;base64,' + imageURL.base64Image;
          })
          this.homeSvc.GetImage(this.event[i].Img).subscribe((imageURL:any) => {
            this.event[i].Img = 'data:image/jpeg;base64,' + imageURL.base64Image;
          })
          this.homeSvc.GetImage(this.event[i].BackGround).subscribe((imageURL:any) => {
            this.event[i].BackGround = 'data:image/jpeg;base64,' + imageURL.base64Image;
          })
          }
          this.title = 'Eventi in '+ selectedDate
      });
    }
  }

  searchByCategory(event: any) {
    const selectedCategoryId = event.target.value;
    if (selectedCategoryId) {
      this.homeSvc.GetEventsByCategory(selectedCategoryId).subscribe(data => {
        this.event = data
        for(let i = 0; i < this.event.length; i++) {
          this.homeSvc.GetImage(this.event[i].Cover).subscribe((imageURL:any) => {
            this.event[i].Cover = 'data:image/jpeg;base64,' + imageURL.base64Image;
          })
          this.homeSvc.GetImage(this.event[i].Img).subscribe((imageURL:any) => {
            this.event[i].Img = 'data:image/jpeg;base64,' + imageURL.base64Image;
          })
          this.homeSvc.GetImage(this.event[i].BackGround).subscribe((imageURL:any) => {
            this.event[i].BackGround = 'data:image/jpeg;base64,' + imageURL.base64Image;
          })
          }
          this.title = this.category[selectedCategoryId - 1].Name
      });
    }
  }
}
