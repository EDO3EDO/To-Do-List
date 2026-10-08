import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/Authentication.service';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-Navbar-Top',
  templateUrl: './Navbar-Top.component.html',
  imports: [RouterOutlet, RouterLinkWithHref],
  styleUrls: ['./Navbar-Top.component.css']
})
export class NavbarTopComponent implements OnInit {

  constructor(private _AuthenticationService:AuthenticationService ) { }



  isloged:boolean = false;

  ngOnInit(): void {
    this._AuthenticationService.IsLogedIn.subscribe((statu) => this.isloged = statu)


  }

logout(){
    this._AuthenticationService.SignOut()
}



blockSearch(){
  let search = document.getElementById('search')

if (search?.classList.contains('none')) {
    setTimeout(() => {
        search?.classList.remove('none');
    }, 1500);

  } else {
    search?.classList.add('none');
  }

}








}
