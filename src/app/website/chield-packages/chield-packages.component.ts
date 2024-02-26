import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { GeneralService } from 'src/app/services/general.service';


@Component({
  selector: 'web-chield-packages',
  templateUrl: './chield-packages.component.html',
  styleUrls: ['./chield-packages.component.css'],
  styles: []
})
export class ChieldPackagesComponent implements OnInit  {
  constructor(private router:Router, public layoutService: LayoutService,private toastrService: ToastrService,private gSvc: GeneralService ) 
  { }
  packages:any;
  //packages: any = [{ title: 'Gold', image: 'assets/img/package/1.png', price: '300', description: '',channels:'200' }, { title: 'Silver', image: 'assets/img/package/2.png', price: '200', description: '',channels:'200' },{ title: 'Platinum', image: 'assets/img/package/4.png', price: '200', description: '',channels:'200' },{ title: 'Silver', image: 'assets/img/package/3.png', price: '200', description: '',channels:'200' }]
  ngOnInit(): void {
   this.getPackages();
  };
  
  getPackages(){
    this.gSvc.getdata("Subscription/Package/GetPackageDetailByCompanyId?companyId=1").subscribe(res => {
      this.packages = res;
      this.packages.count=0;
    }, err => {
      this.toastrService.error("Error ! Data is not saved . ");
    })
  }
}