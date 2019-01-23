import { Component, OnInit } from '@angular/core';

import { FireServiceService } from './../fire-service.service';
import { AuthService } from './../auth-service.service';

// -- per la login nativa ---------------------
//import { GooglePlus } from '@ionic-native/google-plus';
//import { Platform } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { LoadingController } from '@ionic/angular';
import { tap, map, take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(    public fireService: FireServiceService,  
                  private auth: AuthService,    
                  private route: ActivatedRoute,
                  private router: Router,
                  public loadingController: LoadingController

    ) {

     }

  ngOnInit() {
    //console.log('controllo invito code', this.fireService.invitoCode)
    //this.fireService.invitoCode = this.returnCode(this.route.snapshot.paramMap.get('id'))
    this.auth.invitoCode = this.returnCode(this.route.snapshot.paramMap.get('id'))
    //console.log('modifica invito code', this.fireService.invitoCode)
  }

  returnCode(a){if(a!= null){return a}return ''}

  async loginLogic(){
    this.auth.googleSignin();
  }



}
