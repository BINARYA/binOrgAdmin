import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


// LOCAL SERVICES --------------------------------------------------
import { FireServiceService } from './../fire-service.service';
import { FileServiceService } from './../file-service.service';
import { AuthService } from './../auth-service.service';
// ---------------------------------------------------------------------


import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.page.html',
  styleUrls: ['./app-settings.page.scss'],
})
export class AppSettingsPage implements OnInit {

  public appUtilsSettings = [
    {
      title: 'Language',
      url: '/info',
      icon: 'cog'
    },
    {
      title: 'Feedback',
      url: '/info',
      icon: 'notifications'
    },
    {
      title: 'Privacy',
      url: '/info',
      icon: 'information-circle-outline'
    },
    {
      title: 'Tutorial',
      url: '/tutorial',
      icon: 'paper'
    },
    {
      title: 'Licenses',
      url: '/info',
      icon: 'school'
    }

  ];

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
    private router: Router,
    public auth: AuthService, 
    public fireService: FireServiceService,
    public fileService: FileServiceService,
    private storage: AngularFireStorage

  ) { 


  }

  ngOnInit() {

  }
// ------------------------------------------------------------------------------------------
// --------- STORAGE SERVICE -----------------------------------------------------
/// --------------------------------------------------
updateChange(valore, chiave){
  console.log(valore, chiave);
  this.fireService.updateUserGeneric(valore, chiave)
}

seeTutorial(){
  this.fireService.updateUserTutorial(false);
  this.router.navigate(["/tutorial"]);    
}

goTo(url){
  //console.log(url)
  this.router.navigate([url]);    
}



// CAMBIO FOTO
toggleHover(event: boolean) {
  this.isHovering = event;
}

async startUpload(event: FileList, oldReference) {

  console.log('pippo')
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
                    this.updateChange(url, 'photoURL'); 
  //                  this.updateChange(u, 'photoReferenceUrl');
                  })
        .then(url => {
          console.log(u)
//          this.updateChange(url, 'photoURL'); 
          this.updateChange(u, 'photoReferenceUrl');
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






