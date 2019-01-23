import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { ActivatedRoute } from '@angular/router';

import { Platform } from '@ionic/angular';


import { FireServiceService } from './../fire-service.service';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
//import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFirestoreModule, AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';

import { switchMap, first, map } from 'rxjs/operators';

import { Inviti, UtentiOrg } from './../app.model';


import { ToastController } from '@ionic/angular';



@Component({
  selector: 'app-organization-settings-user',
  templateUrl: './organization-settings-user.page.html',
  styleUrls: ['./organization-settings-user.page.scss'],
})
export class OrganizationSettingsUserPage implements OnInit {
  organizzazione$: Observable<any>;
  organizzazioniSubscription: any;
  invitiCollection$: AngularFirestoreCollection<Inviti>;
  invitiSubscription: any;
  inviti$: Observable<Inviti[]>;
  inviti: any;
  uid : any;
  users: any;
  admin: any;
  staticValue: any;
  tipo: any;
  organizzazioneUtentiSubscription: any;
  utenti: any;

  invitiMail: any;

  organizzazioneUtentiCollectionRef: AngularFirestoreCollection<UtentiOrg>;
  organizzazioneUtenti$: Observable<any[]>;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    public db: AngularFirestore, 
    private platform: Platform,
    private fireService: FireServiceService,
    //
    private route: ActivatedRoute,
    public toastController: ToastController
  ) {
    this.tipo="utenti"
    this.invitiMail = '';
   }

ngOnDestroy(){
  //console.log('distruggo la subscriptions')
  this.invitiSubscription.unsubscribe()
  //await this.organizzazioniSubscription.unsubscribe()
  this.organizzazioneUtentiSubscription.unsubscribe()
}

ngOnInit() {
  //console.log('pagina di dettaglio utenti')
/*
    this.fireService.getOrgAdminFromUid(this.route.snapshot.paramMap.get('id')).then(out => { 
      console.log('service eeeee eeee  eee', out)
      this.adminCheck = out;
    });
*/
    this.uid = this.route.snapshot.paramMap.get('id')

    this.inviti$ = this.fireService.getCollectionFromEndpoint('inviti', 'inviti')
    this.invitiSubscription = this.inviti$.subscribe(d => { this.inviti = d;})
    // ------------------------------------------------------------------------------------------------------------
    this.organizzazioneUtenti$ = this.fireService.getCollectionFromEndpoint('organizzazioni/'+this.uid+'/utenti', 'organizzazioneUtenti')
    this.organizzazioneUtentiSubscription = this.organizzazioneUtenti$.subscribe(d => { 
      //console.log('vettore utenti associazione', d); 
      this.utenti = [...d.map(val => {
        //console.log('valori', val);

        this.fireService.getOrgSuperAdminFromUid(this.uid, val.uid).then(out => { 
          //console.log(out); 
          val['superAdmin'] = out;
        });        
        // estrarre il superadmin 
//console.log(val.utente)
        this.fireService.getUserFromIdAll(val.utente_id).then(out => { 
          //console.log(out); 
          val['utente'] = out;
        });
        //console.log('valori', val);
        return val;
      })]
    })

  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  sendInvite(mail){
//    console.log('avvio invito')
    const testo = ''
    this.fireService.addInvito(mail, this.uid, testo).then(out => {console.log(out); this.invioSuccessToast(mail); })
    this.invitiMail = '';
  }

  deleteInvite(uid){
  //  console.log(uid)
    this.fireService.genericDelete(uid)
  }


  goToDetail(userUid){
    //console.log(this.uid)
    this.router.navigate(['organizzazioneSettings/'+this.uid+'/Users/'+userUid]);    
    
  }
  
  spamToast(mail){
    this.invioSuccessToast(mail);
  }


  async invioSuccessToast(mail) {
    const toast = await this.toastController.create({
      message: 'Il tuo invito per '+mail+'è stato spedito !!',
      duration: 1500,
      showCloseButton: true,
      closeButtonText: 'OK',
      position: 'top',
      cssClass: 'pippo'
    });
    toast.present();
  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      message: 'Click to Close',
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'Done'
    });
    toast.present();
  }

  goToInvito(id){
    this.router.navigate(['user-detail-inviti/', id]);    
  }


}



