import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// ---- FIREBASE --------------------------------------
import * as firebase from 'firebase';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule} from '@angular/fire/firestore';
import { FirestoreSettingsToken} from '@angular/fire/firestore'; // <--- Add to fix @firebase/firestore: Firestore (5.8.0): timestampsInSnapshots #1993
import { AngularFireStorageModule } from '@angular/fire/storage';
import { PopoverutilsComponent } from './popoverutils/popoverutils.component';

// 
// Initialize Firebase


//var storage = firebase.storage();
//var pathReference = storage.ref('logo_trasparente.png');

import { configurazioneSeCRETA } from '../env';
const config = new configurazioneSeCRETA().config 


@NgModule({
  declarations: [AppComponent, PopoverutilsComponent],
  entryComponents: [PopoverutilsComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(config), // <-- firebase here
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule
    // To initialize AngularFire
    //firebase.initializeApp(config);
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: FirestoreSettingsToken, useValue: {}}, // <--- Add to fix @firebase/firestore: Firestore (5.8.0): timestampsInSnapshots #1993
    //AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}


