import { HomeService } from './../home.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ievent } from 'src/app/models/ievent';
import { Icategory } from 'src/app/models/icategory';
import { Iuser } from 'src/app/models/iuser';
import { Iattendance } from 'src/app/models/iattendance';
import { Ireview } from 'src/app/models/ireview';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {

  eventId!:number
  event!:Ievent
  category!:Icategory[]
  user!:Iuser
  attendance!:Iattendance
  reviews!:Ireview[]
  editForm!:FormGroup
  editReview!:Ireview
  userReviews:Iuser[] = []
  reviewMessage:string = 'Non sono presenti recensioni'
  reviewInput:string = ''
  review:Ireview = {
    IdReview: 0,
    Comment: '',
    IdAttendance: 0,
    IdEvent: 0,
    IdUser: 0 }

  constructor(private route:ActivatedRoute, private homeSvc:HomeService, private fb:FormBuilder){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = +params['id']; // Converte l'ID dalla stringa a un numero
      this.getEventById();
    });
    if(localStorage.getItem('User')){
      const userDataJSON = localStorage.getItem('User')
      if(userDataJSON) this.user = JSON.parse(userDataJSON) as Iuser
    }
    this.homeSvc.GetCategory().subscribe(response => {
      this.category = response
      console.log(response);
    })
    if(this.user){
      this.homeSvc.GetAttendanceByUser(this.user.IdUser).subscribe(data => {
      for(let i = 0; i<data.length; i++){
        if(data[i].IdEvent == this.eventId) this.attendance = data[i]
      }
    })
  }
  this.createEditForm()
  }


  getEventById(){
    this.homeSvc.GetEventById(this.eventId)
    .subscribe(data => {
      this.event = data;
      this.homeSvc.GetImage(this.event.Cover).subscribe((imageURL:any) => {
        this.event.Cover = 'data:image/jpeg;base64,' + imageURL.base64Image;
      })
      this.homeSvc.GetImage(this.event.Img).subscribe((imageURL:any) => {
        this.event.Img = 'data:image/jpeg;base64,' + imageURL.base64Image;
      })
      this.homeSvc.GetImage(this.event.BackGround).subscribe((imageURL:any) => {
        this.event.BackGround = 'data:image/jpeg;base64,' + imageURL.base64Image;
      })
    },
    (error) => {
      console.error('Error fetching event details', error);
    }
  );
  }

  addAttendance(idEvent:number){
    console.log(idEvent);
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
  }

  getReviews(){
    this.homeSvc.GetReviewByEvent(this.eventId).subscribe(data =>{
      this.reviews = data
      for(let i = 0; i< this.reviews.length;i++){
        this.homeSvc.GetUserById(this.reviews[i].IdUser).subscribe(user =>{
          this.userReviews.push(user)
        })
      }
    })
  }

  getUserName(idUser:number):string{
    const user = this.userReviews.find(user => user.IdUser === idUser)
    return user ? user.Username : "Utente non trovato"
  }

  addReview(){
    this.review.Comment = this.reviewInput
    this.review.IdAttendance = this.attendance.IdAttendance
    this.review.IdEvent = this.eventId
    this.review.IdUser = this.user.IdUser
    this.reviews.push(this.review)
    this.homeSvc.AddReview(this.review)
    this.reviewInput = ""
  }

  buyTicket(){
    this.attendance.Ticket = true
    this.homeSvc.BuyTicket(this.attendance).subscribe()
  }

  createEditForm(){
    this.editForm = this.fb.group({
      Comment: this.fb.control(null, [Validators.required])
    })
  }

  takeReview(review:Ireview){
    this.editReview = review
    console.log(this.editReview);

  }

  EditReview(){
    this.editReview.Comment = this.editForm.value.Comment
    this.homeSvc.EditReview(this.editReview).subscribe()
  }

  DeleteReview(idReview:number){
    this.homeSvc.DeleteReview(idReview).subscribe(response =>{
      this.getReviews()
    })
  }
}
