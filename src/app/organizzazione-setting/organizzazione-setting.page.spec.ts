import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizzazioneSettingPage } from './organizzazione-setting.page';

describe('OrganizzazioneSettingPage', () => {
  let component: OrganizzazioneSettingPage;
  let fixture: ComponentFixture<OrganizzazioneSettingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizzazioneSettingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizzazioneSettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
