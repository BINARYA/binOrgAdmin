import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// LOCAL SERVICES --------------------------------------------------
import { FireServiceService } from './../fire-service.service';
import { FileServiceService } from './../file-service.service';
import { AuthService } from './../auth-service.service';
// ---------------------------------------------------------------------
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-organizzazione',
  templateUrl: './add-organizzazione.page.html',
  styleUrls: ['./add-organizzazione.page.scss'],
})
export class AddOrganizzazionePage implements OnInit {
  test: any;
  gEvent: {'ciao': true};
  nome: any;
  descrizione: any;
  tools: any;


  toolsOrganizzazione: any;
  toolsOrganizzazione$: Observable<any[]>;
  toolsOrganizzazioneSubcription: any;


  constructor(private router: Router,
              public auth: AuthService, 
              public fireService: FireServiceService,
              public fileService: FileServiceService      
              ) { }


  ngOnDestroy(){
    //console.log('distruggo la subscriptions')
    this.toolsOrganizzazioneSubcription.unsubscribe()
  }

  ngOnInit() {
    this.toolsOrganizzazione$ = this.fireService.getCollectionFromEndpoint('tools/', 'tools')
    this.toolsOrganizzazioneSubcription = this.toolsOrganizzazione$.subscribe(d => { 
      this.toolsOrganizzazione = [...d.map(val => { val['check'] = false; return val;})]
    })
  }

  addOrg(nome,  descrizione){
    let t = (this.toolsOrganizzazione.filter(x => x.check == true)).map(t => {return t.uid})
    //console.log(nome,  descrizione, t)
    this.fireService.addOrganizzazione(nome,  descrizione, t)
  }

}
