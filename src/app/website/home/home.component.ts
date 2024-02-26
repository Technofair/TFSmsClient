import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { WebMenuComponent } from 'src/app/website/menu/menu.component';
import { TopNavBarComponent } from '../topnavbar/topnavbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ChieldSliderComponent } from '../chield-slider/chield-slider.component';
import { ChieldPackagesComponent } from '../chield-packages/chield-packages.component';
import { ChieldProductComponent } from '../chield-products/chield-products.component';
import { ChieldPaywithComponent } from '../chield-paywith/chield-paywith.component';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-web',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class WebHomeComponent implements OnInit {

  @ViewChild(TopNavBarComponent) topNavBar!: TopNavBarComponent;
  @ViewChild(FooterComponent) footer!: FooterComponent;
  @ViewChild(ChieldPackagesComponent) packages!: ChieldPackagesComponent;
  @ViewChild(ChieldProductComponent) products!: ChieldProductComponent;
  @ViewChild(ChieldPaywithComponent) paywiths!: ChieldPaywithComponent;
 
  constructor(private router: Router, public layoutService: LayoutService, private toastrService: ToastrService,private gSvc:GeneralService ) { }
  
  info:any;
  ngOnInit(): void {
   this.getMsoInfo();
  };
  login() {
    this.router.navigateByUrl(environment.baseurl + '#/login')
  }
  getMsoInfo(){
    this.gSvc.getdata("Common/Company/GetMainServiceOperator").subscribe(res => {
      this.info = res;
    }, err => {
      this.toastrService.error("Logo Not found ");
    })
  }
  
}
