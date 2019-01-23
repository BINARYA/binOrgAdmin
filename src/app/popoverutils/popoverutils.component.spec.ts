import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverutilsComponent } from './popoverutils.component';

describe('PopoverutilsComponent', () => {
  let component: PopoverutilsComponent;
  let fixture: ComponentFixture<PopoverutilsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverutilsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverutilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
