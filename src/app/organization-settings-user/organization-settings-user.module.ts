import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrganizationSettingsUserPage } from './organization-settings-user.page';

const routes: Routes = [
  {
    path: '',
    component: OrganizationSettingsUserPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrganizationSettingsUserPage]
})
export class OrganizationSettingsUserPageModule {}
