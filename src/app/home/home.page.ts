import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { first, tap, map, take } from 'rxjs/operators';

// -- per la login nativa ---------------------
//import { GooglePlus } from '@ionic-native/google-plus';
import { Platform } from '@ionic/angular';


import { FireServiceService } from './../fire-service.service';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
//import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFirestoreModule, AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
// ------- CONFIGURAZIONI --------------------------------------------------------------------------------------------
import { Organizzazione } from './../app.model';

import { PopoverController } from '@ionic/angular';
import { PopoverutilsComponent } from '../popoverutils/popoverutils.component';

import { OrganizzazioniUtente, Utenti } from './../app.model';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  orgUtente: any[];
  organizzazioniUtente$: Observable<any[]>;
  organizzazioniUtenteSubcription: any;


  userRef: any;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    public db: AngularFirestore, 
    //private platform: Platform,
    public fireService: FireServiceService,
    public popoverController: PopoverController
  ){
    this.orgUtente = [];
  }

  async presentPopover(ev: any) {
    //console.log(ev);
    const popover = await this.popoverController.create({
      component: PopoverutilsComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

ngOnInit(){
    /* temporaneo 
    this.fireService.getUser().then(o => {console.log('pipe su utente');  
      if (!!o.orgPeferita){ this.router.navigate(['organizzazioneDetail', o.orgPeferita]);} 
    })
*/





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


    
  }

  ngOnDestroy(){
    //console.log('distruggo la subscriptions')
    this.organizzazioniUtenteSubcription.unsubscribe()    
  }

  goToDetail(item){
    //console.log(item)
    this.router.navigate(['organizzazioneDetail', item.uid]);    
  }

  goToAddOrganizzazione(){
    this.router.navigate(['addOrganizzazione']);    
  }

}
