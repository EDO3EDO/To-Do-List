import { ActivatedRoute } from '@angular/router';
import { SpaceService } from './../../services/Space.service';
import { Component, inject, OnInit, signal , computed, ViewChild, ElementRef, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutoSpaceService } from '../../services/AutoSpace.service';
@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  imports:[FormsModule , CommonModule],
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {


@ViewChild('inputTask') set taskInputContent(content: ElementRef) {
  if (content) {
    setTimeout(() => {
      content.nativeElement.focus();
      content.nativeElement.select();
    }, 50);
  }
}
    constructor(  public SpaceService:AutoSpaceService) { }


  Activate = inject(ActivatedRoute)

spaceId = signal(this.Activate.snapshot.paramMap.get('id'))




taskId =  computed(() => {
  return  this.SpaceService.tasks().filter(s => s.ID === this.spaceId())
})



  ngOnInit() {

      const day = 1000 * 60 * 60 * 24;

  setInterval(() => {
    this.SpaceService.removetask()
  },day)


  }

}
