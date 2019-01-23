import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizzazioneListPage } from './organizzazione-list.page';

describe('OrganizzazioneListPage', () => {
  let component: OrganizzazioneListPage;
  let fixture: ComponentFixture<OrganizzazioneListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizzazioneListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizzazioneListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
