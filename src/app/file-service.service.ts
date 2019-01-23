import { Injectable } from '@angular/core';

//import { Router } from '@angular/router';

import { Observable } from 'rxjs';



import { FireServiceService } from './fire-service.service';
import { AngularFirestore } from '@angular/fire/firestore';


// ------- CONFIGURAZIONI --------------------------------------------------------------------------------------------
//import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
//import { ConsoleReporter } from 'jasmine';


@Injectable({
  providedIn: 'root'
})
export class FileServiceService {
  staticValue: any;
  uid: string;

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
    public db: AngularFirestore, 
    public fireService: FireServiceService,
    private storage: AngularFireStorage) { }


  updateUserChange(valore, chiave){
    console.log(valore, chiave);
    this.fireService.updateUserGeneric(valore, chiave)
  }
  


  // NOTE !!!!!!!!!!! -------------------------------------
  // PER UNIFORMARE il service bisogna standardizzare il campo logo e reference di organizzazioni e utenti
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
        .then(url => {
                      console.log(url)
                      this.updateUserChange(url, 'photoURL'); 
    //                  this.updateChange(u, 'photoReferenceUrl');
                    })
          .then(url => {
            console.log(u)
  //          this.updateChange(url, 'photoURL'); 
            this.updateUserChange(u, 'photoReferenceUrl');
          })
        .then(_ => {console.log(u); 
          this.storage.storage.refFromURL(oRef).delete().then(function() {
            console.log('rimosso file')
          }).catch(function(error) {
            console.log('File non rimosso', error)
            // Uh-oh, an error occurred!
          });
        })
  
        // url da salvare nell'istanza
  })
  
   
  
  }
  
  // Determines if the upload task is active
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes
  }


}
