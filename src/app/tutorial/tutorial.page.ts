import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FireServiceService } from './../fire-service.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {
  slideOpts = {
    effect: 'slide',
    paginationType: 'progress'

  };
  constructor(private router: Router,
    private fireService: FireServiceService

    ) { }

  ngOnInit() {
    console.log('entro in tut')

  }

async  tutorialEnd(){
  let u = await this.fireService.getUser()
  console.log(u)
  if (u.tutorialComplete){
    this.router.navigateByUrl('/appSettings');
  }
  else {
    await this.fireService.updateUserTutorial(true);
    this.router.navigateByUrl('/home');
  }

}


}