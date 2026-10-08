import { ActivatedRoute } from '@angular/router';
import { SpaceService } from './../../services/Space.service';
import { Component, inject, OnInit, signal , computed, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  imports:[FormsModule , CommonModule],
  styleUrls: ['./space.component.css']
})
export class SpaceComponent implements OnInit {

@ViewChild('inputTask') set taskInputContent(content: ElementRef) {
  if (content) {
    setTimeout(() => {
      content.nativeElement.focus();
      content.nativeElement.select();
    }, 50);
  }
}


  constructor(  public SpaceService:SpaceService) {


  }


  Activate = inject(ActivatedRoute)

spaceId = signal(this.Activate.snapshot.paramMap.get('id'))




currntId =  computed(() => {
  return  this.SpaceService.Space().find(s => s.id === this.spaceId())
})


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
