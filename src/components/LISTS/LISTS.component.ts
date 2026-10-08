import { ShopSpaceService } from './../../services/ShopSpace.service';
import { AutoSpaceService } from './../../services/AutoSpace.service';
import { ITask } from './../../interface/ITask';
import { FormsModule } from '@angular/forms';
import { Component, effect, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { signal , computed } from '@angular/core';
import { CommonModule} from '@angular/common';
import { LIST } from '../../interface/LIST';
import { SpaceService } from '../../services/Space.service';
@Component({
  selector: 'app-LISTS',
  templateUrl: './LISTS.component.html',
  imports: [CommonModule, FormsModule, RouterLink],
  styleUrls: ['./LISTS.component.css']
})
export class LISTSComponent implements OnInit {



  constructor(private _Router:Router , private _SpaceService:SpaceService) {}

  public spaceService = inject(SpaceService);
  public AutoSpaceService = inject(AutoSpaceService);
  public Activate = inject(ActivatedRoute);
  public ShopSpaceService = inject(ShopSpaceService);



  IsLoding = signal<boolean>(false)

  spaceId = signal(this.Activate.snapshot.paramMap.get('id'))




shopingId =  computed(() => {
  return  this.ShopSpaceService.tasks().filter(s => s.ID === this.spaceId())
})


  AutoId =  computed(() => {
  return  this.AutoSpaceService.tasks().filter(s => s.ID === this.spaceId())
})









  ngOnInit() {



    this.IsLoding.set(true)

    this.spaceService.getSpace().subscribe({
      next: (parse) => {
        this.spaceService.Space.set(parse)
        this.IsLoding.set(false)
        console.log("gg")
      },
      error: (parse) => {
        console.log(parse)
      }

    })
  }













Count1(spaceId: string): number {
  return this.spaceService.tasks().filter(t => t.ID === spaceId).length
}



personalpage(){
  this._Router.navigate([('/personal')])
}


restaurantPage(){
  this._Router.navigate([('/restaurant')])
}

shopingPage(){
  this._Router.navigate([('/shoping')])
}



////////////////////////////////////////end Routing









  deleteSpace(id:any, event:any) {

    const del =  this.spaceService.Space().filter( v => v.id === id)

    del.forEach(space => {
      if(space.firebaseId){
        this.spaceService.deleteSpace(space.firebaseId)
      }
    })

  event.stopPropagation();

}













}
