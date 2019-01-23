import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TutorialGuard } from './guards/tutorial.guard';
import { LoginGuard } from './guards/login.guard';
import { AuthInvitiGuard } from './guards/auth-inviti.guard'


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule',
    canActivate: [LoginGuard] // <-- apply here 
  },
  { path: 'login', 
    loadChildren: './login/login.module#LoginPageModule',
    //canActivate: [TutorialGuard]
  },
  { path: 'login/:id', 
    loadChildren: './login/login.module#LoginPageModule',
    //canActivate: [TutorialGuard]
  },  
  { path: 'tutorial', 
    loadChildren: './tutorial/tutorial.module#TutorialPageModule'
    //canActivate: [LoginGuard] // <-- apply here  
  },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
  { path: 'organizzazioneList', loadChildren: './organizzazione-list/organizzazione-list.module#OrganizzazioneListPageModule' },
  { path: 'organizzazioneDetail/:id', loadChildren: './organizzazione-detail/organizzazione-detail.module#OrganizzazioneDetailPageModule', canActivate: [LoginGuard] },
  { path: 'organizzazioneSetting/:id', loadChildren: './organizzazione-setting/organizzazione-setting.module#OrganizzazioneSettingPageModule', canActivate: [LoginGuard] },
  { path: 'addOrganizzazione', loadChildren: './add-organizzazione/add-organizzazione.module#AddOrganizzazionePageModule', canActivate: [LoginGuard] },
  { path: 'appSettings', loadChildren: './app-settings/app-settings.module#AppSettingsPageModule', canActivate: [LoginGuard] },
  { path: 'info', loadChildren: './info/info.module#InfoPageModule', canActivate: [LoginGuard] },
//  { path: 'organizzazione/:id/UserDetail', loadChildren: './organization-user-detail/organization-user-detail.module#OrganizationUserDetailPageModule', canActivate: [TutorialGuard, LoginGuard]   },
  { path: 'organizzazioneSettings/:id/Users', loadChildren: './organization-settings-user/organization-settings-user.module#OrganizationSettingsUserPageModule' , canActivate: [LoginGuard] },
  { path: 'organizzazioneSettings/:id/Users/:id', loadChildren: './organization-settings-user-detail/organization-settings-user-detail.module#OrganizationSettingsUserDetailPageModule' , canActivate: [LoginGuard] },
  { path: 'user-detail-inviti/:id', loadChildren: './user-detail-inviti/user-detail-inviti.module#UserDetailInvitiPageModule', canActivate: [AuthInvitiGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
