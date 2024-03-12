import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { type } from 'os';
import { ExportService } from 'src/app/layout/service/export.service';
import { Location } from '@angular/common';
import { balanceService } from 'src/app/global';
import { ReportViewer } from 'src/app/reportviewer/reportviewer';
import { ReportModel } from 'src/app/reportviewer/reportmodel';

@Component({
  selector: 'app-stb-assign-test',
  templateUrl: './package-renew.component.html',
  styleUrls: ['./package-renew.component.css'],
  providers: [ConfirmationService]
})
export class PackageRenewComponent implements OnInit {
  paymentMsg: string = '';
  PaymentInfoVisible: boolean = false;
  paymentStatusId: string = '';
  curloc: string = '';
  gateways: any;
  getWayaList: any;
  distinctTyp: any;
  getArray: any = [{ id: 1, name: 'Mobile Banking', chield: [] }, { id: 2, name: 'Internet Banking', chield: [] }, { id: 3, name: 'Card', chield: [] }]
  apiurl: any;

  frmsrc!: FormGroup;
  frmPackageRenew!: FormGroup
  organizations: any;
  packageRenewlist: any;

  displayPackageRenew: boolean = false;
  packages: any[] = [];
  packageRenew: any;
  //districtList:any;
  //thanaList:any;
  //unionList:any;
  companies: any;
  deviceNumber: any;
  packageValue: any
  packageExpDate: any;
  paymentMoodList: any;
  paymentTypes: any;
  //userId: any;
  packageStatus: any;
  isShowSslPay: boolean = false;
  progressStatus: boolean = false;
  packageAssignHistory:any;
  displayPackageRenewHis:boolean=false
  status: any = [{ name: 'All', value: 0 }, { name: 'Active', value: 1 }, { name: 'InActive', value: 2 }]
  // subscribtionTypes: any = [{ name: "Select Types", id: 0 }, { name: "Daily", id: 1 }, { name: "Monthly", id: 2 }, { "name": "Yearly", id: 3 }];
  subscribtionTypes: any ;
  constructor(
    private fb: FormBuilder
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService
    , private auth: AuthService
    , private toastrService: ToastrService
    , private exportService: ExportService
    , private route: ActivatedRoute
    , private _location: Location
    , private balService: balanceService) {
    this.curloc = location.href;
  }

  ngOnInit(): void {

    // this.paymentStatusId='1';
    // this.paymentMsg='Payment Success';
    // this.PaymentInfoVisible=true;
    this.frmsearch();
    var currUrl = this.route.snapshot.queryParamMap.get('urlNam');
    if (currUrl != null) {
      var trx = this.route.snapshot.queryParamMap.get('trxID');
      if (trx != null) {
        if (trx == 'Deactive') {
          this.frmsrc.controls['statusType'].setValue(2);
         } else {
        var sts: any = this.route.snapshot.queryParamMap.get('status');
        this.paymentMsg = sts == '1' ? 'Payment Success!!!' : sts == '2' ? 'Payment Faile!!!' : sts == '3' ? 'Payment Cancel' : '';
        this.PaymentInfoVisible = true;
        this.paymentStatusId = sts;
         }
      }

      this._location.replaceState(currUrl);
    }


    this.createPackageRenew();
    this.getPackage();
    //this.getDistrict();
    this.getCompanys();
    this.getRenewableSubscriber();
   this.clientPeriod();
  }

