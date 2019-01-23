import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddOrganizzazionePage } from './add-organizzazione.page';

const routes: Routes = [
  {
    path: '',
    component: AddOrganizzazionePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddOrganizzazionePage]
})
export class AddOrganizzazionePageModule {}
