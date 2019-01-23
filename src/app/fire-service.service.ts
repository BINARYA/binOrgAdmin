import { config } from './app.config';
import { Utenti, Tools, Inviti, UtentiOrg, OrganizzazioniUtente } from './app.model';
import { Organizzazione } from './app.model';
import { Injectable } from '@angular/core';  
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

import { Observable, of, combineLatest, empty } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';
import { forEach } from '@angular/router/src/utils/collection';

import { tap, map, take } from 'rxjs/operators';


import { AuthService } from './auth-service.service';

// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------
// VALUTARE come ottimizzare le chiamate usando il local storage ---------------------------------
// -----------------------------------------------------------------------------------------------
// Provare a salvare il blocco o un id di versione -----------------------------------------------
// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------


@Injectable({
  providedIn: 'root'
})
export class FireServiceService {
  private fUser: firebase.User;
  collectionRef: AngularFirestoreCollection<any>;
  user$: Observable<any>;
  userUid: string;

  // -----------------------------------------------------------------
  utentiCollectionRef: AngularFirestoreCollection<Utenti>;
  utenteDoc: AngularFirestoreDocument<Utenti>;
  // -- non ricordo a cosa serve -----------------
  utenti$: Observable<Utenti[]>;
  utente$: Observable<Utenti>;

  // -----------------------------------------------------------------
  organizzazioneCollectionRef: AngularFirestoreCollection<Organizzazione>;
  organizzazioneDoc: AngularFirestoreDocument<Organizzazione>;
  //organizzazione$: Observable<Organizzazione[]>;
  organizzazione$: Observable<any[]>;
  //organizzazioneDetail$: Observable<any>;
  // --------------------------------------------------------------------
  toolCollectionRef: AngularFirestoreCollection<Tools>;
  tools$: Observable<any[]>;
  toolsCollection$: Observable<any[]>;
  toolsCollection: any;
  //organizzazione$: any[];
  // ---------------------------------------------------
  //tutorialIsEnd: Observable<boolean>;
  tutorialIsEnd: boolean;
  
//  emailVerified: <string>;
//  photoURL: <string>;


invitiCollectionRef: AngularFirestoreCollection<Inviti>;
invitiDoc: AngularFirestoreDocument<Inviti>;
inviti$: Observable<Inviti[]>;

organizzazioneUtentiCollectionRef: AngularFirestoreCollection<UtentiOrg>;
organizzazioneUtenti$: Observable<any[]>;

invitoCode: any;
orgList: any;

organizzazioniUtenteCollectionRef: AngularFirestoreCollection<OrganizzazioniUtente>;
organizzazioniUtente$: Observable<any[]>;
organizzazioniUtenteSubcription: any;

utenteEsiste: boolean;

constructor(public db: AngularFirestore, 
            private auth: AuthService,
              public afAuth: AngularFireAuth,
              public afStorage: AngularFireStorage,
              private platform: Platform,
              private router: Router,
              public loadingController: LoadingController              
              ) {
                console.log('invito code non creato', this.invitoCode)
                this.invitoCode = '';
                console.log('invito code inizializzato', this.invitoCode)
                this.user$ = this.afAuth.authState.pipe(
                  switchMap(user => {
                    if (user) {

                      const userRef = this.db.doc<Utenti>(`utenti/${user.uid}`)
                      
                      console.log('controllo User', user)
                       const userTemp = userRef.valueChanges()
                      return userTemp;
                      // bisogna agganciare le org dentro l'utente
                    } else {
                      return of(null);
                    }
                  })
                );
                
                

  }

  getUser() {
    return this.user$.pipe(first()).toPromise();
  }



