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
  selector: 'app-vouchar-payment',
  templateUrl: './vouchar-payment.component.html',
  styleUrls: ['./vouchar-payment.component.css'],
  providers: [ConfirmationService]
})
export class PaymentVoucherComponent implements OnInit {

  digitalHeadList: any;

  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  companies: any;
  frm!: FormGroup;
  frmDetail!: FormGroup;
  voucherDetailList: any[] = [];
  voucherMasterList: any;

  paymentMoode: any = [{ name: "Cash", id: 1 }, { name: "Bkash", id: 2 }, { name: "Rocket", id: 3 }, { name: "Nagad", id: 3 }]
  constructor(private fb: FormBuilder
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService
    , private toastrService: ToastrService
    , private auth: AuthService
    , private util: Utility) {

  }

  ngOnInit(): void {
    this.createForm();
    this.getCompany();
    this.frmSearch();
    this.getMasterVoucher();
    this.getDebitHead();
    this.getCreditHead();
  }
  createForm() {
    this.frm = this.fb.group({
      id: new FormControl(0),
      cmnCompanyId: new FormControl(this.auth.getCompany(), Validators.required),
      type: new FormControl(1, Validators.required),
      voucherNumber: new FormControl('VOUCHER', Validators.required),
      date: new FormControl(this.util.Today(), Validators.required),
      cmnFinancialYearId: new FormControl(1),
      totalAmount: new FormControl(0, Validators.required),
      naration: new FormControl(null),
      status: new FormControl(false),
      isInternalTransaction: new FormControl(false, Validators.required),
      isPosted: new FormControl(false, Validators.required),
      postedBy: new FormControl(null),
      postedDate: new FormControl(null),
      isCancel: new FormControl(false),
      cancelledBy: new FormControl(null),
      cancelledDate: new FormControl(null),
      cancelReason: new FormControl(null),

      createdBy: new FormControl(this.auth.getUserId()),
      createdDate: new FormControl(new Date()),
      modifiedBy: new FormControl(this.auth.getUserId()),
      modifiedDate: new FormControl(new Date()),

      debit: new FormControl(0),
      credit: new FormControl(0),
      particular: new FormControl(null),
      anFChartOfAccountId: new FormControl(null),
      cmnBusinessId: new FormControl(1),
      cmnProjectId: new FormControl(1),
      dateString: new FormControl(null)
    });

    this.frmDetail = this.fb.group({
      id: new FormControl(0),
      anFVoucherId: new FormControl(0, Validators.required),
      drAnFChartOfAccountId: new FormControl(null),
      crAnFChartOfAccountId: new FormControl(null),
      anFChartOfAccountId: new FormControl(null),
      cmnProjectId: new FormControl(1),
      voucherSerial: new FormControl(null),
      subVoucherNumber: new FormControl(null),
      amount: new FormControl(null, Validators.required),
      shortNarration: new FormControl(''),

      particular: new FormControl(null),
      code: new FormControl(null),
      projectName: new FormControl('1')
    });
  }

