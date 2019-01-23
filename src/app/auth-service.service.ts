import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Utenti, Tools, Inviti, UtentiOrg, OrganizzazioniUtente } from './app.model';


import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';


import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  
  user$: Observable<Utenti>;
  invitoCode: any;

  constructor(
      private afAuth: AngularFireAuth,
      private db: AngularFirestore,
      public afStorage: AngularFireStorage,
      private router: Router
  ) { 
    // Get the auth state, then fetch the Firestore user document or return null
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
          // Logged in
        if (user) {
          return this.db.doc<Utenti>(`utenti/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    )
  }

  async googleSignin() {
    try {
    const provider = new firebase.auth.GoogleAuthProvider() 
    this.afAuth.auth.languageCode = 'it';
    //firebase.auth().languageCode = 'it';
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    const update = await this.updateUserData(credential.user);
    //console.log(update)   
    if(this.invitoCode != ''){
      //console.log('redirezione verso inviti')
      this.router.navigate(['user-detail-inviti', this.invitoCode]);
    }  
    else{
      //console.log('redirezione verso radice')
      this.router.navigate(['/']);
    }
    //console.log('fine')
  }
  catch(err) {
    console.log('esco', err);
    this.afAuth.auth.signOut();
  }

}


  private updateUserData(user) {
    //console.log('creo', user)
    // Sets user data to firestore on login
    // removed the type fo avoid the problem. this becouse i dont want to overwrite the info if alredy there
    const userRef: AngularFirestoreDocument = this.db.doc(`utenti/${user.uid}`);

    const data = { 
      user: user.uid, 
      email: user.email,
      uid: user.uid
    } 

    return userRef.set(data, { merge: true })

  }

  async signOut() {
    await this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }  


async getUSerUid(){
  const uUid = await this.afAuth.auth.currentUser.uid;
  //console.log(uUid);
  return uUid
}


}

