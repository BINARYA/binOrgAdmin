import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popoverutils',
  templateUrl: './popoverutils.component.html',
  styleUrls: ['./popoverutils.component.scss']
})
export class PopoverutilsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }


  buttonClick(testo){
    switch(testo) { 
      case 'Notifiche': { 
        console.log(testo)
      } 
      case 'Invito': { 
        console.log(testo)
        this.router.navigate(['user-detail-inviti', 'ciao']);    
        
      }
      default: { 
        console.log(testo)
        break
      } 
    } 
  }


}