  createUtente(uid, user){
    console.log(uid, user)
    const userRef = this.db.doc<Utenti>(`utenti/${uid}`)
    const data = { 
      userId: user.uid, 
      email: user.email, 
      photoURL: user.photoURL,
      cognome: "",
      displayName: user.displayName,
      emailVerified: "",
      nome: "",
      orgPeferita: "",
      organizzazioni: [],
      photoReferenceUrl: "gs://binarya-services.appspot.com/test/1543886585378_Senzanomev2.png",
      //photoURL: "https://firebasestorage.googleapis.com/v0/b/binarya-services.appspot.com/o/test%2F1543886585378_Senzanomev2.png?alt=media&token=04029bd1-37fb-4fdc-a935-5ddda8a731e3",
      tutorialComplete: false
    } 
//console.log(data);
    userRef.set(data, { merge: true })
    //return true
  }


// gestione storage  
async ritornaUrl(){
  let p = ''
  const ref = await this.afStorage.storage.refFromURL('gs://binarya-services.appspot.com/logo_trasparente.png');
  await ref.getDownloadURL().then(u => p = u)
  console.log(p);
  return p
  //ref.getDownloadURL().then(u => console.log(u))
}

async ritornaUrl2(reference){
  let p = ''
  const ref = await this.afStorage.storage.refFromURL(reference);
  await ref.getDownloadURL().then(u => p = u)
  console.log(p);
  return p
  //ref.getDownloadURL().then(u => console.log(u))
}


  // -----------------------------------------------------
  // LOGIN SECTION -----------------------------------------------------
  // -----------------------------------------------------
    // -----------------------------------------------------
      // -----------------------------------------------------
        // -----------------------------------------------------
  async webLogin(prov): Promise<void> {
    const provider = {'googleWeb': new firebase.auth.GoogleAuthProvider(), 
                      'facebookWeb': new firebase.auth.FacebookAuthProvider()}

    const credential = await this.afAuth.auth.signInWithPopup(provider[prov])
    .then(out => {
      console.log(out.user, this.invitoCode, out.user.uid);
      this.db.collection<Utenti>('utenti').doc(out.user.uid).valueChanges().pipe(take(1,)).subscribe(val => {
        console.log('uscita', val); 
        if (val == null){
          console.log('utente da creare', out.user.uid, out)
          this.createUtente(out.user.uid, out.user)  
        }
        else {console.log('utente NON da creare')}
      })
    })

      console.log(this.invitoCode)      
      if(this.invitoCode != ''){
        console.log('redirezione verso inviti')
        this.router.navigate(['user-detail-inviti', this.invitoCode]);
      }  
      else{
        console.log('redirezione verso radice')
        this.router.navigate(['/']);
      }
      console.log('fine')
      
 
  }

  login(prov) {
    if (this.platform.is('cordova')) {
      //this.nativeGoogleLogin();
      console.log('login nativa TBD')
    } else {
      this.webLogin(prov);
      }
  }

