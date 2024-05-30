import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { type } from 'os';
import { ExportService } from 'src/app/layout/service/export.service';
import { JsonPipe, Location } from '@angular/common';
import { balanceService } from 'src/app/global';
@Component({
  selector: 'app-stb-assign-test',
  templateUrl: './package-toggle.component.html',
  styleUrls: ['./package-toggle.component.css'],
  providers: [ConfirmationService]
})
export class PackageToggleComponent implements OnInit {
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
  frm!: FormGroup;
  frmPackageRenew!: FormGroup
  organizations: any;
  packageRenewlist: any;

  displayPackageRenew: boolean = false;

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
  progressStatus: boolean = true;
  packageAssignHistory: any;
  subscriberPackage: any;

  status: any = [{ name: 'All', value: 0 }, { name: 'Active', value: 1 }, { name: 'InActive', value: 2 }]
  // subscribtionTypes: any = [{ name: "Select Types", id: 0 }, { name: "Daily", id: 1 }, { name: "Monthly", id: 2 }, { "name": "Yearly", id: 3 }];
  subscribtionTypes: any = [{ name: "Monthly", id: 2 }];
  displaySubscriberPackage: boolean=false;
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
    
    this.frmsearch();
    this.createPackageRenew();

    //this.getDistrict();
    this.getCompanys();
    // this.getRenewableSubscriber();
    this.activeInactiveFrm();
  }

  activeInactiveFrm() {
    this.frm = this.fb.group({
      id: new FormControl(0),
      scpSubscriberId: new FormControl(),
      prdDeviceNumberId: new FormControl(),
      scpPackageId: new FormControl(),
      amount: new FormControl(),
      period: new FormControl(1),
      isFree: new FormControl(),
      freeDays: new FormControl(),
      isActive: new FormControl(true),
      createdBy: new FormControl(),
      createdDate: new FormControl(),
      modifiedBy: new FormControl(),
      modifiedDate: new FormControl(),
      status: new FormControl(),
      subscribtionTypeId: new FormControl(),
      cardNumber: new FormControl(),
      packageType: new FormControl(2),
      currentStatus: new FormControl(),
      anFPaymentMethodId: new FormControl(),
      isExpired: new FormControl()
    });
  }
  frmsearch() {
  
    this.frmsrc = this.fb.group({
      companyId: new FormControl(),
      clientId: new FormControl(),
      customerNumber: new FormControl(),
      contactNumber: new FormControl(),
      deviceNumber: new FormControl(),
      name: new FormControl(),
      fromDate: new FormControl(),
      toDate: new FormControl(),
      statusType: new FormControl()

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


  activePackage(data: any) {
    this.setPackageDetail(data);
    this.confirmationService.confirm({
      message: 'Are you sure that you want to active package?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.frm.controls['anFPaymentMethodId'].setValue(1);
        if (this.frm.controls['id'].value == 0) {
          this.frm.controls['createdBy'].setValue(this.auth.getUserId());
          this.frm.controls['createdDate'].setValue(new Date());
        } else if (this.frm.controls['id'].value > 0) {
          this.frm.controls['createdBy'].setValue(this.auth.getUserId());
        }
        var frmVal = this.frm.value;
        //this.anFPaymentMethodId=frmVal.anFPaymentMethodId;
        frmVal.scpSubscriberId = parseInt(this.frm.controls['scpSubscriberId'].value);
        this.gSvc.postdata("api/SubscriberPackage/ActivateUnexpiredPackage", JSON.stringify({ obj: frmVal, status: 1 }))
          .subscribe(res => {
            if (res.success) {
              this.balService.updateCurrentBalance(0);
              data.statusType = 'Active';
              this.toastrService.success(res.message);
              
            }
          }, err => {
            this.toastrService.error(err.message);
            console.log('Exception: (save)' + err.message);
          })

        return true;
      },
      reject: () => {
      }
    })
  }
  setPackageDetail(objPackage: any) {
    this.frm.patchValue(objPackage);
  }

  inactivePackage(data: any) {
    debugger;
    this.setPackageDetail(data);
    // this.toastrService.warning("This option is not active for you . ");
    // return;
    //if (this.frm.invalid) return false;
    //console.log(this.frm.value);
    this.confirmationService.confirm({
      message: 'Are you sure that you want to inactive package?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        if (this.frm.controls['id'].value == 0) {
          this.frm.controls['createdBy'].setValue(this.auth.getUserId());
          this.frm.controls['createdDate'].setValue(new Date());
        } else if (this.frm.controls['id'].value > 0) {
          this.frm.controls['createdBy'].setValue(this.auth.getUserId());
        }

        //debugger;
        var frmVal = this.frm.value;
        //this.anFPaymentMethodId=frmVal.anFPaymentMethodId;
        frmVal.scpSubscriberId = parseInt(this.frm.controls['scpSubscriberId'].value);

        this.gSvc.postdata("api/SubscriberPackage/InActivePackage", JSON.stringify({ obj: frmVal, status: 2 }))
          .subscribe(res => {
            debugger
            if (res.success) {
              this.balService.updateCurrentBalance(0);
              data.statusType = 'Inactive';
              this.toastrService.success(res.message);
              //this.subDetails();
              //this.getDeviceBySubscriberId();
              //this.reset();
              //this.reload();
            } else {
              this.toastrService.warning(res.message);
            }
          }, err => {
            this.toastrService.error(err.message);
            console.log('Exception: (save)' + err.message);
          })

        return true;
      },
      reject: () => {

      }

    })
    return false;
  }
  //New
