import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { FireServiceService } from './../fire-service.service';
import { AuthService } from './../auth-service.service';

import { PopoverController } from '@ionic/angular';
import { PopoverutilsComponent } from '../popoverutils/popoverutils.component';
import { Observable, of, combineLatest, empty } from 'rxjs';


import { Inviti } from './../app.model';

@Component({
  selector: 'app-user-detail-inviti',
  templateUrl: './user-detail-inviti.page.html',
  styleUrls: ['./user-detail-inviti.page.scss'],
})
export class UserDetailInvitiPage implements OnInit {
  id: any;
  invito: any;
  invitoSubscribe: any;
  org: any;
  orgUid: any;
  //user: any;

  constructor ( private route: ActivatedRoute,
                public popoverController: PopoverController,
                public fireService: FireServiceService,   
                private auth: AuthService,    
                private router: Router

    ) { 
  }

async ngOnInit() {  
    this.auth.getUSerUid()
    this.id = this.route.snapshot.paramMap.get('id');
    this.invito = await this.fireService.getInvitoFromUid(this.id)
    //console.log(this.invito)
    this.invitoSubscribe = this.invito.subscribe(i => {
      this.orgUid = i.organizzazione
      this.getOrg(i);
    })
  }

async getOrg(d){
  const org = await this.fireService.getOrgFromUid(d.organizzazione)
  this.org = org.data;
}

joinOrganizzazione(){
  console.log(this.invito, this.orgUid);
  let a = {}
  a['stato'] = { 'accettato':true, 'attivo':false, 'letto':true, 'rifiutato':false }
  a['destinatarioId'] = this.fireService.afAuth.auth.currentUser.uid
  this.fireService.updateInvitoFromUid(this.id, a)
  this.fireService.updateUSerOrgData(this.fireService.afAuth.auth.currentUser.uid, this.orgUid)
  //this.fireService.addNewUtenteToORg(this.orgUid)
  this.router.navigate(['home'])
}

declineInvite(){
  console.log(this.invito);
  let a = {}
  a['stato'] = { 'accettato':false, 'attivo':false, 'letto':true, 'rifiutato':true }
  a['destinatarioId'] = this.fireService.afAuth.auth.currentUser.uid;
  this.fireService.updateInvitoFromUid(this.id, a)
  this.router.navigate(['home'])
}



}
