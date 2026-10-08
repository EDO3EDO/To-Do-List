/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SETTINGSComponent } from './SETTINGS.component';

describe('SETTINGSComponent', () => {
  let component: SETTINGSComponent;
  let fixture: ComponentFixture<SETTINGSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SETTINGSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SETTINGSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
