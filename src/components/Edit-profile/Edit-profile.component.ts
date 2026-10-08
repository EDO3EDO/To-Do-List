import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthenticationService } from '../../services/Authentication.service';
import { Auth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-Edit-profile',
  templateUrl: './Edit-profile.component.html',
  imports:[FormsModule , ReactiveFormsModule ],
  styleUrls: ['./Edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  private Auth = inject(AuthenticationService)
  private log = inject(Auth)

  userPhoto = signal<string>('03.png');
  userName = signal<string>(this.log.currentUser?.displayName || '')
  userBio = signal<string>('Digital product designer and minimalist enthusiast based in Brooklyn. Curating the best in tactile UI and modern architecture.')
  userEmail = signal<string>(this.log.currentUser?.email || '')
  IsLoding = signal<boolean>(true)
  constructor() { }

  ngOnInit() {

    ////////////////////photo change ////////////
    this.Auth.getUserPhoto().subscribe({
      next: (data) => {
        if(data){
          this.userPhoto.set(data)
          this.IsLoding.set(false)
        }
      },
      error: () => {
        this.IsLoding.set(false)
      }
    })

    ///////////////////Name change /////////////////

    this.Auth.getName().subscribe({
      next: (data) => {
        if(data){
          this.userName.set(data)
        }
      }
    })


//////////////////////////Bio change ////////////////////


    this.Auth.getUserBio().subscribe({
      next:(data) => {
        if(data){
          this.userBio.set(data)
        }
      }
    })


    /////////////////////////////email not change It's Defult ////////////////////////

    this.Auth.getUserEmail().subscribe({
      next:(data) => {
        if(data){
          this.userEmail.set(data)
        }
      }
    })


  }




  async onNameChanged(name:string){
    try{
      await this.Auth.UpdateUserName(name)
    }catch{
      console.log("error")
    }
  }

  async onBioChanged(bio:string){
    try{
      await this.Auth.UpdateBio(bio)
    }catch{
      console.log("error")
    }
  }



  onFileSelected(event: any) {
  const file: File = event.target.files[0];

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();

    reader.onload = async (e: any) => {
      const base64Image = e.target.result;

      this.userPhoto.set(base64Image);

      try {
        await this.Auth.UpdatePhotoUser(base64Image);
        console.log("Image updated successfully in Firestore!");
      } catch (err) {
        console.error("Failed to update image:", err);
      }
    };

    reader.readAsDataURL(file);
  }
}



}
