import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';

import { FireServiceService } from './../fire-service.service';
import { AuthService } from './../auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInvitiGuard implements CanActivate {
  constructor(private auth: AuthService, 
              private router: Router, 
              private route: ActivatedRoute ) {}

  canActivate( next: ActivatedRouteSnapshot,
               state: RouterStateSnapshot
             ): Observable<boolean> | Promise<boolean> | boolean {

      //console.log(this.route.snapshot)

      return this.auth.user$.pipe(
           take(1),
           //tap(user => console.log(user)),
           map(user => !!user),
           tap(loggedIn => {
             if (!loggedIn) {
               //console.log('access denied')
               this.router.navigate(['/login']);
             }
            //console.log('accesso concesso')
         })
    )
  }
}