  signOut() {
  this.afAuth.auth.signOut();
  this.router.navigate(['/']);
  }
  // -----------------------------------------------------
  // END LOGIN SECTION -----------------------------------------------------
  // -----------------------------------------------------
    // -----------------------------------------------------
      // -----------------------------------------------------
        // -----------------------------------------------------
          // -----------------------------------------------------













// -----------------------------------------------------
// RETRIVE DATA -----------------------------------------------------
// -----------------------------------------------------




getGenericData(a){
  return  a.pipe(first()).toPromise();
}



/*
  async getOrg() {  
    console.log('attivo organizzazioni')
    let user = await this.getUser();
    console.log('PESCO UTENTE',  user, this.afAuth.auth.currentUser)
    if (user){
      this.organizzazione$ = await user.organizzazioni.map(o => {
        //console.log(o.id); 
        const orgDoc = this.db.doc('organizzazioni/'+o.id);
        const org = orgDoc.valueChanges()
        const orgDiz = {
          uid: o.id,
          data: org
        }
        //console.log(orgDiz)
        return orgDiz;
      })
      
      //user['org'] = org
      console.log(user)
      // inserire la correzione dei valori 
      //console.log( await this.afAuth.auth.currentUser)
      //return user
      if (user.displayName == ''){
        console.log('vuoto')
      }
      this.checkInfo(user)
    }

  }
*/

///////////////////////////////////////////////////////////////////////////////////////

// estraggo la collezzione di tools disponibili
// in questo modo non usa l'async pipe nel template. ma non capisco perchè
async getToolCollection() {  
  //console.log('cerco la collezzione di tools disponibili')
  this.toolCollectionRef = this.db.collection<Tools>(config.collection_endpoint_tools)
  this.toolsCollection$ = this.toolCollectionRef.snapshotChanges().pipe(map(actions => {
    return actions.map(a => {
      const data = a.payload.doc.data() as Tools;
      const uid = a.payload.doc.id;
      //console.log({ uid, ...data })
     return { uid, ...data };
    });
  }));
  this.toolsCollection$.subscribe(d => { console.log(d); this.toolsCollection = d;})

}

getInvitiCollection() {  
  //console.log('cerco la collezzione di tools disponibili')
  this.invitiCollectionRef = this.db.collection<Inviti>(config.collection_endpoint_inviti)
  this.inviti$ = this.invitiCollectionRef.snapshotChanges().pipe(map(actions => {
    return actions.map(a => {
      const data = a.payload.doc.data() as Inviti;
      const uid = a.payload.doc.id;
      //console.log({ uid, ...data })
     return { uid, ...data };
    });
  }));
  return this.inviti$
  //this.inviti$.subscribe(d => { console.log(d); this.toolsCollection = d;})

}





getOrganizzazioneListService(){
  console.log('ciao dal service')
  this.organizzazioneCollectionRef = this.db.collection<Organizzazione>(config.collection_endpoint_organizzazioni)
  //this.organizzazione2$ =  this.organizzazioneCollectionRef.valueChanges()
  this.organizzazione$ = this.organizzazioneCollectionRef.snapshotChanges().pipe(map(actions => {
    return actions.map(a => {
      //const 
      //if (a.payload.doc.id in )
      //Get document data
      const data = a.payload.doc.data() as Organizzazione;
      //Get document id
      const uid = a.payload.doc.id;
      //Use spread operator to add the id to the document data
      console.log({ uid, ...data })

      //if 


      //const userUuid = await this.afAuth.auth.currentUser.uid;
//        if (userUuid in data.soci){
//          console.log('sono dentro')
//        }


      return { uid, ...data };

    });
  }));
}















// ----------------------------------------------------------------------------
// Mi porto fuori un vettore con uid e osservable dei dati ----------------------
// ---------------------------------------------------------------------------------
async getTools2(ref) {  
  return await ref.map(t => {
    console.log(t); 
    const toolDoc = this.db.doc(t);
    const tool = toolDoc.valueChanges()

    const toolDiz = {
      uid: t.id,
      data: tool
    }
    console.log(toolDiz)
    return toolDiz;
  })
}
// -------------------------------------------------------

async getUserList(ref) {  
  return await ref.map(t => {
    console.log(t); 
    const userDoc = this.db.doc(t);
    const user = userDoc.valueChanges()

    const userDiz = {
      uid: t.id,
      data: user
    }
    console.log(userDiz)
    return userDiz;
  })
}













// estraggo i tools che sono selezionati in una org
async getTools(ref) {  
    this.tools$ = await ref.map(t => {
      console.log(t); 
      const toolDoc = this.db.doc(t);
      const tool = toolDoc.valueChanges()

      const toolDiz = {
        uid: t.id,
        data: tool
      }
      console.log(toolDiz)
      return toolDiz;
    })
    console.log(this.tools$)
    return this.tools$
  }








// -----------------------------------------------------
// Utility -----------------------------------------------------
// -----------------------------------------------------

async checkInfo(user){
  const v = ['photoURL', 'displayName']
  await v.forEach(d => { if (user[d] == ''){user[d] = this.afAuth.auth.currentUser[d]} })
  this.updateUserData(user)
}


// -----------------------------------------------------
// -----------------------------------------------------
// -----------------------------------------------------


// -----------------------------------------------------
// UPDATE DATA -----------------------------------------------------
// -----------------------------------------------------

async updateUserData(data){
  const utenteRef = await this.db.doc(`utenti/${this.afAuth.auth.currentUser.uid}`);
  utenteRef.set(data, { merge: true });
}

/*
updateUserData2(uid, id, nome, organizzazioni, tutorialComplete) {
    const utenteRef = this.db.doc(`utenti/${uid}`);
    const data = {
      id,
      nome,
      organizzazioni,
      tutorialComplete
    };
    return utenteRef.set(data, { merge: true });
  }
*/





goToDetail(p){
  console.log(p);
}

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

// -----------------------------------------------------------------------------------
// tiro furoi il dataset di un certo utente in base ad un vettore di riferimenti
// ---------------------------------------------------------------------------------------
getCollectionFromEndpoint(collectionEndpoint, tipo) {  
  switch(tipo) { 
    case 'inviti': { 
      //const collection = this.firestore.collection<User>('users', ref => ref.where('email', '==', email))
      this.invitiCollectionRef = this.db.collection<Inviti>(collectionEndpoint); 
      this.inviti$ = this.invitiCollectionRef.snapshotChanges().pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Inviti;
          const uid = a.payload.doc.id;
          //console.log({ uid, ...data })
          return { uid, ...data };
        });
      }));
      return this.inviti$
    } 
    // recupera la lista delle organizzazioni salvate per un utente
    case 'organizzazioniUtente': { 
      this.organizzazioniUtenteCollectionRef = this.db.collection<OrganizzazioniUtente>(collectionEndpoint)
      this.organizzazioniUtente$ = this.organizzazioniUtenteCollectionRef.snapshotChanges().pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as OrganizzazioniUtente;
          const uid = a.payload.doc.id;
          //console.log({ uid, ...data })
         return { uid, ...data };
        });
      }));
      return this.organizzazioniUtente$
    }    
    // recupera la lista degli utenti per organizzazione
    case 'organizzazioneUtenti': { 
      this.organizzazioneUtentiCollectionRef = this.db.collection<UtentiOrg>(collectionEndpoint)
      this.organizzazioneUtenti$ = this.organizzazioneUtentiCollectionRef.snapshotChanges().pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as UtentiOrg;
          const uid = a.payload.doc.id;
          console.log({ uid, ...data })
         return { uid, ...data };
        });
      }));
      return this.organizzazioneUtenti$
    }     
    case 'tools': { 
      //console.log('cerco la collezzione di tools disponibili')
      this.toolCollectionRef = this.db.collection<Tools>(collectionEndpoint)
      this.toolsCollection$ = this.toolCollectionRef.snapshotChanges().pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Tools;
          const uid = a.payload.doc.id;
          //console.log({ uid, ...data })
         return { uid, ...data };
        });
      }));
      return this.toolsCollection$
    }     
    default: { 
        break
    } 
  } 
}



