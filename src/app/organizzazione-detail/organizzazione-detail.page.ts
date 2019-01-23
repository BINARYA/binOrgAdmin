import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { FireServiceService } from './../fire-service.service';
import { AuthService } from './../auth-service.service';

import { ActivatedRoute } from '@angular/router';
//import { CompileShallowModuleMetadata } from '@angular/compiler';

@Component({
  selector: 'app-organizzazione-detail',
  templateUrl: './organizzazione-detail.page.html',
  styleUrls: ['./organizzazione-detail.page.scss'],
})
export class OrganizzazioneDetailPage implements OnInit {
  adminCheck: any;
  organizzazione: any;
  organizzazione$: Observable<any>;
  tools: any;

  constructor(    
    private router: Router,
    private fireService: FireServiceService,
    private auth: AuthService,
    private route: ActivatedRoute
) { 
  this.adminCheck =false;
}


async ngOnInit() {
    this.fireService.getOrgAdminFromUid(this.route.snapshot.paramMap.get('id')).then(out => { 
      //console.log('service eeeee eeee  eee', out)
      this.adminCheck = out;
    });
    await this.fireService.getOrgFromUid(this.route.snapshot.paramMap.get('id')).then(out => { 
      //console.log(out)
      this.organizzazione = out.uid;
      this.organizzazione$ = out.data;
    })
    this.organizzazione$.subscribe(d => {
      //console.log(d);
      this.fireService.getToolsFromUidArray(d.tools).then(out => { this.tools = out;});     
    })      
  }

  ngOnDestroy(){
    console.log('distruggo la subscriptions')
    //this.organizzazione$.unsubscribe()    
  }

  goToSetting(id){
    this.router.navigate(['organizzazioneSetting', id]);    
  }

  goToTool(n, uid){
    console.log(n, uid)
  }


}
