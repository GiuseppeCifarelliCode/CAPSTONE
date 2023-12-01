import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Ilogin } from 'src/app/models/ilogin';
import { Iuser } from 'src/app/models/iuser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url:string = 'https://localhost:44379/api/User'
  loginUrl:string = 'https://localhost:44379/api/User/Login'

  public authSubject = new BehaviorSubject<null | Token>(null)
  user$ = this.authSubject.asObservable()
  isLoggedIn$ = this.user$.pipe(map(user => user ? true : false ))

  constructor(private http:HttpClient, private router:Router, private jwtHelper:JwtHelperService) {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // Se c'è un token memorizzato, aggiorna il BehaviorSubject
      const decodedToken = this.jwtHelper.decodeToken(storedToken);
      this.authSubject.next(decodedToken);
    }
  }

  login(data:Ilogin){
    return this.http.post<string>(this.loginUrl,data)
    .subscribe(
      (response: string) => {
        const decodedToken = this.jwtHelper.decodeToken(response);

        // Aggiorna il BehaviorSubject con i dati utente o token
        this.authSubject.next(decodedToken);

        // Salva il token nel localStorage
        localStorage.setItem('token', response);
        this.router.navigateByUrl("/start")
      },
      (error: HttpErrorResponse) => {
        console.error('Errore di login:', error);
      }
    );
  }

  signUp(data:Iuser){
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
    localStorage.removeItem('token')
    this.router.navigate(['auth/login'])
  }

}
