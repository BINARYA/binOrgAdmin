import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrganizationSettingsUserDetailPage } from './organization-settings-user-detail.page';

const routes: Routes = [
  {
    path: '',
    component: OrganizationSettingsUserDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrganizationSettingsUserDetailPage]
})
export class OrganizationSettingsUserDetailPageModule {}
