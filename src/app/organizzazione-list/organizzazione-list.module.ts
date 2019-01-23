import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrganizzazioneListPage } from './organizzazione-list.page';

const routes: Routes = [
  {
    path: '',
    component: OrganizzazioneListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrganizzazioneListPage]
})
export class OrganizzazioneListPageModule {}
