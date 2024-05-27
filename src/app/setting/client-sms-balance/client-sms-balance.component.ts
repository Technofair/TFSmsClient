import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-client-sms-balance',
  templateUrl: './client-sms-balance.component.html',
  styleUrls: ['./client-sms-balance.component.css'],
  providers: [ConfirmationService]
})
export class ClientSmsBalanceComponent {
  companyCustomerList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  id: any;
  frm!: FormGroup;  
  toastrService: any;
  CmnCompanyCustomerId :any;
  clientSMSBalance:any

  constructor(
    private fb: FormBuilder
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService    
    , private auth: AuthService
   
  ) {

 }

 ngOnInit(): void{
  this.initialize() 
  this.getCompanyCustomer();
  this.getClientSmsBalance();
 }


 initialize(){
  this.frm = new FormGroup({
    id: new FormControl(0),  
    rate: new FormControl([Validators.required]),    
    balance: new FormControl([Validators.required]),  
    noOfMessage: new FormControl([Validators.required]),
    isActive: new FormControl(true,[Validators.required]),
    CmnCompanyCustomerId: new FormControl([Validators.required]),
    date: new FormControl(new Date(),[Validators.required]),
    createdBy: new FormControl(this.auth.getUserId()),
    createdDate: new FormControl(new Date()),
    modifiedBy: new FormControl(this.auth.getUserId()),
    modifiedDate: new FormControl(new Date()),
  });
 }


 save(){
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

      console.log(JSON.stringify(this.frm.value))
      
      this.gSvc.postdata("api/ClientSMSBalance/Save", JSON.stringify(this.frm.value)).subscribe(res => {
        
        if (res == undefined) {
          
          this.toastrService.error("Something went wrong");
        }
        else {
          this.toastrService.error("Error! Data not save.");
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


 getClientSmsBalance() { 
  this.gSvc.postdata("api/ClientSMSBalance/GetAll", {}).subscribe(res => {
    this.clientSMSBalance = res;      
  }, err => {      
    this.toastrService.error("List not found");
  })
}

// for dropdown
getCompanyCustomer() {
  this.gSvc.postdata("api/CompanyCustomer/GetAll", {} ).subscribe(res => {
    this.companyCustomerList = res;
    //this.progressStatus=true;
  }, err => {
    //this.progressStatus=true;
    this.toastrService.error("Error! Company list not found ");
  })
}

 edit(res :any){
  debugger;    
  this.getClientSmsBalance();
  this.frm.patchValue(res);

 }

 reset(){

 }

 clear(){

 }

 showModalDialog(){
  this.displayModal = true;
  this.reset();
  this.initialize();
 }
}
