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
  userRechargeBalance: any;
  displayUserRecharge: boolean = false;
  displayUserRechargeRefund: boolean = false;
  viewInfo: any = {};
  formId = 0;
  frm!: FormGroup;
  frmRrfund!: FormGroup;
  
  secUserId:any;
  organizationList:any;
  progressStatus: boolean = true;
  users:any;
  clientAvailableBalance: any;
  clientCurrentBalance: any;

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
    this.getfrm();
    this.getFrmRrfund()
    //this.getUserRecharge();
    this.getSecUser();
    this.getClientAvailableRechargeBalance();
    this.getClientCurrentRechargeBalance();
    this.getUserRechargeBalance();
  }
getFrmRrfund(){
  this.frmRrfund = new FormGroup({
    id: new FormControl(0),
    cmnCompanyId:new FormControl(this.auth.getCompany(),Validators.required),
    secUserId: new FormControl(Validators.required),
    amount: new FormControl(Validators.required),
    remarks:new FormControl(""), 
    createdBy: new FormControl(this.auth.getUserId()),
    createdDate: new FormControl(new Date()),
  });
}
getfrm(){
  this.frm = new FormGroup({
    id: new FormControl(0),
    cmnCompanyId:new FormControl(this.auth.getCompany(),Validators.required),
    secUserId: new FormControl(Validators.required),
    amount: new FormControl(Validators.required),
    remarks:new FormControl(""), 
    createdBy: new FormControl(this.auth.getUserId()),
    createdDate: new FormControl(new Date()),
  });
}

getSecUser() {
  this.gSvc.postdata("Security/User/GetSecUsersByCompanyAndUserLevel?cmnCompanyId=" + this.auth.getCompany() + "&userLevel="+ this.auth.getUserLevel(), {}).subscribe((res: any) => {
    
    this.users= res;
  }, err => {
    this.toastrService.error("Error! Data Not Found");
  })
}

getClientAvailableRechargeBalance() {
            this.gSvc.postdata("api/ClientRecharge/GetScpClientAvailableRechargeBalanceByClientId?companyId=" + this.auth.getCompany(), {}).subscribe(res => {
            if (res != null) {
                this.clientAvailableBalance = res.balance;
            }
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  getClientCurrentRechargeBalance() {
            //New: 25.06.2024
            this.gSvc.postdata("api/ClientRecharge/GetScpClientCurrentRechargeBalanceByClientId?companyId=" + this.auth.getCompany(), {}).subscribe(res => {
            //Old: : 25.06.2024
            //this.gSvc.postdata("api/ClientRecharge/GetLastRechargeByClientId?companyId=" + this.auth.getCompany(), {}).subscribe(res => {
            if (res != null) {
                this.clientCurrentBalance = res.balance;
            }
        }, err => {
            //this.toastrService.error("Error! Brand not found");
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
            this.getClientAvailableRechargeBalance();
            this.getClientCurrentRechargeBalance();
            this.getUserRecharge();
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
  saveRefund(){
    console.log(JSON.stringify(this.frmRrfund.value));
    if (this.frmRrfund.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        debugger
        this.gSvc.postdata("api/ScpUserRechargeRefund/SaveUserRechargeRefund", JSON.stringify(this.frmRrfund.value)).subscribe(res => {
          
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
  
  getUserRechargeBalance() { 
    this.gSvc.postdata("api/ScpUserRecharge/GetUserRechargeBalanceByAnyKey?cmnCompanyId=" + this.auth.getCompany() + "&userLevel="+ this.auth.getUserLevel(), {}).subscribe(res => {
    this.userRechargeBalance = res;
    this.progressStatus = true;
  }, err => {
    this.progressStatus = true;
    this.toastrService.error("List not found");
  })
}

  getUserRecharge() { 
      this.gSvc.postdata("api/ScpUserRecharge/GetUserRechargeByAnyKey?cmnCompanyId=" + this.auth.getCompany() + "&userLevel="+ this.auth.getUserLevel(), {}).subscribe(res => {
      this.list = res;
      this.progressStatus = true;
    }, err => {
      this.progressStatus = true;
      this.toastrService.error("List not found");
    })
  }

  //Need Working
  

  // edit(res: any) {
  //   debugger;    
  //   this.getSecUserType();
  //   this.frm.patchValue(res);
  //   console.log(res);
  // }

  showUserRechargeModalDialog(res: any) {
    this.displayUserRecharge = true;
    this.getUserRechargeByUserId(res.secUserId);
    this.reset();
    this.viewInfo = res;
  }
  showUserRechargeBalanceModalDialog(res: any) {
    this.frmRrfund.controls['cmnCompanyId'].setValue(this.auth.getCompany());
    this.frmRrfund.controls['secUserId'].setValue(res.secUserId);
    this.displayUserRechargeRefund = true;
    this.reset();
    this.viewInfo = res;
  }

  getUserRechargeByUserId(secUserId: any) { 
    this.gSvc.postdata("api/ScpUserRecharge/GetUserRechargeUserId?secUserId=" + secUserId, {}).subscribe(res => {
    this.list = res;
    this.progressStatus = true;
  }, err => {
    this.progressStatus = true;
    this.toastrService.error("List not found");
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