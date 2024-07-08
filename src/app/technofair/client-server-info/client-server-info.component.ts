import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-customer-server-info',
  templateUrl: './client-server-info.component.html',
  styleUrls: ['./client-server-info.component.css'],
  providers: [ConfirmationService]
})
export class ClientServerInfoComponent {
  companyCustomerlist: any;
  customerServerList:any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  id: any;
  frm!: FormGroup;  
  util: any;
  serverTypelist:any = [
    {servername: "Application"},
    {servername: "DB"}
  ];
  
  constructor(
    private fb: FormBuilder
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService
    , private toastrService: ToastrService
    , private route: ActivatedRoute
    , private auth: AuthService
  ) {

 }

 ngOnInit(): void{
  this.initialize();
  this.getCustomerServerInfo();
  this.getCompany();
 }

 initialize(){
  this.frm = new FormGroup({
    id: new FormControl(0),
    tFACompanyCustomerId: new FormControl(Validators.required),
    serverIP: new FormControl("",[Validators.required]),
    motherBoardId: new FormControl(Validators.required),
    networkAdapterId: new FormControl(),
    createdBy: new FormControl(this.auth.getUserId()),
    createdDate: new FormControl(new Date()),
    modifiedBy: new FormControl(this.auth.getUserId()),
    modifiedDate: new FormControl(new Date())
  })
}


 save() {
  if (this.frm.invalid) return false;
  this.confirmationService.confirm({
    message: 'Are you sure that you want to proceed?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      if (this.frm.controls['id'].value == 0) {
        this.frm.controls['createdBy'].setValue(this.auth.getUserId());
        this.frm.controls['createdDate'].setValue(new Date());
      } else if (this.frm.controls['id'].value > 0) {
        this.frm.controls['modifiedBy'].setValue(this.auth.getUserId());
      } 
      this.gSvc.postdata("api/TFAClientServerInfo/Save", JSON.stringify(this.frm.value)).subscribe(res => {
        if (res.success) {
          this.initialize();
          this.getCustomerServerInfo();          
          this.toastrService.success(res.message);
        }
        else {
          this.toastrService.warning(res.message);
        }
      }, err => {
        this.toastrService.error("Error! Data not save.");
      })
      return true;
    },
    reject: () => {
    }
  })
  return false;
}

getCustomerServerInfo() {
  this.gSvc.postdata("api/TFAClientServerInfo/GetAll", {} ).subscribe(res => {    
    this.customerServerList = res;
  }, err => {
    this.toastrService.error("Error! Company list not found ");
  })
 
}

getCompany() {
  this.gSvc.postdata("api/TFAClientServerInfo/GetAll", {} ).subscribe(res => {
    this.companyCustomerlist = res;
  }, err => {
    this.toastrService.error("Error! Company list not found ");
  })
 
}

edit(res: any) {  
  this.formId = 1;
  this.frm.patchValue(res);
}

clear(){

}

}
