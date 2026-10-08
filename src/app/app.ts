import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { AuthenticationService } from '../services/Authentication.service';
import { NavbarTopComponent } from "../components/Navbar-Top/Navbar-Top.component";
import { NavbarBottomComponent } from "../components/navbar-bottom/navbar-bottom.component";

@Component({
  selector: 'app-root',
  imports: [NavbarTopComponent, NavbarBottomComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App{
  protected readonly title = signal('app');


constructor(){}





}
