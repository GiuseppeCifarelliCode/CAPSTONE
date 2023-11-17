import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Ilogin } from 'src/app/models/ilogin';
import { Iuser } from 'src/app/models/iuser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url:string = 'https://localhost:44379/api/User'
  loginUrl:string = 'https://localhost:44379/api/User/Login'

  public authSubject = new BehaviorSubject<null | Iuser>(null)
  user$ = this.authSubject.asObservable()
  isLoggedIn$ = this.user$.pipe(map(user => user ? true : false ))

  constructor(private http:HttpClient, private router:Router) {
    const storedUser = localStorage.getItem('User');
    if (storedUser) {
      // Se c'è un utente memorizzato, aggiorna il BehaviorSubject
      this.authSubject.next(JSON.parse(storedUser));
    }
  }

  login(data:Ilogin){
    console.log(data);
    return this.http.post<Ilogin>(this.loginUrl,data)
    .subscribe(
      (response: any) => {
        this.authSubject.next(response)
        localStorage.setItem('User', JSON.stringify(response))
        this.router.navigateByUrl("home")
      },
      (error: HttpErrorResponse) => {
        console.error('Errore di login:', error);
      }
    );
  }

  signUp(data:Iuser){
    console.log(data);
    return this.http.post<Iuser>(this.url,data)
    .subscribe(
      (response: any) => {
        this.authSubject.next(response)
        localStorage.setItem('User', JSON.stringify(response))
      },
      (error: HttpErrorResponse) => {
        console.error('Errore di login:', error);
      }
    );
  }

  logout(){
    this.authSubject.next(null)
    localStorage.removeItem('User')
    this.router.navigate(['auth/login'])
  }

}
