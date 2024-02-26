import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { GeneralService } from 'src/app/services/general.service';
@Component({
  selector: 'web-chield-products',
  templateUrl: './chield-products.component.html',
  styleUrls: ['./chield-products.component.css'],
  styles: []
})
export class ChieldProductComponent implements OnInit  {
  constructor(private router:Router, public layoutService: LayoutService,private toastrService: ToastrService,private gSvc: GeneralService) 
  { }
  chields_stbs: any[] = [
    // { title: 'BMC-5', image: 'assets/img/stb/stb1.png', price: '300', description: 'Set Top Box (STB) is the customer premises equipment for viewing digital cable TV. STB allows a subscriber to view encrypted channels of his subscribed service package. Technofair is offering digital cable TV service through both HD Set Top Box and SD Set Top Box . Dual language selection option and lot more to make your TV viewing experience more enjoyable than ever.' },
    // { title: 'BMC-7', image: 'assets/img/stb/stb2.png', price: '200', description: 'Set Top Box (STB) is the customer premises equipment for viewing digital cable TV. STB allows a subscriber to view encrypted channels of his subscribed service package. Technofair is offering digital cable TV service through both HD Set Top Box and SD Set Top Box . Dual language selection option and lot more to make your TV viewing experience more enjoyable than ever.' },
    // { title: 'BMC-9', image: 'assets/img/stb/stb3.png', price: '200', description: 'Set Top Box (STB) is the customer premises equipment for viewing digital cable TV. STB allows a subscriber to view encrypted channels of his subscribed service package. Technofair is offering digital cable TV service through both HD Set Top Box and SD Set Top Box . Dual language selection option and lot more to make your TV viewing experience more enjoyable than ever.' }
  ]
  url:any=environment.baseurl;
  ngOnInit(): void {
   this.getProductGalleryList();
  };
  getProductGalleryList(){
    this.gSvc.postdata("Common/CmnProductGallery/GetAll",{}).subscribe(res => {
      this.chields_stbs=res;
    }, err => {
      this.toastrService.error();
    })
  }
}