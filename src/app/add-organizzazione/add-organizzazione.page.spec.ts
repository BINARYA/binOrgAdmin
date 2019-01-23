import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrganizzazionePage } from './add-organizzazione.page';

describe('AddOrganizzazionePage', () => {
  let component: AddOrganizzazionePage;
  let fixture: ComponentFixture<AddOrganizzazionePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrganizzazionePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrganizzazionePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