// -----------------------------------------------------------------------------------
// tiro furoi il dataset di un certo utente in base ad un vettore di riferimenti
// ---------------------------------------------------------------------------------------
async getUserFromVRefArray(refArray) {  
  return await refArray.map(k => {
    const doc = this.db.doc(k);
    const user = doc.valueChanges()
    const userDiz = {
      uid: k.id,
      data: user
    }
    return userDiz;
  })
}
// -----------------------------------------------------------------------------------
// tiro furoi il dataset di un certo utente in base ad un vettore di riferimenti
// ---------------------------------------------------------------------------------------
async getUserFromVRef(ref) {  
  console.log(ref)
    const doc = this.db.doc(ref);
    const user = doc.valueChanges()
    const userDiz = {
      uid: ref.id,
      data: user
    }
    return userDiz;
}

async getUserFromIdAll(uUid) {  
  console.log(uUid)
    const doc = this.db.collection<Utenti>('utenti/').doc(uUid);
    const user = doc.valueChanges()
    const userDiz = {
      uid: uUid,
      data: user
    }
    return userDiz;
}


async getUserFromId(id) {  
  const doc = this.db.collection<Organizzazione>('utenti/').doc(id);
  const user = doc.valueChanges()
  return user
}



// ----------------------------------------------------------------------
// !!!  lavorare sugli uid facilita l'inserimento dei dati !!!! 
// -----------------------------------------------------------------
async getOrgFromUid(uid) {  
  const doc = this.db.collection<Organizzazione>('organizzazioni/').doc(uid); //this.db.doc<Organizzazione>(ref)
  const org = doc.valueChanges()
  const orgDiz = {
    uid: uid,
    data: org
  }
  return orgDiz;
}

async getOrgAdminFromUid(uid) {  
  const doc = this.db.collection<Organizzazione>('organizzazioni/'+uid+'/utenti').doc(this.afAuth.auth.currentUser.uid); //this.db.doc<Organizzazione>(ref)
  const org = doc.valueChanges()
  const orgDiz = {
    uid: uid,
    data: org
  }
  return orgDiz;
}

async getOrgSuperAdminFromUid(orgUid, userUid) {  
  const doc = this.db.collection<Organizzazione>('organizzazioni/'+orgUid+'/superAdmin').doc(userUid); //this.db.doc<Organizzazione>(ref)
  const user = doc.valueChanges()
  const orgDiz = {
    uid: userUid,
    data: user
  }
  return orgDiz;
}



