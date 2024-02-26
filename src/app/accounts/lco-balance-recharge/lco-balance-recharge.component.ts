import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-digital-head',
  templateUrl: './lco-balance-recharge.component.html',
  styleUrls: ['./lco-balance-recharge.component.css'],
  providers: [ConfirmationService]
})
export class LcoBalanceRechargeComponent implements OnInit {

  digitalHeadList: any;

  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  companies:any;
  frm!:FormGroup
  rechargeList:any;
  paymentMoode:any=[{name:"Cash",id:1},{name:"Bkash",id:2},{name:"Rocket",id:3},{name:"Nagad",id:3}]
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService,private auth:AuthService) {
  
  }

  ngOnInit(): void {
   
    this.transferCreate();
    this.getCompany();
    this.getRecharge();
  }
 transferCreate(){
  this.frm = this.fb.group({
    id: new FormControl(0),
    date: new FormControl(new Date()),
    refNo: new FormControl("asd"),
    currentAmount:new FormControl(),
    amount: new FormControl(0),
    payMode:new FormControl(),
    bank:new FormControl(),
    branch:new FormControl(),
    bankAccount:new FormControl(),
    remarks: new FormControl(),
    isActive: new FormControl(),
    balance: new FormControl(0),
    cmnCompanyId:new FormControl(),
    anFPaymentMethodId:new FormControl(),
    createdBy: new FormControl(this.auth.getUserId()),
    createdDate: new FormControl(new Date()),
    modifiedBy: new FormControl(this.auth.getUserId()),
    modifiedDate: new FormControl(new Date()),
  });
 }
  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        debugger
          this.gSvc.postdata("api/ClientRecharge/Save", JSON.stringify(this.frm.value)).subscribe(res => {
            this.reset();
            
            this.toastrService.success("Data Saved Success");
          }, err => {
            this.toastrService.error("Error! Data Not Saved");
          })
        
      },
      reject: () => {

      }

    })
    return false;
  }

  
  getCompany() {
    this.gSvc.postdata("Common/Company/GetClientByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
      this.companies = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }
  getRecharge() {
    var cid=this.auth.getCompany();
    this.gSvc.postdata("api/ClientRecharge/GetRechargeHistoryPackageByClientId?companyId="+cid,{} ).subscribe((res: any) => {
      this.rechargeList = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }
  edit(res: any) {
   this.frm.patchValue(res);
  }
  
  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/account/balance-recharge')
  }
  clear(table: Table) {
    table.clear();
  }
  reset() { 
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
   }
}