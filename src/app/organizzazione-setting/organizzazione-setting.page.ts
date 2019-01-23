import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

import { ActivatedRoute } from '@angular/router';

import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { t } from '@angular/core/src/render3';
//import { ConsoleReporter } from 'jasmine';



export interface Org { 
  admin: any;
  colore: any;
  id:any;
  logo:any;
  nome: string;
  soci:any;
  tools:any;
  visibile:any;
}



@Component({
  selector: 'app-organizzazione-setting',
  templateUrl: './organizzazione-setting.page.html',
  styleUrls: ['./organizzazione-setting.page.scss'],
})
export class OrganizzazioneSettingPage implements OnInit {
  organizzazione$: Observable<any>;
  organizzazione: any;
  orgSubscription: any;
  adminCheck: any;
  tools: any;
  orgToolsList: any;
  toolsList$: Observable<any>;
  toolsListSubscription: any;
  toolsList: any;


  
  uid: string;
  admin: boolean;
  editing: boolean;
  staticValue: any;
  initDone: boolean=false;

  fileUrl:any;

  // Main task 
  task: AngularFireUploadTask;

  // Progress monitoring
  percentage: Observable<number>;

  snapshot: Observable<any>;

  // Download URL
  downloadURL: Observable<string>;

  // State for dropzone CSS toggling
  isHovering: boolean;

  



  constructor(    
    private router: Router,
    private afAuth: AngularFireAuth,
    public db: AngularFirestore, 
    private platform: Platform,
    private fireService: FireServiceService,
    //
    private route: ActivatedRoute,
    private storage: AngularFireStorage

    
    ) { }


    async ngOnInit() {
      this.fireService.getOrgAdminFromUid(this.route.snapshot.paramMap.get('id')).then(out => { 
        console.log('service eeeee eeee  eee', out)
        this.adminCheck = out;
      });
      await this.fireService.getOrgFromUid(this.route.snapshot.paramMap.get('id')).then(out => { 
        console.log(out)
        this.organizzazione = out.uid;
        this.organizzazione$ = out.data;
      })
      this.orgSubscription = await this.organizzazione$.subscribe(d => {
        this.orgToolsList = d.tools;
      })      

      this.toolsList$ = this.fireService.getCollectionFromEndpoint('tools/', 'tools')
      this.toolsListSubscription = this.toolsList$.subscribe(d => { 
        //console.log('vettore utenti associazione', d); 
        this.toolsList = [...d.map(val => {
          //console.log('valori', val);
          val['check'] = this.orgToolsList.includes(val.uid);
          //console.log(val, this.orgToolsList, this.orgToolsList.includes(val.uid));
          return val;
        })]
      })
    }

  ngOnDestroy(){
    console.log('distruggo la subscriptions')
    this.toolsListSubscription.unsubscribe()
    this.orgSubscription.unsubscribe()
  }


  cambioStato(uidTool,  bol){
    if(bol){this.orgToolsList.push(uidTool);}
    //else{this.orgToolsList = [...this.orgToolsList.filter(obj => obj.id !== uidTool)];}
    else{this.orgToolsList = [...this.orgToolsList.filter(obj => obj !== uidTool)];}
    this.updateChange(this.orgToolsList, 'tools')
  }

  updateChange(valore, descrizione){
    this.fireService.updateOrg(this.route.snapshot.paramMap.get('id'), descrizione, valore)
  }  


  goToDetailUserList(){
    console.log(this.organizzazione)
    this.router.navigate(['organizzazioneSettings/'+this.organizzazione+'/Users']);    
  }


// CAMBIO FOTO
toggleHover(event: boolean) {
  this.isHovering = event;
}

/// --------------------------------------------------
async startUpload(event: FileList, oldReference) {
  // The File object
  const oRef = oldReference;
  const file = event.item(0)

  // Client-side validation example
  if (file.type.split('/')[0] !== 'image') { 
    // spostare su pagina di gestione degli errori
    console.error('unsupported file type :( ')
    return;
  }

  // The storage path
  const path = `test/${new Date().getTime()}_${file.name}`;

  // Totally optional metadata
  const customMetadata = { app: 'My AngularFire-powered PWA!' };

  // The main task
  this.task = this.storage.upload(path, file, { customMetadata })
  
  //this.afStorage.storage. .upload(path, file, { customMetadata })

  // Progress monitoring
  this.percentage = this.task.percentageChanges();
  this.snapshot   = this.task.snapshotChanges()

  // The file's download URL
  this.downloadURL = await this.task.then(o => 
    {
      const u = 'gs://'+o.metadata.bucket+'/'+o.metadata.fullPath
      this.fileUrl = this.fireService.ritornaUrl2(u)
      .then(url => {this.updateChange(url, 'logo'); 
                    this.updateChange(u, 'reference');
                  })
      .then(_ => {console.log(u, this.staticValue); 
        try{  
          this.storage.storage.refFromURL(oRef).delete().then(function() {console.log('rimosso file')}).catch(function(error) {
          console.log('File non rimosso', error)
          // Uh-oh, an error occurred!
        });
          
        }
        catch(error){
          console.log(error)
        }
        
      })

      // url da salvare nell'istanza
})
}


// Determines if the upload task is active
isActive(snapshot) {
  return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes
}



}

/*  
async saveChange(uid, v){
    this.staticValue['descrizione']   = 'pippo'
    this.fireService.updateOrgAll(uid, this.staticValue)
  }

  ionRouteWillChange(){
    console.log('cambio')
  }


  */