async getToolsFromUidArray(uidArray) {  
  return await uidArray.map(t => {
    console.log(t);
    const toolDocRef = this.db.collection<Tools>('tools/').doc(t);
    const tool = toolDocRef.valueChanges()
    const toolDiz = {
      uid: t,
      data: tool
    }
    return toolDiz;
  })
}

async getToolFromUid(uid) {  
  const doc = this.db.collection<Tools>('tools/').doc(uid); //this.db.doc<Organizzazione>(ref)
  const tool = doc.valueChanges()
  const toolDiz = {
    uid: uid,
    data: tool
  }
  return toolDiz;
}

async getInvitoFromUid(uid) {  
  const doc = this.db.collection<Inviti>('inviti/').doc(uid); //this.db.doc<Organizzazione>(ref)
  const invito = doc.valueChanges()
  return invito;
}



/*
async getOrgAdminFromUid(uid) {  
  const doc = this.db.collection<Organizzazione>('organizzazioni/'+uid+'/superAdmin').doc(this.afAuth.auth.currentUser.uid); //this.db.doc<Organizzazione>(ref)
  const org = doc.valueChanges()
  const orgDiz = {
    uid: uid,
    data: org
  }
  return orgDiz;
}

*/



  async addInvito(mail, orgUid, testo){
    // aggiungo un logo di default !!!!!!!!!!!
    let user =  await this.getUser();
    console.log(user)
    let outData = {};
    const refInvitiCollectionRef = this.db.collection<Inviti>(config.collection_endpoint_inviti)
    let i = {
      mail_invito: mail,
      organizzazione: orgUid,
      creatorId: this.afAuth.auth.currentUser.uid,
      destinatarioId: '',
      testo_invito: testo,
      stato :{
        attivo: true,
        accettato: false,
        rifiutato: false,
        letto: false
      },
      errore: {
        invio_errato: false,
        descrizione_errore: ''
      }
    }
    await refInvitiCollectionRef.add(i)
    .then(data=>{console.log(data); outData = data})
    return outData;
  } 

  async genericDelete(ref){
    // aggiungo un logo di default !!!!!!!!!!!
    //let outDelete = {};
    const reference = this.db.doc<Inviti>(`${config.collection_endpoint_inviti}/${ref}`)
    reference.delete()
    //const doc = await this.db.doc(reference).delete().then(out => { console.log(out); });
    return true;
  }



// --------------------------------------------------------------
// ADD SECTION --------------------------------------------------------

async addOrganizzazione(nome,  descrizione, tools){
  // aggiungo un logo di default !!!!!!!!!!!
  //const toolsReference = tools.map(t => {return this.getReferenceTools(t) }) // <-- Deve ritornare il riferimento
  const col = this.db.collection(`${config.collection_endpoint_organizzazioni}`)
  const uuid = this.afAuth.auth.currentUser.uid; 
  const utenteRef = this.db.doc(`utenti/${uuid}`);
  let a = await {
    'id': '0002',
    'nome': nome,
    'descrizione': descrizione,
    'admin': [uuid],
    'colore': '#ff0000',
    'editing': false,
    'reference': 'gs://binarya-services.appspot.com/default/default1234567.png',
    'visibile': true,
    'logo': 'https://firebasestorage.googleapis.com/v0/b/binarya-services.appspot.com/o/default%2Fbetspin200.jpg?alt=media&token=f3834a2a-bea9-493e-bb1c-b1c7ee1a3465',
    'soci': [this.afAuth.auth.currentUser.uid],
    'tools': tools,
    // aggiungere in cloud function
    //'utenti': { uuid : { 'admin' : true, 'socio' : true, 'superAdmin' : true, 'utente' : '/utenti/'+uuid, 'utente_id': uuid } },
    //'superAdmin': { uuid : { 'ref' : '/utenti/'+uuid, 'utente_id': uuid } }
  }
  col.add(a).then(newOrg => {
     console.log(newOrg.id);
     //this.aggiungiOrgToUser(newOrg.id);
     //const orgRef = this.db.doc<Organizzazione>(`${config.collection_endpoint_organizzazioni}/${newOrg.id}`)
     const orgRef = this.db.collection<Organizzazione>('organizzazioni').doc(newOrg.id); 
     this.updateUSerOrgData(uuid, newOrg.id)
     console.log('aggiungo lorganizzazione tra i preferiti dellutente')
     this.createOrgUtentiList(newOrg.id, uuid)
     // da fare in cloud functions
     console.log('Creo collezzione utenti e assegno valori')
     // da fare in cloud functions
     this.createOrgSuperAdminList(newOrg.id, uuid)
     console.log('Creo SuperAdmin e assegno valori')
    }).then(_ => {this.router.navigateByUrl('/home')})

}    