  frmsearch() {
    //var dstrct: any = this.auth.getDistrict();
    //var upzla: any = this.auth.getUpazila();
    //var unon: any = this.auth.getUnion();
    this.frmsrc = this.fb.group({
      companyId: new FormControl(),
      clientId: new FormControl(),
      customerNumber: new FormControl(),
      contactNumber: new FormControl(),
      deviceNumber: new FormControl(),
      name: new FormControl(),
      //cmnDistrictId:new FormControl(parseInt(dstrct)),
      //cmnUpazillaId: new FormControl(parseInt(upzla)),
      //cmnUnionId: new FormControl(),
      fromDate: new FormControl(),
      toDate: new FormControl(),
      statusType: new FormControl()

    })
    //this.getUpazillaByDistrictId();
    //this.getUnionByUpazillaId();
  }
  clientPeriod(){
    this.gSvc.getdata("api/ScpPackagePeriod/GetScpPackagePeriodByCompanyId?cmnCompanyId=" + this.auth.getCompany()).subscribe(res => {
      this.subscribtionTypes = res;
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (subscribtionTypes)' + err.message);
    })
  }
  createPackageRenew() {
    this.frmPackageRenew = this.fb.group({
      id: new FormControl(),
      packageName: new FormControl(),
      scpSubscriberId: new FormControl(),
      prdDeviceNumberId: new FormControl(),
      amount: new FormControl(),
      discount: new FormControl(),
      endDate: new FormControl(),
      scpPackageId: new FormControl(),
      deviceNumber: new FormControl(),
      period: new FormControl(),
      packageType: new FormControl(2),
      value: new FormControl([Validators.required, Validators.min(0)]),
      expDate: new FormControl(),
      isActive: new FormControl(true),
      createdBy: new FormControl(),
      createdDate: new FormControl(new Date()),
      modifiedBy: new FormControl(),
      modifiedDate: new FormControl(),
      packageValue: new FormControl(),
      paymentType: new FormControl(),
      anFPaymentMethodId: new FormControl([Validators.required]),
      statusType: new FormControl()
    });
  }

  packageTypeValue() {
    var packageId = this.frmPackageRenew.get("scpPackageId")?.value;
    //var objPackage = this.packages.find(w => w.id === packageId);

    const constamount = this.packageValue;
    
    const packageEnddate = new Date(this.packageExpDate);
    const newDateTime = new Date();
    var endDat;
    if (packageEnddate > newDateTime) {
      endDat = packageEnddate;
    } else {
      endDat = newDateTime;
    }
    var packageType = this.frmPackageRenew.get('packageType')?.value;
    

    var period = this.frmPackageRenew.get('value')?.value;
    this.frmPackageRenew.controls['period'].setValue(period);

    if (period <= 0) {
      return;
    }

    if (packageType == 1) {

      //var value = this.frmPackageRenew.get('value')?.value;
      var priceDaily = (constamount / 30) * period;
      //var numberOfDaysToAdd = period;
      var myDate = new Date(endDat.getTime() + (period * (24 * 60 * 60 * 1000)));
      var result = ('0' + myDate.getDate()).slice(-2) + '/' + ('0' + (myDate.getMonth() + 1)).slice(-2) + '/' + myDate.getFullYear();
      this.frmPackageRenew.controls['endDate'].setValue(myDate);
      this.frmPackageRenew.controls['expDate'].setValue(result);
      this.frmPackageRenew.controls['amount'].setValue(priceDaily);
    } 
    else if (packageType == 2) {
      
      
      var priceMontly = constamount * period;

     // var numberOfDaysToAdd: any = value;

      var myDate = new Date(endDat.getTime() + (period * (24 * 60 * 60 * 1000)));
      var days = endDat.getDate();
      var year = myDate.getFullYear();
      var dat = myDate.getDate();

      

      //var month = endDat.setMonth(endDat.getMonth() + period);
      //var result2 = endDat.getDate() + "/" + (endDat.getMonth()) + "/" + endDat.getFullYear();
     //var result3 = ('0' + myDate.getDate()).slice(-2) + '/' + ('0' + (myDate.getMonth() + 1)).slice(-2) + '/' + myDate.getFullYear();
     
     var expireDate = this.addMonths(endDat, period);
     var result3 = ('0' + expireDate.getDate()).slice(-2) + '/' + ('0' + (expireDate.getMonth() + 1)).slice(-2) + '/' + expireDate.getFullYear();
     
      this.frmPackageRenew.controls['endDate'].setValue(result3);
      this.frmPackageRenew.controls['expDate'].setValue(result3);
      this.frmPackageRenew.controls['amount'].setValue(priceMontly);
    } 
      else if (packageType == 3) {
      //var value = this.frmPackageRenew.get('value')?.value;
      var priceYearly = (constamount * 12) * period;
      var numberOfDaysToAdd: any = (365 * period);

      var myDate = new Date(endDat.getTime() + (numberOfDaysToAdd * (24 * 60 * 60 * 1000)));
      var dat = myDate.getDate();
      
    //  var result = ('0' + endDat.getDate()).slice(-2) + '/' + ('0' + (endDat.getMonth() + 1)).slice(-2) + '/' + endDat.getFullYear();
      var expireDate = this.addMonths(endDat, (period*12));
      var result3 = ('0' + expireDate.getDate()).slice(-2) + '/' + ('0' + (expireDate.getMonth() + 1)).slice(-2) + '/' + expireDate.getFullYear();
      this.frmPackageRenew.controls['endDate'].setValue(dat);
      this.frmPackageRenew.controls['expDate'].setValue(result3);
      this.frmPackageRenew.controls['amount'].setValue(priceYearly);
    }

  }

