import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/Authentication.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MisMatch } from '../../class/Mismatch';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-Sign-Up',
  imports:[ReactiveFormsModule , TranslateModule ],
  templateUrl:'./Sign-Up.component.html',
  styleUrls: ['./Sign-Up.component.css']
})
export class SignUpComponent {

  constructor(private _AuthenticationService:AuthenticationService , private _Router:Router , private cdr:ChangeDetectorRef) { }

isloding:boolean = false;
messagError:string = '';

sign_up = new FormGroup({
  name: new FormControl(null,[Validators.required , Validators.minLength(3)]),
  email: new FormControl(null ,[Validators.required , Validators.email]),
  password: new FormControl(null ,[Validators.required , Validators.minLength(8),Validators.maxLength(15),Validators.pattern(/^[A-z].{5,}$/)]),
  rePassword:new FormControl(null ,[Validators.required ,Validators.pattern(/^[A-z].{5,}$/)]),
}, {validators:MisMatch})



ContanWithGoogle(){
  try{
      this._AuthenticationService.GoogelSignUp().subscribe({
        next: (res) => {
        this._Router.navigate([('/To Do List')])
        console.log("gg")
        },
        error: (err) => {
          console.log('cant signUp' ,err)
        }
      })
  }catch(err){
    console.log(`fk: {${err}`)
  }
}



  GetSign(form:FormGroup){
    if(this.sign_up.valid){
      this.isloding = true

      const { email, password, name } = form.value;
this._AuthenticationService.SignUp(email , password , name ).subscribe({
  next: (respons) => {console.log(respons),
    this.isloding = false;
    this._Router.navigate([('/To Do List')])
  },
  error:(respons)=>{
    this.isloding = false;
    this.messagError = respons.message;
    this.cdr.detectChanges();
    console.log(this.messagError)
  }
})
    }
}
}
