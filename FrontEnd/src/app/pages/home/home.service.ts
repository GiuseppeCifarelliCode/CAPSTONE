import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Iattendance } from 'src/app/models/iattendance';
import { Icategory } from 'src/app/models/icategory';
import { Ievent } from 'src/app/models/ievent';
import { Ireview } from 'src/app/models/ireview';
import { Iuser } from 'src/app/models/iuser';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  categoryUrl:string = 'https://localhost:44379/api/Category'
  eventUrl:string = 'https://localhost:44379/api/Event'
  imageUrl:string = 'https://localhost:44379/api/Event/image/'
  attendanceUrl:string = 'https://localhost:44379/api/Attendance'
  reviewUrl:string = 'https://localhost:44379/api/Review'
  userUrl:string = 'https://localhost:44379/api/User'

  constructor(private http:HttpClient, private router:Router) { }

  GetUserById(id:number){
    return this.http.get<Iuser>(this.userUrl+'/'+id)
  }

  GetEvents(){
    return this.http.get<Ievent[]>(this.eventUrl)
  }

  GetEventById(id:number){
    return this.http.get<Ievent>(this.eventUrl+'/'+id)
  }

  GetEventsByDate(date:Date){
    return this.http.get<Ievent[]>(this.eventUrl+'/GetEventsByDate?date='+date)
  }

  GetEventsByCategory(IdCategory:number){
    return this.http.get<Ievent[]>(this.eventUrl+'/GetEventsByCategory?IdCategory='+IdCategory)
  }

  GetNextEvents(){
    return this.http.get<Ievent[]>(this.eventUrl+'/GetNextEvents')
  }

  GetImage(imageName:string){
    return this.http.get<string>(this.imageUrl+imageName)
  }

  GetCategory(){
    return this.http.get<Icategory[]>(this.categoryUrl)
  }

  AddAttendance(data:Iattendance){
    console.log(data);
    return this.http.post<Iattendance>(this.attendanceUrl,data)
    .subscribe(
      (response: any) => {
        console.log(response);

      },
      (error: HttpErrorResponse) => {
        console.error('Errore:', error);
      }
    );
  }

  GetAttendanceByUser(IdUser:number){
    return this.http.get<Iattendance[]>(this.attendanceUrl+'/User/'+IdUser)
  }

  GetUserAttendanceWithTicket(IdUser:number){
    return this.http.get<Iattendance[]>(this.attendanceUrl+'/UserWithTicket/'+IdUser)
  }

  GetReviewByEvent(IdEvent:number){
    return this.http.get<Ireview[]>(this.reviewUrl+'/ByEvent/'+IdEvent)
  }

  AddReview(review:Ireview){
    return this.http.post<Ireview>(this.reviewUrl,review)
    .subscribe(
      (response: any) => {
        console.log(response);

      },
      (error: HttpErrorResponse) => {
        console.error('Errore:', error);
      }
    );
  }

  BuyTicket(attendance:Iattendance){
    return this.http.put<Iattendance>(this.attendanceUrl+'/'+attendance.IdAttendance,attendance)
  }

  EditReview(review:Ireview){
    return this.http.put<Ireview>(this.reviewUrl+'/'+review.IdReview,review)
  }

  DeleteReview(idReview:number){
    return this.http.delete(this.reviewUrl+'/'+idReview)
  }
}