  addMonths(date: Date, months: number): Date {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  }

  getPackage() {
    this.gSvc.postdata("Subscription/Package/GetAll", {}).subscribe(res => {
      this.packages = res;
    }, err => {
      this.toastrService.error("Error! Package not found");
    })
  }

  savePackageRenew() {
    if (this.frmPackageRenew.controls['anFPaymentMethodId'].value == null || this.frmPackageRenew.controls['anFPaymentMethodId'].value == '' || this.frmPackageRenew.controls['anFPaymentMethodId'].value === 'undefined') {
      this.toastrService.error("Please select payment method.");
      return;
    }
    if (this.frmPackageRenew.controls['statusType'].value == 'Inactive') {
      this.toastrService.error("Your package is inactive . Acrive or Reactive first then renew. ");
      return;
    }
    this.frmPackageRenew.controls['createdBy'].setValue(this.auth.getUserId());
    this.frmPackageRenew.controls['createdDate'].setValue(new Date());
    this.frmPackageRenew.controls['endDate'].setValue(new Date());
    if (this.frmPackageRenew.invalid || this.isShowSslPay) return false;

    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.gSvc.postdata("api/SubscriberPackage/RenewPackage", JSON.stringify({ obj: this.frmPackageRenew.value, status: 0 })).subscribe(res => {
          if (res != undefined && !res.success && res.OperationId == -3) {
            this.toastrService.warning("Error! Insufficient balance.");
          }
          else if (res != undefined && res.success) {
            debugger;
            this.balService.updateCurrentBalance(0);
            this.loadReportIn(res);
            this.getRenewableSubscriber();
            this.reset();
            this.toastrService.success("Saved success");
            this.displayPackageRenew = false;
          } else {
            if (res.operationId == -4) {
              if (this.frmPackageRenew.controls['anFPaymentMethodId'].value == 5) {
                this.getPaymentList();
                this.getRenewableSubscriber();
              }
            } else {
              this.toastrService.error("Error ! Package not assign . ");
              this.getRenewableSubscriber();
            }
          }

        }, err => {
          this.toastrService.error("Error ! Data is not saved . ");
        })

        return true;
      },
      reject: () => {
      }
    })
    return false;
  }



  getRenewableSubscriber() {

    var requestBody = this.frmsrc.value;
    this.progressStatus = false;
    requestBody.companyId = this.auth.getCompany();
    this.gSvc.postdata("api/SubscriberPackage/GetSubscriptionInfoByParameter", JSON.stringify(requestBody)).subscribe(res => {
      this.packageRenewlist = res;
      this.progressStatus = true;
    }, err => {
      this.progressStatus = true;
      this.toastrService.error("Error ! Data is not Found . ");
    })

  }

  showPackageRenewModal(res: any) {

    this.frmPackageRenew.reset();
    this.displayPackageRenew = true;

    this.packageValue = res.rate;
    this.packageExpDate = res.endDate;
    this.frmPackageRenew.controls["packageValue"].setValue(res.rate);
    this.frmPackageRenew.controls['statusType'].setValue(res.statusType);
    res.amount = '';

    this.paymentType();
    this.frmPackageRenew.patchValue(res);
  }
  paymentType() {
    //debugger
    this.gSvc.postdata("api/PaymentMethod/GetActivePaymentMode", {}).subscribe(res => {
      this.paymentMoodList = res;
    }, err => {
      this.toastrService.error("Error ! Data is not Found . ");
    })
  }
  reload() {

    this.router.navigateByUrl('/subscriber/stbassign')
  }
  clear(table: Table) {
    table.clear();
  }
  reset() {
    this.frmsrc.reset();
    this.frmsrc.markAsPristine();
  }
 

  getCompanys() {
    this.gSvc.postdata("Common/Company/GetClientByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
      this.companies = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  exportToExcel(): void {
    const columnsToExport: any[] = ['customerNumber', 'firstName', 'contactNumber', 'deviceNumber', 'packageName', 'amount', 'startDate', 'endDate', 'statusType'];
    this.exportService.exportToExcel(this.packageRenewlist, 'package_renew', columnsToExport);
  }

  getPaymentList() {
    
    var param = {
      deviceNumberId: this.frmPackageRenew.controls["prdDeviceNumberId"].value,
      paymentMethodId: this.frmPackageRenew.controls['anFPaymentMethodId'].value,
      retUrl: this.curloc.split('?')[0]
    };
    var url = "api/MFSPGW/GetSSLCommerzGrantToken";
    this.gSvc.postparam(url, param).subscribe(res => {
      this.gateways = res.desc;
      this.getData();

      if (this.gateways.length > 0) {
        this.isShowSslPay = true;
      } else {
        this.isShowSslPay = false;
      }
    })
    console.log(this.getArray);
  }
  currentTabIndex: number = 0;
  getData() {
    debugger;
    this.gateways.forEach((element: any) => {
      if (element.type == 'internetbanking') {
        var mb = this.getArray.filter((x: any) => x.id == 2)[0];
        mb.chield.push(element);
      } else if (element.type == 'mobilebanking') {
        var mb = this.getArray.filter((x: any) => x.id == 1)[0];
        mb.chield.push(element);
      } else {
        var mb = this.getArray.filter((x: any) => x.id == 3)[0];
        mb.chield.push(element);
      }
    });
  }
  getWayaLists(data: any) {
    debugger
    var dt = this.getArray.find((x: { id: any; }) => x.id == data);
    this.getWayaList = dt.chield;
  }

//Report Execution
@ViewChild(ReportViewer)
_rptViewer!: ReportViewer;
@ViewChild('_reportModal')
_reportModal!: any;
//_reportModal:any;
public reportModal: boolean = false;
public _getReportUrl: string = 'api/SubscriberInvoice/GetSubscriberInvoicePaymentByInvoiceIdRdlc';
loadReportIn(data: any) {
  debugger;
  this.confirmationService.confirm({
    message: 'Do you want to print Invoice?',
    header: 'Confirmation',
    icon: 'pi pi-print',
    accept: () => {

      this._reportModal.maximized = true;
      var frm = { InvoiceId: data.operationId, companyId: this.auth.getCompany() };
      this.reportModal = true;
      var repFile = 'SubscriberBill.rdlc';
      var rmodel = { reportPath: '/reportfile/report/' + repFile, reportName: 'Subscriber Bill' };
      this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 800, 1);    
      var Models = JSON.stringify(frm);
      this._rptViewer.reportInPage(this._getReportUrl, Models);

      return true;
    },
    reject: () => {
    }
  })  
  return false;
}
//Report Execution
packageHistory(data: any) {
  // console.log(data);
  this.displayPackageRenewHis = true;
  this.deviceNumber = data.deviceNumber;
  this.gSvc.postdata("api/SubscriberPackage/GetHistoryBySubscriberAndDeviceId?subscriberId=" + data.scpSubscriberId + "&deviceNumberId=" + data.prdDeviceNumberId, {}).subscribe(res => {
    this.packageAssignHistory = res;
  }, err => {
    this.toastrService.error(err.message);
    console.log('Exception: (getPackageAssignHistory)' + err.message);
  })
}
}