  getCompany() {
    this.gSvc.postdata("Common/Company/GetClientByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
      this.companies = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  addDetail() {
    debugger;
    var item = this.frmDetail.value;
    var isDbt = item.crAnFChartOfAccountId == null ? true : false;

    if (item.id > 0) {
      var exvModel = this.voucherDetailList.filter(x => x.id == item.id)[0];
      if (exvModel != undefined) {
        exvModel.anFVoucherId = item.anFVoucherId;
        exvModel.anFChartOfAccountId = item.anFChartOfAccountId;
        exvModel.cmnProjectId = item.cmnProjectId;
        exvModel.voucherSerial = item.voucherSerial;
        exvModel.subVoucherNumber = item.subVoucherNumber;
        exvModel.debit = isDbt ? item.amount : 0;
        exvModel.credit = isDbt ? 0 : item.amount;
        exvModel.shortNarration = item.shortNarration;
        exvModel.particular = item.particular;
        exvModel.code = item.code;
        exvModel.projectName = item.projectName;
      }
    } else {
      this.voucherDetailList.push({
        id: item.id,
        anFVoucherId: item.anFVoucherId,
        anFChartOfAccountId: item.anFChartOfAccountId,
        cmnProjectId: item.cmnProjectId,
        voucherSerial: item.voucherSerial,
        subVoucherNumber: item.subVoucherNumber,
        debit: isDbt ? item.amount : 0,
        credit: isDbt ? 0 : item.amount,
        shortNarration: item.shortNarration,

        particular: item.particular,
        code: item.code,
        projectName: item.projectName
      });
    }

    this.sumDrCr();
  }

  sumDrCr() {
    var ttlDebit: number = 0, ttlCredit = 0;
    this.voucherDetailList.forEach(item => {
      ttlDebit += item.debit;
      ttlCredit += item.credit;
    });

    this.frm.controls['debit'].setValue(ttlDebit);
    this.frm.controls['credit'].setValue(ttlCredit);

    this.frm.controls['totalAmount'].setValue(ttlCredit);
  }

  resetAnother = (accType: string, ev: any) => {
    debugger;
    this.frmDetail.controls['anFChartOfAccountId'].setValue(null);

    if (accType == 'dr') {
      this.frmDetail.controls['crAnFChartOfAccountId'].setValue(null);
    } else if (accType == 'cr') {
      this.frmDetail.controls['drAnFChartOfAccountId'].setValue(null);
    }

    if (ev.value == null) {
      this.frmDetail.controls['code'].setValue('');
    } else {
      var hModel = accType == 'dr' ? this.debitHeadList.filter(x => x.id == ev.value)[0] : this.creditHeadList.filter(x => x.id == ev.value)[0];
      this.frmDetail.controls['code'].setValue(hModel.code);
      this.frmDetail.controls['particular'].setValue(hModel.particular);
      this.frmDetail.controls['anFChartOfAccountId'].setValue(hModel.id);
    }
  }

  editDtl(model: any) {
    this.setDetail(model);
  }

  DeleteDtl(model: any) {

  }

  save() {
    if (this.frm.invalid || this.voucherDetailList.length == 0) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        debugger;
        var obj = this.frm.value;
        if (obj.debit == obj.credit) {
          obj.cmnCompanyId = parseInt(obj.cmnCompanyId);
          var objReq = { obj: obj, list: this.voucherDetailList };

          this.gSvc.postdata("api/Voucher/Save", objReq).subscribe(res => {
            if (res.success) {
              this.reset();
              this.frm.controls['voucherNumber'].setValue(res.message);
              this.getMasterVoucher();
              this.toastrService.success("Data Saved Success");
            } else {
              this.toastrService.error("Error! Data Not Saved");
            }
          }, err => {
            this.toastrService.error("Error! Data Not Saved");
          })
        } else {
          this.toastrService.warning("Warning! Debit and Credit amount must be same");
        }
      },
      reject: () => {

      }

    })
    return false;
  }

  Delete(item: any) {
    debugger;
    if (item.id == 0) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        debugger;
        var param = { id: item.id };
        this.gSvc.postdata("api/ChartofAccount/Delete", param).subscribe(res => {
          this.getMasterVoucher();
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

  debitHeadList: any[] = [];
  getDebitHead() {
    var param = { companyId: this.auth.getCompany() };
    this.gSvc.postparam("api/ChartofAccount/GetWithoutCashAndCashEquivalentByCompanyId", param).subscribe((res: any) => {
      this.debitHeadList = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  creditHeadList: any[] = [];
  getCreditHead() {
    var param = { companyId: this.auth.getCompany() };
    this.gSvc.postparam("api/ChartofAccount/GetCashAndCashEquivalentByCompanyId", param).subscribe((res: any) => {
      this.creditHeadList = res;
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

  // getDataFromHead(ev: any, self: boolean) {
  //   debugger;
  //   var podel = this.debitHeadList.filter(x => x.id == ev)[0];
  //   var objViewModel = {
  //     parentCode: podel.code,
  //     childCode: 'child',
  //     level: podel.depthLevel + 1,
  //     isLastNode: this.frm.controls['isLastNode'].value
  //   };

  //   var param = { companyId: this.auth.getCompany() };

  //   this.gSvc.postdata_param("api/ChartofAccount/GenerateChartOfAccountChildCode", objViewModel, param).subscribe((res: any) => {
  //     this.frm.controls['code'].setValue(res);
  //     this.frm.controls['depthLevel'].setValue(objViewModel.level);
  //   }, err => {
  //     this.toastrService.error("Error! Data Not Found");
  //   })
  // }

  searchFrm!: FormGroup;
  frmSearch() {
    this.searchFrm = this.fb.group({
      voucherNumber: new FormControl(null),
      reportType: new FormControl(null),
      dateFrom: new FormControl(null),
      dateTo: new FormControl(null),
      cmnBusinessId: new FormControl(1),
      cmnProjectId: new FormControl(1),
      cmnCompanyId: new FormControl(this.auth.getCompany()),
      cmnFinancialYearId: new FormControl(1),
      isSummary: new FormControl(false),
      status: new FormControl(true),
      type: new FormControl(1),
      voucherTypeId: new FormControl(1)
    })
  }

  paymentVoucherList: any[] = [];
  getMasterVoucher() {
    debugger;
    var obj = this.searchFrm.value;
    this.gSvc.postdata("api/Voucher/SearchVoucher", obj).subscribe((res: any) => {
      this.paymentVoucherList = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  // getVoucher(re:any) {
  //   var  obj={companyId:re}
  //   this.gSvc.postdata("api/ClientVoucher/GetVoucherHistoryPackageByClientAndDate",JSON.stringify(obj)).subscribe((res: any) => {
  //     this.voucherMasterList = res;
  //   }, err => {
  //     this.toastrService.error("Error! Data Not Found");
  //   })
  // }

  edit(mres: any) {
    var obj = { voucherId: mres.id }
    this.gSvc.postparam("api/Voucher/GetVoucherDetailByVoucherId", obj).subscribe((res: any) => {
      debugger;
      if (res.length > 0) {
        //var vchrList: any[] = res;
        // vchrList.forEach(item => {
        //   this.voucherDetailList.push({
        //     id: item.id,
        //     anFVoucherId: item.anFVoucherId,
        //     anFChartOfAccountId: item.anFChartOfAccountId,
        //     cmnProjectId: item.cmnProjectId,
        //     voucherSerial: item.voucherSerial,
        //     subVoucherNumber: item.subVoucherNumber,
        //     debit: item.debit,
        //     credit: item.credit,
        //     shortNarration: item.shortNarration,

        //     particular: item.particular,
        //     code: item.code,
        //     projectName: item.projectName
        //   });
        // });

        this.voucherDetailList = res;

        this.setMaster(mres);

        this.sumDrCr();
      }
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
    //this.frm.patchValue(res);
  }

  setMaster(res: any) {
    this.frm.setValue({
      id: res.id,
      cmnCompanyId: res.cmnCompanyId,
      type: res.type,
      voucherNumber: res.voucherNumber,
      date: this.util.DateConvert(res.date),
      cmnFinancialYearId: res.cmnFinancialYearId,
      totalAmount: res.totalAmount,
      naration: res.naration,
      status: res.status,
      isInternalTransaction: res.isInternalTransaction,
      isPosted: res.isPosted,
      postedBy: res.postedBy,
      postedDate: res.postedDate,
      isCancel: res.isCancel,
      cancelledBy: res.cancelledBy,
      cancelledDate: res.cancelledDate,
      cancelReason: res.cancelReason,

      createdBy: res.createdBy,
      createdDate: this.util.DateConvert(res.createdDate),
      modifiedBy: this.auth.getUserId(),
      modifiedDate: new Date(),

      debit: res.debit,
      credit: res.credit,
      particular: res.particular,
      anFChartOfAccountId: res.anFChartOfAccountId,
      cmnBusinessId: res.cmnBusinessId,
      cmnProjectId: res.cmnBusinessId,
      dateString: res.dateString
    });
  }

  setDetail(model: any) {
    debugger;
    var isDebt: boolean = model.debit > 0 ? true : false;
    this.frmDetail = this.fb.group({
      id: model.id,
      anFVoucherId: model.anFVoucherId,
      drAnFChartOfAccountId: isDebt ? model.anFChartOfAccountId : null,
      crAnFChartOfAccountId: isDebt ? null : model.anFChartOfAccountId,
      anFChartOfAccountId: model.anFChartOfAccountId,
      cmnProjectId: model.cmnProjectId,
      voucherSerial: model.voucherSerial,
      subVoucherNumber: model.subVoucherNumber,
      amount: model.debit > 0 ? model.debit : model.credit,
      shortNarration: model.shortNarration,

      particular: model.particular,
      code: model.code,
      projectName: model.projectName,
    });
  }

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/account/balance-voucher')
  }

  clear(table: Table) {
    table.clear();
  }

  resetMaster() {
    this.frm.setValue({
      id: 0,
      cmnCompanyId: this.auth.getCompany(),
      type: 1,
      voucherNumber: 'VOUCHER',
      date: this.util.Today(),
      cmnFinancialYearId: 1,
      totalAmount: 0,
      naration: null,
      status: null,
      isInternalTransaction: false,
      isPosted: false,
      postedBy: this.auth.getUserId(),
      postedDate: new Date(),
      isCancel: null,
      cancelledBy: null,
      cancelledDate: null,
      cancelReason: null,

      createdBy: this.auth.getUserId(),
      createdDate: new Date(),
      modifiedBy: this.auth.getUserId(),
      modifiedDate: new Date(),

      debit: null,
      credit: null,
      particular: null,
      anFChartOfAccountId: null,
      cmnBusinessId: 1,
      cmnProjectId: 1,
      dateString: null,
    });

    this.frm.markAsPristine();
  }

  resetDetail() {
    this.frmDetail = this.fb.group({
      id: 0,
      anFVoucherId: null,
      drAnFChartOfAccountId: null,
      crAnFChartOfAccountId: null,
      anFChartOfAccountId: null,
      cmnProjectId: null,
      voucherSerial: null,
      subVoucherNumber: null,
      amount: null,
      shortNarration: null,

      particular: null,
      code: null,
      projectName: '1',
    });

    this.frmDetail.markAsPristine();
  }

  reset() {
    this.resetMaster();
    this.resetDetail();
    this.voucherDetailList = [];
  }
}