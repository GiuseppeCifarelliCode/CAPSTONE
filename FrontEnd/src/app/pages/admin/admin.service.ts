import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Icategory } from 'src/app/models/icategory';
import { Ievent } from 'src/app/models/ievent';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  categoryUrl:string = 'https://localhost:44379/api/Category'
  eventUrl:string = 'https://localhost:44379/api/Event'
  constructor(private http:HttpClient, private router:Router) { }

  AddCategory(data:Icategory){
    console.log(data);
    return this.http.post<Icategory>(this.categoryUrl,data)
    .subscribe(
      (response: any) => {
        console.log(response);

      },
      (error: HttpErrorResponse) => {
        console.error('Errore:', error);
      }
    );
  }

  GetCategories(){
    return this.http.get<Icategory[]>(this.categoryUrl)
  }

  AddEvent(data:Ievent){
    console.log(data);
    return this.http.post<Ievent>(this.eventUrl,data)
    .subscribe(
      (response: any) => {
        console.log(response);

      },
      (error: HttpErrorResponse) => {
        console.error('Errore:', error);
      }
    );
  }

}
