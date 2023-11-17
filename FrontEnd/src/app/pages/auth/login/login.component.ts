import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms'
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!:FormGroup
  passwordError:string = ""

  constructor(private fb:FormBuilder, private authSvc:AuthService, private router:Router){}

  ngOnInit(){
    this.loginForm = this.fb.group({
      authData:this.fb.group({
        username:this.fb.control(null, [Validators.required]),
        password:this.fb.control(null, [Validators.required]),
        confirmPassword:this.fb.control(null, [Validators.required])
      })
    })
  }

  login(){
    if(this.loginForm.value.authData.password === this.loginForm.value.authData.confirmPassword){
      this.authSvc.login({username: this.loginForm.value.authData.username, password: this.loginForm.value.authData.password})
    } else this.passwordError = "Passwords don't match!"

  }

  isValid(fieldName:string){
    return this.loginForm.get(fieldName)?.valid
  }

  isTouched(fieldName:string){
    return this.loginForm.get(fieldName)?.touched
  }
}
