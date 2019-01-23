import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrganizzazioneSettingPage } from './organizzazione-setting.page';

const routes: Routes = [
  {
    path: '',
    component: OrganizzazioneSettingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrganizzazioneSettingPage]
})
export class OrganizzazioneSettingPageModule {}
