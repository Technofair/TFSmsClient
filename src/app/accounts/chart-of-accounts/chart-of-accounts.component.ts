import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-chart-of-accounts',
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.css'],
  providers: [ConfirmationService]
})
export class ChartOfAccountComponent implements OnInit {

  digitalHeadList: any;

  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  companies: any;
  frm!: FormGroup
  rechargeList: any;
  chartofaccountStatus:boolean=true;
  paymentMoode: any = [{ name: "Cash", id: 1 }, { name: "Bkash", id: 2 }, { name: "Rocket", id: 3 }, { name: "Nagad", id: 3 }]
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService, private auth: AuthService) {

  }

  ngOnInit(): void {
    this.transferCreate();
    this.getCOA();
    this.getParentHead();

  }
  transferCreate() {
    this.frm = this.fb.group({
      id: new FormControl(0),
      anFChartOfAccountId: new FormControl(null),
      code: new FormControl(''),
      name: new FormControl(''),
      cmnCompanyId: new FormControl(this.auth.getCompany()),
      scheduleNo: new FormControl('1'),
      depthLevel: new FormControl(null),
      isLastNode: new FormControl(true),
      isTransactionalHead: new FormControl(false),
      isActive: new FormControl(true),
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
        debugger;
        var obj = this.frm.value;
        obj.isTransactionalHead = obj.isLastNode;

        obj.createdBy = this.auth.getUserId();
        obj.createdDate = new Date();
        obj.modifiedBy = this.auth.getUserId();
        obj.modifiedDate = new Date();

        this.gSvc.postdata("api/ChartofAccount/Save", obj).subscribe(res => {
          this.reset();
          this.getCOA();
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

  Delete(item: any) {
    
    if (item.id == 0) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
       
        var param = { id: item.id };
        this.gSvc.postdata("api/ChartofAccount/Delete", param).subscribe(res => {
          this.getCOA();
          this.toastrService.success("Data Deleted Success");
        }, err => {
          this.toastrService.error("Error! Data Not Deleted");
        })

      },
      reject: () => {

      }

    })
    return false;
  }

  parentHeadList: any[] = [];
  getParentHead() {
    var param = { companyId: this.auth.getCompany() };
    this.gSvc.postparam("api/ChartofAccount/GetTransactionalHeadByCompanyId", param).subscribe((res: any) => {
      this.parentHeadList = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }


  // getCompany() {
  //   this.gSvc.postdata("Common/Company/GetClientByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
  //     this.companies = res;
  //   }, err => {
  //     this.toastrService.error("Error! Data Not Found");
  //   })
  // }

  getDataFromHead(ev: any, self: boolean) {
    debugger;
    var podel = this.parentHeadList.filter(x => x.id == ev)[0];
    var objViewModel = {
      parentCode: podel.code,
      childCode: 'child',
      level: podel.depthLevel + 1,
      isLastNode: this.frm.controls['isLastNode'].value
    };

    var param = { companyId: this.auth.getCompany() };

    this.gSvc.postdata_param("api/ChartofAccount/GenerateChartOfAccountChildCode", objViewModel, param).subscribe((res: any) => {
      this.frm.controls['code'].setValue(res);
      this.frm.controls['depthLevel'].setValue(objViewModel.level);
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  chartOfAccountList: any[] = [];
  getCOA() {
    this.chartofaccountStatus=false;
    var param = { companyId: this.auth.getCompany() };
    this.gSvc.postparam("api/ChartofAccount/GetChartOfAccount", param).subscribe((res: any) => {
      this.chartOfAccountList = res;
      this.chartofaccountStatus=true;
    }, err => {
      this.chartofaccountStatus=true;
      this.toastrService.error("Error! Data Not Found");
    })
  }

  // getRecharge(re:any) {
  //   var  obj={companyId:re}
  //   this.gSvc.postdata("api/ClientRecharge/GetRechargeHistoryPackageByClientAndDate",JSON.stringify(obj)).subscribe((res: any) => {
  //     this.rechargeList = res;
  //   }, err => {
  //     this.toastrService.error("Error! Data Not Found");
  //   })
  // }
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
    //this.frm.reset();
    this.frm.setValue({
      id: 0,
      anFChartOfAccountId: null,
      code: '',
      name: '',
      cmnCompanyId: this.auth.getCompany(),
      scheduleNo: '1',
      depthLevel: null,
      isLastNode: true,
      isTransactionalHead: false,
      isActive: true,
      createdBy: this.auth.getUserId(),
      createdDate: new Date(),
      modifiedBy: this.auth.getUserId(),
      modifiedDate: new Date(),
    });

    this.frm.markAsPristine();
  }
}