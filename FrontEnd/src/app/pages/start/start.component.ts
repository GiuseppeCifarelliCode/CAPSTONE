import { HomeService } from './../home/home.service';
import { Component } from '@angular/core';
import { Iuser } from 'src/app/models/iuser';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent {

  user!:Iuser

  constructor(private homeSvc:HomeService){}

  ngOnInit(){
    if(localStorage.getItem('User')){
      const userDataJSON = localStorage.getItem('User')
      if(userDataJSON) {
        this.user = JSON.parse(userDataJSON) as Iuser
        }
      }
    }
  }

