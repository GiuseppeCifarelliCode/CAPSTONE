import { Iuser } from './../../../models/iuser';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/theme.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  signUpForm!:FormGroup
  passwordError:string = ""
  user!:Iuser
  avatarData!:string
  currentTheme!:string

  constructor(private fb:FormBuilder, private authSvc:AuthService, private router:Router, private themeSvc:ThemeService){}

  ngOnInit(){
    this.themeSvc.themeFilePathSubject.subscribe(theme => {
      this.currentTheme = theme
    })
    this.signUpForm = this.fb.group({
        Name:this.fb.control(null, [Validators.required]),
        Surname:this.fb.control(null, [Validators.required]),
        BirthPlace:this.fb.control(null, [Validators.required]),
        BirthDate:this.fb.control(null, [Validators.required]),
        Avatar:this.fb.control(null, [Validators.required]),
        Username:this.fb.control(null, [Validators.required]),
        Email:this.fb.control(null, [Validators.required]),
        Phone:this.fb.control(null, [Validators.required]),
        Password:this.fb.control(null, [Validators.required]),
        Privacy:this.fb.control(null, [Validators.required]),
        confirmPassword:this.fb.control(null, [Validators.required])
      })
    }

    signUp(){
      console.log(this.signUpForm.value);

      if(this.signUpForm.value.Password === this.signUpForm.value.confirmPassword){
        this.user = {
          IdUser:0,
          Name:this.signUpForm.value.Name,
          Surname:this.signUpForm.value.Surname,
          BirthPlace:this.signUpForm.value.BirthPlace,
          BirthDate:this.signUpForm.value.BirthDate,
          Avatar:this.avatarData,
          Username:this.signUpForm.value.Username,
          Email:this.signUpForm.value.Email,
          Phone:this.signUpForm.value.Phone,
          Password:this.signUpForm.value.Password,
          Privacy:this.signUpForm.value.Privacy,
          Role:"User"
        }
        this.authSvc.signUp(this.user)
        this.router.navigateByUrl("home")
      } else this.passwordError = "Passwords don't match!"

    }

    onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const binaryData = new Uint8Array(reader.result as ArrayBuffer); // Dati binari effettivi
          if (binaryData) {
            this.avatarData = this.arrayBufferToBase64(binaryData);
            console.log(this.avatarData);
          }
        };
        reader.readAsArrayBuffer(file); // Converti il file in dati binari
        console.log(file);
      }
    }

    arrayBufferToBase64(arrayBuffer: Uint8Array): string {
      let binary = '';
      const bytes = new Uint8Array(arrayBuffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    }
  }

