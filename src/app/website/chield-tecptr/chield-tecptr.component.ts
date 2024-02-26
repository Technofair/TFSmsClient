import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ToastrService } from 'ngx-toastr';
import { GeneralService } from 'src/app/services/general.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'web-chield-tecptr',
  templateUrl:'./chield-tecptr.component.html',
  styleUrls: ['./chield-tecptr.component.css'],
  styles: []
})
export class ChieldTecptrComponent implements OnInit  {
  constructor(private router:Router, public layoutService: LayoutService,private toastrService: ToastrService,private gSvc: GeneralService,) 
  { }
  productGalleryList:any
  url:any=environment.baseurl;
  gridValue: any=1;
  chields_product:any=[{name:'product 1', image: 'assets/img/stb/stb1.png', price: '300',},{name:'product 1', image: 'assets/img/stb/stb1.png', price: '300',},{name:'product 1', image: 'assets/img/stb/stb1.png', price: '300',},{name:'product 1', image: 'assets/img/stb/stb1.png', price: '300',},{name:'product 1', image: 'assets/img/stb/stb1.png', price: '300',},{name:'product 1', image: 'assets/img/stb/stb1.png', price: '300',},{name:'product 1', image: 'assets/img/stb/stb1.png', price: '300',},{name:'product 1', image: 'assets/img/stb/stb1.png', price: '300',},{name:'product 1', image: 'assets/img/stb/stb1.png', price: '300',}];
  responsiveOptions:any
  ngOnInit(): void {
     this.getProductGalleryList();
     this.view()
  };
  // JavaScript Document
  getProductGalleryList(){
    this.gSvc.postdata("Common/CmnProductGallery/GetAll",{}).subscribe(res => {
      this.productGalleryList=res;
    }, err => {
      this.toastrService.error();
    })
  }
  view(){
   
    if(550>window.innerWidth){
      this.gridValue=1;
    }else if(550<window.innerWidth && 970>window.innerWidth){
      this.gridValue=2;
    }else if(970<window.innerWidth && 1200>window.innerWidth){
      this.gridValue=3;
    }else{
      this.gridValue=4;
    }
    
  }
}