import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import { FireServiceService } from './../fire-service.service';

import { Inviti} from './../app.model';

@Component({
  selector: 'app-organization-user-detail',
  templateUrl: './organization-user-detail.page.html',
  styleUrls: ['./organization-user-detail.page.scss'],
})
export class OrganizationUserDetailPage implements OnInit {
  uid : any;
  invitiSubscription: any;
  inviti$: Observable<Inviti[]>;
  inviti: any;
  organizzazione$: Observable<any>;
  organizzazioniSubscription: any;
  utenti: any;
  organizzazioneUtenti$: Observable<any[]>;
  organizzazioneUtentiSubscription: any;
  users: any;
  admin: any;
  staticValue: any;
  tipo: any;



  constructor(
    //private router: Router,
    //private afAuth: AngularFireAuth,
    //private platform: Platform,
    private fireService: FireServiceService,
    //
    private route: ActivatedRoute
  ) {
    this.tipo="utenti"
   }

ngOnDestroy(){
  console.log('distruggo la subscriptions')
  this.invitiSubscription.unsubscribe()
  this.organizzazioniSubscription.unsubscribe()
  this.organizzazioneUtentiSubscription.unsubscribe()
}

ngOnInit() {
    this.uid = this.route.snapshot.paramMap.get('id')
    this.inviti$ = this.fireService.getCollectionFromEndpoint('inviti', 'inviti')
    this.invitiSubscription = this.inviti$.subscribe(d => { console.log(d); this.inviti = d;})
    // ------------------------------------------------------------------------------------------------------------
    this.organizzazioneUtenti$ = this.fireService.getCollectionFromEndpoint('organizzazioni/'+this.uid+'/utenti', 'inviti')
    this.organizzazioneUtentiSubscription = this.organizzazioneUtenti$.subscribe(d => { 
      //console.log('vettore utenti associazione', d); 
      this.utenti = [...d.map(val => {
        //console.log('valori', val);
        this.fireService.getUserFromVRef(val.utente).then(out => { 
          //console.log(out); 
          val['utente'] = out;
        });
        return val;
      })]
    })
    // ---------------------------------------------------------------------------------------------------------
    this.organizzazione$ = this.fireService.db.doc('organizzazioni/'+this.uid).valueChanges()
    this.organizzazioniSubscription = this.organizzazione$.subscribe(data => 
      { //console.log(data);
      
        let a = this.fireService.getUserList(data.soci).then(out => { 
          //console.log(out); 
          this.users = out;
        
        });     

        let b = this.fireService.getUserList(data.admin).then(out => { 
          //console.log(out); 
          this.admin = out;
        
        });     


      
      })
    
    this.staticValue = this.fireService.getGenericData(this.organizzazione$)
  }

    segmentChanged(ev: any) {
      console.log('Segment changed', ev);

    }

    inviteUser(){
      console.log('avvio invito')
    }


}



