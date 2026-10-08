import { ActivatedRoute } from '@angular/router';
import { SpaceService } from './../../services/Space.service';
import { Component, inject, OnInit, signal , computed, ViewChildren, ElementRef, AfterViewInit, ViewChild, Output, Input, output, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ShopSpaceService } from '../../services/ShopSpace.service';
@Component({
  selector: 'app-shoping',
  templateUrl: './shoping.component.html',
  imports:[FormsModule , CommonModule],
  styleUrls: ['./shoping.component.css']
})
export class ShopingComponent implements OnInit  {
  @ViewChild('inputTask') set taskInputContent(content: ElementRef) {
    if (content) {
      setTimeout(() => {
        content.nativeElement.focus();
        content.nativeElement.select();
      }, 50);
    }
  }
  constructor( public SpaceService:ShopSpaceService) { }
  Activate = inject(ActivatedRoute)
  private taskservice = inject (ShopSpaceService)

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
