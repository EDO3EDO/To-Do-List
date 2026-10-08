import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
  imports: [CommonModule , FormsModule]
})
export class HelpComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }





  firstCard:boolean = false;
  scondCard:boolean = false;
  thirdCard:boolean = false;
  forceCard:boolean = false;



  firstfun(){
    this.firstCard = !this.firstCard
  }


    scondfun(){
    this.scondCard = !this.scondCard
  }


    thirdfun(){
    this.thirdCard = !this.thirdCard
  }


    forcefun(){
    this.forceCard = !this.forceCard
  }



  ////////////////////start qu//////////////

  firstqu:boolean = false
  scondqu:boolean = false
  thirdqu:boolean = false
  forcequ:boolean = false



  firstqufun(){
    this.firstqu = !this.firstqu
  }

  scondqufun(){
    this.scondqu = !this.scondqu
  }

  thirdqufun(){
    this.thirdqu = !this.thirdqu
  }

  forcequfun(){
    this.forcequ = !this.forcequ
  }



  CommingSoon(){
  alert("This feature is coming soon! Stay tuned")
}



}
