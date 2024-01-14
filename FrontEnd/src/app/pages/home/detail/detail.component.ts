import { HomeService } from './../home.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ievent } from 'src/app/models/ievent';
import { Icategory } from 'src/app/models/icategory';
import { Iuser } from 'src/app/models/iuser';
import { Iattendance } from 'src/app/models/iattendance';
import { Ireview } from 'src/app/models/ireview';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ThemeService } from 'src/app/theme.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {

  eventId!:number
  event!:Ievent
  category!:Icategory[]
  currentTheme!:string
  decodedToken:any
  user!:Iuser
  attendance!:Iattendance
  reviews!:Ireview[]
  editForm!:FormGroup
  editReview!:Ireview
  deleted!:Ireview
  userReviews:Iuser[] = []
  reviewMessage:string = 'Non sono presenti recensioni'
  reviewInput:string = ''
  review:Ireview = {
    IdReview: 0,
    Comment: '',
    IdAttendance: 0,
    IdEvent: 0,
    IdUser: 0 }

  constructor(private route:ActivatedRoute, private homeSvc:HomeService, private fb:FormBuilder, private JwtHelper:JwtHelperService, private themeSvc:ThemeService){}

  ngOnInit(): void {
    this.themeSvc.themeFilePathSubject.subscribe(theme =>{
      this.currentTheme = theme
    })
    this.route.params.subscribe(params => {
      this.eventId = +params['id']; // Converte l'ID dalla stringa a un numero
      this.getEventById();
    });
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
              this.homeSvc.GetAttendanceByUser(this.user.IdUser).subscribe(data => {
                for(let i = 0; i<data.length; i++){
                  if(data[i].IdEvent == this.eventId) this.attendance = data[i]
                }
              })
            });
        }
      }
    }
    this.homeSvc.GetCategory().subscribe(response => {
      this.category = response
      console.log(response);
    })
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
    this.attendance = {
      IdAttendance: 0,
      Partecipated: true,
      Rating:0,
      Ticket:false,
      Favourite:false,
      IdUser: this.user.IdUser,
      IdEvent: idEvent,
  };
    this.homeSvc.AddAttendance(this.attendance).subscribe(response =>{
      this.homeSvc.GetAttendanceByUser(this.user.IdUser).subscribe(data => {
        for(let i = 0; i<data.length; i++){
          if(data[i].IdEvent == this.eventId) this.attendance = data[i]
        }
      })
    })
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
    this.homeSvc.AddReview(this.review).subscribe(response =>{
      this.getReviews()
    })
    this.reviewInput = ""
  }

  buyTicket(){
    this.attendance.Ticket = true
    this.homeSvc.BuyTicket(this.attendance).subscribe()
  }

  createEditForm(){
    this.editForm = this.fb.group({
      Comment: this.fb.control([Validators.required])
    })
  }

  takeReview(review:Ireview){
    this.editReview = review
    this.editForm.setValue({Comment:this.editReview.Comment})
  }

  deletedRev(review:Ireview){
    this.deleted = review
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
