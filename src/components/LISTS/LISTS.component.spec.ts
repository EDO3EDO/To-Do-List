/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LISTSComponent } from './LISTS.component';

describe('LISTSComponent', () => {
  let component: LISTSComponent;
  let fixture: ComponentFixture<LISTSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LISTSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LISTSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
