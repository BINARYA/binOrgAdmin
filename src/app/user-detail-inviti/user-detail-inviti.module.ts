import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserDetailInvitiPage } from './user-detail-inviti.page';

const routes: Routes = [
  {
    path: '',
    component: UserDetailInvitiPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserDetailInvitiPage]
})
export class UserDetailInvitiPageModule {}
