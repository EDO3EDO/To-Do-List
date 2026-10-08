import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-navbar-bottom',
  templateUrl: './navbar-bottom.component.html',
  styleUrls: ['./navbar-bottom.component.css'],
  imports: [RouterLink, RouterLinkActive]
})
export class NavbarBottomComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
