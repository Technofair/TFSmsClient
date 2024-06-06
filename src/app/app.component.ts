import { Component, OnDestroy, HostListener, OnInit } from '@angular/core'; //New OnDestroy
import { PrimeNGConfig } from 'primeng/api';
import { LayoutService } from './layout/service/app.layout.service';
import { AuthService } from 'src/app/services/auth.service'; //New

// New
import { IdleService } from './layout/service/idle.service';
import { Subscription } from 'rxjs';
// End

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
//New
export class AppComponent implements OnInit, OnDestroy {

  title = 'tfsmsclient';
  idleSubscription: Subscription | undefined; //New
 
  // New
  constructor(private primengConfig: PrimeNGConfig, private layoutService: LayoutService, private auth: AuthService, private idleService: IdleService){}
  //Old
  //constructor(private primengConfig: PrimeNGConfig, private layoutService: LayoutService){}
  ngOnInit(){
    this.primengConfig.ripple=true;

       //optional configuration with the default configuration
       this.layoutService.config = {
        ripple: false,                      //toggles ripple on and off
        inputStyle: 'outlined',             //default style for input elements
        menuMode: 'static',                 //layout mode of the menu, valid values are "static" and "overlay"
        colorScheme: 'light',               //color scheme of the template, valid values are "light" and "dark"
        theme: 'lara-light-indigo',         //default component theme for PrimeNG
        scale: 14                           //size of the body font size to scale the whole application
    };

    // New
    this.idleSubscription = this.idleService.getIdleState().subscribe((isIdle: boolean) => {
      if (isIdle) {
        // Perform logout action
        this.auth.logout();
      } else {
        // Reset idle timer
        this.idleService.resetTimer();
      }
    });

    //End

  }


  ngOnDestroy(): void {
    if (this.idleSubscription) {
      this.idleSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.auth.logout();
  }

  @HostListener('window:mousemove') onMouseMove() {
    this.idleService.resetTimer();
  }

  @HostListener('window:keydown') onKeyDown() {
    this.idleService.resetTimer();
  }



}
