import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { GeneralService } from 'src/app/services/general.service';


@Component({
  selector: 'app-topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.css'],
  styles: [`
  :host ::ng-deep .pi-eye,
  :host ::ng-deep .pi-eye-slash {
      transform:scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
  }
`]
})
export class TopNavBarComponent implements OnInit  {
  constructor(private router:Router, public layoutService: LayoutService,private toastrService: ToastrService,private gSvc:GeneralService ) 
  { }
  msoInfo:any
  logopath:any 
  packages:any[]=[{title:'Gold',image:'/image1.png',price:'300',description:''},{title:'Silver',image:'/image2.png',price:'200',description:''}]
  stb:any=[{title:'BMC 9',image:'/image1.png',price:'300',description:''},{title:'Silver',image:'/image2.png',price:'200',description:''}]
  ngOnInit(): void {
   this.getMsoInfo();
  };
  login(){
    this.router.navigateByUrl(environment.baseurl+'#/login')
  }
  getMsoInfo(){
    this.gSvc.getdata("Common/Company/GetMainServiceOperator").subscribe(res => {
      
      this.msoInfo = res;
      this.logopath= environment.baseurl+this.msoInfo.logo;
    }, err => {
      this.toastrService.error("Logo Not found ");
    })
  }
}