createOrgUtentiList(orgUid, uUid){
  const orgUtentiRef: AngularFirestoreDocument = this.db.doc(`organizzazioni/${orgUid}/utenti/${uUid}`);
  const data = { 'admin' : true, 'socio' : true, 'superAdmin' : true, 'utente' : 'utenti/'+uUid, 'utente_id': uUid }
  orgUtentiRef.set(data, { merge: true })
}

createOrgSuperAdminList(orgUid, uUid){
  const orgSuperAdminRef: AngularFirestoreDocument = this.db.doc(`organizzazioni/${orgUid}/superAdmin/${uUid}`);
  const data = { 'ref' : 'utenti/'+uUid, 'id': uUid }
  orgSuperAdminRef.set(data, { merge: true })
}

addNewUtenteToORg(orgUid){
  const uUid = this.afAuth.auth.currentUser.uid;
  const orgUtentiRef: AngularFirestoreDocument = this.db.doc(`organizzazioni/${orgUid}/utenti/${uUid}`);
  const data = { 'admin' : false, 'socio' : true, 'superAdmin' : false, 'utente' : 'utenti/'+uUid, 'utente_id': uUid }
  orgUtentiRef.set(data, { merge: true })
}



 /*


getReferenceTools(t){
  return (this.db.doc<Tools>(`${config.collection_endpoint_tools}/${t}`)).ref
 }


aggiungiOrgToUser(orgUid) {
  //  const utenteRef = await this.db.doc(`utenti/${this.afAuth.auth.currentUser.uid}`);
//    utenteRef.set(data, { merge: true });

    const orgRef = this.db.doc<Organizzazione>(`${config.collection_endpoint_organizzazioni}/${orgUid}`)
    const userUuid = this.afAuth.auth.currentUser.uid;
    // dovremmo centralizzare l'utente in local storage modo da non interrogarlo ogni volta

    const utenteRef = this.db.doc(`utenti/${userUuid}`);
    this.updateUSerOrgData(userUuid, orgUid, orgRef)  
    
  }
*/
// creare dataset transitorio che prende il comando salva
updateOrg(id, descrizione, valore) {
  this.organizzazioneDoc = this.db.doc<Organizzazione>(`${config.collection_endpoint_organizzazioni}/${id}`);
  console.log(id, descrizione, valore)
  let a = {}
  a[descrizione] = valore;
  this.organizzazioneDoc.update(a);

//this.organizzazione$.  .update({ durata: (attivita.durata + 100) });
}

updateOrgAll(id, update) {
  this.organizzazioneDoc = this.db.doc<Organizzazione>(`${config.collection_endpoint_organizzazioni}/${id}`);
  console.log('aggiorno', id)
  this.organizzazioneDoc.update(update);
}





  updateUSerOrgData(userUid, orgUid) {
    // aggiungo organizazione 
    console.log('aggiungo organizazione ')
    const userRef: AngularFirestoreDocument<OrganizzazioniUtente> = this.db.doc(`utenti/${userUid}/organizzazioni/${orgUid}`);
    const data = { ref: 'organizzazioni/'+orgUid } 
    userRef.set(data, { merge: true })
  }  


  updateInvitoFromUid(uid, a) {
    const invitoRef: AngularFirestoreDocument<Inviti> = this.db.doc(`inviti/${uid}`);
    //const statoRichiesta = { 'stato': } 
    invitoRef.update(a)
  }  

  async updateUserTutorial(bol) {

    const userUuid = this.afAuth.auth.currentUser.uid;
    const newData = await this.getUser() as Utenti

    console.log(userUuid, newData)
    const utenteRef = this.db.doc(`utenti/${userUuid}`);
    newData.tutorialComplete = bol;  

    return utenteRef.set(newData, { merge: true });
  }

  async updateUserGeneric(val, key) {
    const userUuid = this.afAuth.auth.currentUser.uid;
//    const newData = await this.getUser() as Utenti
    const utenteRef = this.db.doc(`utenti/${userUuid}`);
    let a = {}
    a[key] = val;  
    //return await utenteRef.set(newData, { merge: true });
    return await utenteRef.update(a) //.set(newData, { merge: true });
  }



