import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { GeneralService } from 'src/app/services/general.service';


@Component({
  selector: 'web-app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  styles: [`
  :host ::ng-deep .pi-eye,
  :host ::ng-deep .pi-eye-slash {
      transform:scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
  }
`]
})
export class FooterComponent implements OnInit  {
  constructor(private router:Router, public layoutService: LayoutService,private toastrService: ToastrService,private gSvc :GeneralService) 
  { }
 
 
  mso:any;
  ngOnInit(): void {
   this.getMsoInfo();
  };
  
  getMsoInfo(){
    this.gSvc.getdata("Common/Company/GetMainServiceOperator").subscribe(res => {
      this.mso = res;
    }, err => {
      this.toastrService.error(err.message);
    })
  }
}
