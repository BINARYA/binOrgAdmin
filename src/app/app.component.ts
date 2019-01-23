import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { FireServiceService } from './fire-service.service';

import { timer } from 'rxjs/observable/timer';

import { Observable } from 'rxjs';
import { version } from 'punycode';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  orgUtente: any;
  organizzazioniUtente$: Observable<any[]>;
  organizzazioniUtenteSubcription: any;

  public appPages = [
    {
      title: 'Organizations',
      url: '/home',
      icon: 'contacts'
    },
    {
      title: 'Settings',
      url: '/appSettings',
      icon: 'cog'
    },
    {
      title: 'Info',
      url: '/info',
      icon: 'information-circle-outline'
    }

  ];
  showSplash = true;


  constructor(
    private platform: Platform,
    public router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private afAuth: AngularFireAuth,
    private fireService: FireServiceService
    

  ) {
    this.initializeApp();



  }

initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      timer(3000).subscribe(() => this.showSplash = false)
    })//.then(() => this.startOrg());
  }


async startOrg(){
    /* temporaneo */
  this.fireService.getUser().then(o => {console.log('pipe su utente', o);  

    //if (!!o.orgPeferita){ this.router.navigate(['organizzazioneDetail', o.orgPeferita]);} 
    this.organizzazioniUtente$ = this.fireService.getCollectionFromEndpoint('utenti/'+this.afAuth.auth.currentUser.uid+'/organizzazioni', 'organizzazioniUtente')
    this.organizzazioniUtenteSubcription = this.organizzazioniUtente$.subscribe(orgList => {
      this.orgUtente = [...orgList.map(val => {
        //console.log(val)
        this.fireService.getOrgFromUid(val.uid).then(out => { 
          //console.log(out)
          val['organizzazione'] = out;
        });
        return val;
      })]
    })
  })
}

  checkRoute(p){

    if(p == '/home' && this.router.routerState.snapshot.url != '/info'  && this.router.routerState.snapshot.url != '/appSettings'){
      return true
    }

    return this.router.routerState.snapshot.url == p
  }
/*
  goToDetail(item){
    //console.log(item)
    this.router.navigate(['organizzazioneDetail', item.uid]);    
  }
*/
}



