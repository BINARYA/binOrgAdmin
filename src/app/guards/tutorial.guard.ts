import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'; 
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { FireServiceService } from './../fire-service.service';
import { map } from 'rxjs/operators';


import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class TutorialGuard implements CanActivate {

  constructor(//private storage: Storage, 
              private router: Router,
              public loadingController: LoadingController,
              private fireService: FireServiceService) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): Promise<boolean> {


//  const loadingt = await this.loadingController.create({duration: 200, spinner:'lines'});
    const getus = await this.fireService.getUser();

 
    if(!getus.tutorialComplete){
      this.router.navigateByUrl('/tutorial');
      //return false;
    }
    return getus.tutorialComplete;
    }

}

/*
async presentLoading() {
  const loading = await this.loadingController.create({
    message: 'Hellooo',
    duration: 2000
  });
  return await loading.present();
}
*/