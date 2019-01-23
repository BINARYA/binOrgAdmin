import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
 
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';


import { FireServiceService } from './../fire-service.service';
import { AuthService } from './../auth-service.service';

import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(//private storage: Storage, 
    private router: Router,
    private fireService: FireServiceService,
    private auth: AuthService) {}

 canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): Observable<boolean> {

      //console.log(this.router)

      return this.auth.user$.pipe(
        take(1),
        map(user => !!user), // <-- map to boolean
        tap(loggedIn => {
          if (!loggedIn) {
//            console.log('access denied')
            this.router.navigate(['login/'+this.fireService.invitoCode]);    
          }
          else{
            //this.router.goBack()
            console.log('sono dentro, da valutare dove andare', + this.router.url)    
          }
        })
      )

  }
}