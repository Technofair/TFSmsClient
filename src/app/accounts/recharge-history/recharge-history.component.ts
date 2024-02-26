import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Utility } from 'src/app/services/utility.service';

@Component({
  selector: 'app-digital-head',
  templateUrl: './recharge-history.component.html',
  styleUrls: ['./recharge-history.component.css'],
  providers: [ConfirmationService]
})
export class RechargeHistoryComponent implements OnInit {

  digitalHeadList: any;
  paymentMoode: any[] = [];
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  organizationList:any;
  balanceTransferList:any;
  progressStatus:boolean=true;
  frm!:FormGroup;
  resFrm!:FormGroup;
  reviceView:boolean=false;
  isMso: boolean = this.auth.isMso();

  constructor(private fb: FormBuilder,public util: Utility, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private auth:AuthService, private toastrService: ToastrService, private _util: Utility) {
  }

  ngOnInit(): void {
    this.transferCreate();
    this.getClientByCompanyId();
    this.getActivePaymentMode();
    this.search();
    this.reviceFrm();
  }

 

  transferCreate(){
    this.frm = this.fb.group({
      cmnCompanyId: new FormControl(),
      fromDate: new FormControl(this._util.preMonthDay()),
      toDate: new FormControl(this._util.Today()),
      paymentMethodId: new FormControl()
    });
   }

  getActivePaymentMode() {
    this.gSvc.postdata("api/PaymentMethod/GetActivePaymentMode", {}).subscribe((res: any) => {
      this.paymentMoode = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

 

  search() {
  
    if(this.isMso == false){
      this.frm.controls['cmnCompanyId'].setValue(this.auth.getCompany());
    }
    this.progressStatus=false;
    this.gSvc.postdata("api/ClientRecharge/GetRechargeHistoryPackageByClientAndDate",  JSON.stringify(this.frm.value)).subscribe(res => {
    this.balanceTransferList = res;
    this.progressStatus=true;
    }, err => {
    this.progressStatus=true;
      this.toastrService.error("Error! Charge Amount list not found");
    })
  }
  getClientByCompanyId() {
    this.gSvc.postdata("Common/Company/GetClientByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
      this.organizationList = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  edit(id: any) {
    this.formId = 1;
    this.gSvc.postdata("api/DigitalHead/DigitalHead/" + id + "", {}).subscribe((res: any) => {
      this.frm.controls['headName'].setValue(res.headName);
      this.frm.controls['headType'].setValue(res.headType);
      this.frm.controls['remarks'].setValue(res.remarks);
      this.frm.controls['id'].setValue(res.id);
    }, err => {
      this.toastrService.error("Error! Digital Head not found");
    })
  }

  showModalDialog(id:any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("api/DigitalHead/DigitalHead/" + id + "", {}).subscribe((res: any) => {
      this.viewInfo = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/admin/digitalhead')
  }
  clear(table: Table) {
    table.clear();
  }
  reset() { 
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
   }
   reviceFrm(){
    this.resFrm = this.fb.group({
      id:new FormControl(0),
      scpClientRechargeId: new FormControl(),
      approvalStatus: new FormControl(0),
      comments: new FormControl(),
      amount: new FormControl(0),
      date: new FormControl(this.util.Today()),
      doneBy: new FormControl(this.auth.getUserId()),
      cmnCompanyId:new FormControl(0),
    });
   }
   reviseBalanceSave(){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
       
       
        this.gSvc.postdata("api/ClientRechargeApproval/ReviseBalance", JSON.stringify(this.resFrm.value)).subscribe((res: any) => {
          this.toastrService.success("Balance revice success.Success!");
          this.reviceView=false;
        }, err => {
          this.toastrService.error("Error! Data Not Found");
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  
  }
  reviseBalance(data:any){
    this.reviceView=true;
   this.resFrm.controls['scpClientRechargeId'].setValue(data.id);
   this.resFrm.controls['cmnCompanyId'].setValue(data.cmnCompanyId);
  }
}