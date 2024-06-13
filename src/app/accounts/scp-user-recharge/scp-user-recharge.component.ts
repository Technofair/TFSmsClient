import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { balanceService } from 'src/app/global';
import { environment } from 'src/environments/environment';
import { Console } from 'console';


@Component({
  selector: 'app-scp-user-recharge',
  templateUrl: './scp-user-recharge.component.html',
  styleUrls: ['./scp-user-recharge.component.css'],
  providers: [ConfirmationService]
})
export class ScpUserRechargeComponent {
  list: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  frm!: FormGroup;
  secUserId:any;
  organizationList:any;
  progressStatus: boolean = true;
  users:any;

  companyBalance: any;

  constructor(private fb: FormBuilder,
     private router: Router,
     private confirmationService: ConfirmationService,
     private gSvc: GeneralService,
     private route: ActivatedRoute,
     private toastrService: ToastrService,
     private auth: AuthService,
     private balService: balanceService) {

  }
  ngOnInit(): void {
    debugger
    this.getfrm();
    this.getUserDebit();
    this.getSecUserType();
    this.getUserRechargeBalance();
  }
getfrm(){
  this.frm = new FormGroup({
    id: new FormControl(0),
    secUserId: new FormControl(Validators.required),
    amount: new FormControl(Validators.required),
    remarks:new FormControl(""), 
    createdBy: new FormControl(this.auth.getUserId()),
    createdDate: new FormControl(new Date()),
  });
}


  getUserRechargeBalance() {
            this.gSvc.postdata("api/ClientRecharge/GetClientRechargeBalanceByClientId_Asad?companyId=" + this.auth.getCompany(), {}).subscribe(res => {
            if (res != null) {
                this.companyBalance = res.balance;
            }
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }


  save() {
   // this.progressStatus = false;
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.gSvc.postdata("api/ScpUserRecharge/SaveUserRecharge", JSON.stringify(this.frm.value)).subscribe(res => {
          
          if(res.success){
            this.toastrService.success(res.message);
            this.balService.updateCurrentBalance(0);
            this.getUserDebit();
            this.getfrm();
          }
          else{
            this.toastrService.warning(res.message);
          }
                  

        }, err => {       
          this.toastrService.error("Error! Data Not Saved.");
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }
  getUserDebit() { 
      this.gSvc.postdata("api/ScpUserRecharge/GetUserRechargeByAnyKey?cmnCompanyId=" + this.auth.getCompany() + "&userLevel="+ this.auth.getUserLevel(), {}).subscribe(res => {
      //this.gSvc.postdata("api/ScpUserRecharge/GetAll", {}).subscribe(res => {
      this.list = res;
      this.progressStatus = true;
    }, err => {
      this.progressStatus = true;
      this.toastrService.error("List not found");
    })
  }


  edit(res: any) {
    debugger;    
    this.getSecUserType();
    this.frm.patchValue(res);
    console.log(res);
  }

  showModalDialog(res: any) {
    this.displayModal = true;
    this.reset();
    this.viewInfo = res;
  }
  getSecUserType() {
    this.gSvc.postdata("Security/User/GetSecUsersByCompanyAndUserLevel?cmnCompanyId=" + this.auth.getCompany() + "&userLevel="+ this.auth.getUserLevel(), {}).subscribe((res: any) => {
      
      this.users= res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }
 
  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }
  clear(table: Table) {
    table.clear();
  }
}