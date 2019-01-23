export interface Utenti {
    userId: string; 
    nome: string;
    tutorialComplete: boolean;
    email: string;
    cognome: string;
    displayName: string;
    orgPeferita: string,
    organizzazioni: any[],
    photoReferenceUrl: string;
    photoURL: string;

}

export interface Organizzazione {
    id: string;
    nome: string;
    descrizione: string;
    admin: any;
    colore: string;
    editing: boolean;
    reference: string;
    visibile: boolean;
}

export interface OrganizzazioniUtente {
    ref: string;
}


export interface Tools {
    nome: string;
    stato: string;
}


export interface Inviti {
    creatorId:string;
    destinatarioId: string;
    mail_invito: string;
    organizzazione: string;
    testo_invito: string;
}
// aggiungere cloud function che quando viene effettuato il cambio di stato aggiorna statistica ed elimina il record



export interface UtentiOrg {
    superadmin: boolean;
    admin: boolean;
    socio: boolean;
    utente: string;
}