/*


*/









}




/*
  getOrg() {
    let utente;
    const joinKeys = {};

    return this.user$.pipe(
      switchMap( u => {
          utente = u;
          // identificativi org
          const organizzazioniUids = Array.from(new Set(u.organizzazioni.map(o => o.uid)));
        
        // Firestore e Org Doc Reads
        const organizzazioni = organizzazioniUids.map(o => 
          //this.db.collection<Organizzazione>(config.collection_endpoint_organizzazioni)
          this.db.doc<Organizzazione>('organizzazioni/${o}').valueChanges()
        );

        return organizzazioni.length ? combineLatest(organizzazioni) : of([]);
        }),
        map(arr => {
          //console.log(arr);
          arr.forEach(v => (joinKeys[(<any>v).uid] = v));
          utente.organizzazioni = utente.oraganizzazioni.map(v => {
            return { ...v, org: joinKeys[v.uid] };
          });
          console.log(utente)
          return utente;
        })
      );
  }
*/



    

/*
  getInfo(){
    this.utenteDoc = this.db.doc<Utenti>('utenti/'+this.fUser.uid);
    this.utente$ = this.utenteDoc.valueChanges()
  }
*/





  /* 
  // ----------------------------------------------------------------------------
  // LOGIN VIA MAIL SERVICE----------------------------------------------------------------------------  
  var actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be whitelisted in the Firebase Console.
    url: 'http://localhost:8100/home',
    // This must be true.
    handleCodeInApp: true,
    iOS: {
      bundleId: 'com.example.ios'
    },
    android: {
      packageName: 'com.example.android',
      installApp: true,
      minimumVersion: '12'
    }
  };
  */

  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------



  // ------------------------------------------------------------------------------
  // RETRIVE DATA ------------------------------------------------------------------------------    
  // ------------------------------------------------------------------------------



  // ------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------
  
  // ------------------------------------------------------------------------------------
  // -- ATTIVA OSSERVABLE SUGLI ENDPOINT ----------------------------------------------------
  // ------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------



/*
  getOrganizzazioneListService(){
    console.log('ciao dal service')
    this.organizzazioneCollectionRef = this.db.collection<Organizzazione>(config.collection_endpoint_organizzazioni)
    //this.organizzazione2$ =  this.organizzazioneCollectionRef.valueChanges()
    this.organizzazione$ = this.organizzazioneCollectionRef.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        //const 
        //if (a.payload.doc.id in )
        //Get document data
        const data = a.payload.doc.data() as Organizzazione;
        //Get document id
        const uid = a.payload.doc.id;
        //Use spread operator to add the id to the document data
        console.log({ uid, ...data })

        //if 


        //const userUuid = await this.afAuth.auth.currentUser.uid;
//        if (userUuid in data.soci){
//          console.log('sono dentro')
//        }


        return { uid, ...data };

      });
    }));
  }


  getUtentiService(){
    console.log('ciao dal service degli utenti')
    this.utentiCollectionRef = this.db.collection<Utenti>(config.collection_endpoint_utenti)
    //this.organizzazione2$ =  this.organizzazioneCollectionRef.valueChanges()
    // ----------------------------
    this.utenti$ = this.utentiCollectionRef.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        //Get document data
        const data = a.payload.doc.data() as Utenti;
        //Get document id
        const uid = a.payload.doc.id;
        //Use spread operator to add the id to the document data
        console.log({ uid, ...data })
        return { uid, ...data };
      });
    }));
  }


    getUtenti(){
      console.log('ciao')
      this.organizzazioneCollectionRef = this.db.collection<Organizzazione>(config.collection_endpoint_organizzazioni)
      //return this.organizzazioneCollectionRef;
    }

    addUtente(utente){
        // aggiungo un utente
      this.utentiCollectionRef.add(utente)
    }    

    updateUtente(id, update) {
      this.utenteDoc = this.db.doc<Utenti>(`${config.collection_endpoint_organizzazioni}/${id}`);
      this.utenteDoc.update(update);
    }
*/












