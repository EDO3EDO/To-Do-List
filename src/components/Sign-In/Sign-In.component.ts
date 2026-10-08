import { ChangeDetectorRef, Component, inject, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/Authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Sign-In',
  imports:[ReactiveFormsModule],
  templateUrl: './Sign-In.component.html',
  styleUrls: ['./Sign-In.component.css']
})
export class SignInComponent  {
  constructor(private _AuthenticationService:AuthenticationService , private _Router:Router , private cdr:ChangeDetectorRef) { }


  isloding:boolean = false;
  messagError:string = '';

  sign_in = new FormGroup({
  email: new FormControl("" ,[Validators.required , Validators.email]),
  password: new FormControl("" ,[Validators.required , Validators.minLength(8),Validators.maxLength(15),Validators.pattern(/^[A-z].{5,}$/)])
})









ContanWithGoogle(){
  try{
      this._AuthenticationService.GoogelSignUp().subscribe({
        next: (res) => {
        this._Router.navigate([('/To Do List')])
        console.log("gg")
        }
      })
  }catch(err){
    console.log(`fk: {${err}`)
  }
}

  GetSignin(form:FormGroup){
if(this.sign_in.valid){

  this.isloding = true;


  const { email, password} = form.value;
this._AuthenticationService.SignIn(email , password).subscribe({
  next: (respons) => {
      this.isloding = false;
    respons.user.getIdToken().then(t =>
      console.log(t)
    )
    console.log(respons),
    this._Router.navigate([('/To Do List')])
  },
  error: (respons) => {
    this.isloding = false;
    this.messagError = respons.message;
    this.cdr.detectChanges();
    console.log(this.messagError)}
})}
}
}