getSubscriberPackageByDeviceId(data: any) {
//console.log( 'Packages: ' + JSON.stringify(data));
  this.displaySubscriberPackage = true;
  this.gSvc.postdata("api/ScpSubscriberInvoiceDetail/GetSubscriberInvoiceDetailByDeviceId?scpSubscriberId=" + data.id + "&prdDeviceNumberId=" + data.prdDeviceNumberId + "&activateType=" + 1, {}).subscribe(res => {
    this.subscriberPackage = res;
  }, err => {
    this.toastrService.error(err.message);
    console.log('Exception: (getSubscriberPackageByDeviceId)' + err.message);
  })
 }

  cancelPackage(data: any) {

    this.confirmationService.confirm({
      message: 'Are you sure that you want to cancel package?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        
        this.gSvc.postdata("api/SubscriberPackage/CancelPackage?deviceNumberId=" + data.prdDeviceNumberId + "&isFirst=" + data.isFirst + "&isLast=" + data.isLast + "&createdBy=" + this.auth.getUserId(), {})
          .subscribe(res => {
            if (res.success) {
              this.toastrService.success(res.message);

              var dt =  {
                id: data.scpSubscriberId,
                prdDeviceNumberId: data.prdDeviceNumberId,
                activateType: 1
                //scpSubscriberId=" + data.id + "&prdDeviceNumberId=" + data.prdDeviceNumberId + "&activateType
              };

              this.getSubscriberPackageByDeviceId(dt);


              this.getRenewableSubscriber();
              
            } else {
              this.toastrService.warning(res.message);
            }
          }, err => {
            this.toastrService.error(err.message);
          })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }

  packageHistory(data: any) {
    // console.log(data);
    this.displayPackageRenew = true;
    this.deviceNumber = data.deviceNumber;
    this.gSvc.postdata("api/SubscriberPackage/GetHistoryBySubscriberAndDeviceId?subscriberId=" + data.scpSubscriberId + "&deviceNumberId=" + data.prdDeviceNumberId, {}).subscribe(res => {
      this.packageAssignHistory = res;
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getPackageAssignHistory)' + err.message);
    })
  }

  getRenewableSubscriber() {
    var requestBody = this.frmsrc.value;
    this.progressStatus = false;


    if(this.frmsrc.controls['clientId'].value == null)
      {
        requestBody.companyId = this.auth.getCompany();
      }
      else
      {
        requestBody.companyId = this.frmsrc.controls['clientId'].value;
      }

    this.gSvc.postdata("api/SubscriberPackage/GetSubscriptionInfoByParameter", JSON.stringify(requestBody)).subscribe(res => {
      this.packageRenewlist = res;
      this.progressStatus = true;
    }, err => {
      this.progressStatus = true;
      this.toastrService.error("Error ! Data is not Found . ");
    })
  }

  reload() {

    this.router.navigateByUrl('/subscription/package-toggle')
  }
  clear(table: Table) {
    table.clear();
  }
  reset() {
    this.frmsrc.reset();
    this.frmsrc.markAsPristine();
  }
  // getDistrict() {
  //   this.apiurl = "api/GeneralServices/Districts";
  //   this.gSvc.getdata(this.apiurl).subscribe(res => {
  //     this.districtList = res;

  //   }, err => {
  //     this.toastrService.error("District error!");
  //   })
  // }

  // getUpazillaByDistrictId() {
  //   this.apiurl = "api/GeneralServices/Upazila/" + this.frmsrc.controls['cmnDistrictId'].value;
  //   this.gSvc.getdata(this.apiurl).subscribe(res => {
  //     this.thanaList = res;
  //   }, err => {
  //     this.toastrService.error("Upazila error!");
  //   })
  // }

  // getUnionByUpazillaId() {
  //   this.apiurl = "api/GeneralServices/Union/" + this.frmsrc.controls['cmnUpazillaId'].value;
  //   this.gSvc.getdata(this.apiurl).subscribe(res => {
  //     this.unionList = res;

  //   }, err => {
  //     this.toastrService.error("Union error!");
  //   })
  // }

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

  executeFuncFromDash(){

  }
}
