import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Error404',
  templateUrl: './Error404.component.html',
  styleUrls: ['./Error404.component.css']
})
export class Error404Component implements OnInit {

  constructor(private Router:Router) { }

  ngOnInit() {
  }


  BackToMyTasks(){
    this.Router.navigate([('To Do List')])
  }

}
