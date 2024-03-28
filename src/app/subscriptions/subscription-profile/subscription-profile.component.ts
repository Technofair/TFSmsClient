import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Table, TableHeaderCheckbox } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { read, utils } from "xlsx";
import { ExportService } from '../../layout/service/export.service';
import { Location } from '@angular/common';
import { balanceService } from 'src/app/global';
import { ReportModel } from 'src/app/reportviewer/reportmodel';
import { ReportViewer } from 'src/app/reportviewer/reportviewer';

@Component({
  selector: 'app-package-assign',
  templateUrl: './subscription-profile.component.html',
  styleUrls: ['./subscription-profile.component.css'],
  providers: [ConfirmationService]
})
export class SubscriptionProfileComponent implements OnInit {
  activeTabs: boolean[] = [false, false];
  curloc: string = '';
  paymentMsg: string = '';
  PaymentInfoVisible: boolean = false;
  paymentStatusId:string='';
  subscriberList: any;
  genderList: any;
  countryList: any;
  divisionList: any;
  districtList: any;
  thanaList: any;
  unionList: any;
  subsType: any;
  apiurl: any;
  frm!: FormGroup;
  frmDeviceAssign!: FormGroup;
  frmPackageAssign!: FormGroup;
  progressStatus: any = false;
  selectedRow: any;
  msoInfo: any
  paymentMoodList: any;
  scpSubscriberId: any = 0;
  isPayWithSubscription: boolean = false;
  devices: any;
  assignedDevices: any;
  deviceCards: any;
  checkGetter: boolean = true;
  isCardBase: boolean = true;
  diviceInvoices: any;
  assignHistories: any;
  subscriberDetails: any;
  payShow: boolean = true;
  paymentAction: boolean = true;
  gateways: any;
  getArray: any = [{ id: 1, name: 'Mobile Banking', chield: [] }, { id: 2, name: 'Internet Banking', chield: [] }, { id: 3, name: 'Card', chield: [] }]

  //Strat of Package
  DeviceLatestPackageInfoByDeviceNumberId: any;
  statusTypes: any = [];
  SubPackageList: any = [];
  isExpire: any;
  packages: any[] = [];
  //subscribtionTypes: any = [{ 'id': 2, 'name': 'Monthly' }];
  subscribtionTypes:any;
  anFPaymentMethodId: any;
  isShowSslPay: boolean = false;
  subscriberDeviceList: any[] = [];
  _auth:any
  customernumber:any;
  frmsrc!:FormGroup;
  //End Of Package
  progressreConnectStatus:boolean=true;
  constructor(private fb: FormBuilder
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService
    , private toastrService: ToastrService
    , private route: ActivatedRoute
    , private auth: AuthService
    , private _location: Location
    , private balService:balanceService) {
    //this.displayModal = false;
    //   this.getDevices();
    // this.getCards();    
    this.curloc = location.href;
    this._auth=auth;
    this.syncAddressAsMSO();
  }

  sub_profile_frm() {
    this.frm = this.fb.group({
      id: new FormControl(0),
      cmnCompanyId: new FormControl(0),
      code: new FormControl("0"),
      firstName: new FormControl("", Validators.required),
      lastName: new FormControl(""),
      gender: new FormControl(1),
      contactNumber: new FormControl("", Validators.required),
      customerNumber: new FormControl(""),
      email: new FormControl(""),
      nidNo: new FormControl(""),
      kYC: new FormControl(""),
      cmnCountryId: new FormControl(1, Validators.required),
      cmnDivisionId: new FormControl('',Validators.required),
      cmnDistrictId: new FormControl('',Validators.required),
      cmnUpazillaId: new FormControl('',Validators.required),
      cmnUnionId: new FormControl(),
      address: new FormControl(""),
      postCode: new FormControl(""),
      subscriberType: new FormControl(1),
      isActive: new FormControl(true, Validators.required),
      // createdBy: new FormControl(0),
      createdBy: new FormControl(this.auth.getUserId),
      createdDate: new FormControl(),
      modifiedBy: new FormControl(),
    });
  }
  createDeviceAssign() {
    this.frmDeviceAssign = this.fb.group({
      id: new FormControl(0),
      refNo: new FormControl(""),
      scpSubscriberId: new FormControl(0),
      prdDeviceNumberId: new FormControl('', [Validators.required]),
      deviceNumber: new FormControl(),
      amount: new FormControl(),
      paymentStatus: new FormControl(),
      isPayWithSubscription: new FormControl(false),
      paymentSchedule: new FormControl(),
      discount: new FormControl(),
      date: new FormControl(new Date()),
      cardNumber: new FormControl(),
      prdCardNumberId: new FormControl(),
      anFPaymentMethodId: new FormControl(''),
      paidAmount: new FormControl(),
      isActive: new FormControl(true),
      createdBy: new FormControl(),
      createdDate: new FormControl(new Date()),
      modifiedBy: new FormControl(),
      subscriberName: new FormControl(),
      scpDeviceAssignId: new FormControl(0),
      remarks: new FormControl(),
      cmnCompanyId: new FormControl()
    });
  }
  createPackageAssign() {
    this.frmPackageAssign = this.fb.group({
      id: new FormControl(0),
      //New
      scpSubscriberId: new FormControl(),
      //Old
      //scpSubscriberId: new FormControl(parseInt(this.viewInfo.id)),
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

  ngOnInit(): void {

    var currUrl = this.route.snapshot.queryParamMap.get('urlNam');
    if (currUrl != null) {
      var trx = this.route.snapshot.queryParamMap.get('trxID');
      if (trx != null) {
        var sts:any = this.route.snapshot.queryParamMap.get('status');
        this.paymentMsg = sts == '1' ? 'Payment Success!!!' : sts == '2' ? 'Payment Faile!!!' : sts == '3' ? 'Payment Cancel' : '';
        this.PaymentInfoVisible = true;
        this.paymentStatusId=sts.toString();
      }
      this._location.replaceState(currUrl);
    }

    this.genderList = [{ 'id': 1, "name": 'Male' }, { 'id': 2, "name": "Female" }, { 'id': 3, "name": "Others" }]
    this.subsType = [{ 'id': "1", 'name': 'General-জেনারেল' }, { 'id': "2", 'name': 'Corporate-কর্পোরেট' }];
    this.clientPeriod();
    this.openTab(0);
    // this.getSubscriberInfo();
    this.getDevices();
    this.getCards();
    this.getCountry();
    this.getDivision();
    this.getSubscriberList();
    this.syncAddressAsMSO();
    this.sub_profile_frm();
    this.createDeviceAssign();
    this.createPackageAssign();
    this.paymentType();
    //Begin Package
    this.getPackage();
    //End
    this.frmsearch()
  }
  // getSubscriberInfo() {
  //   this.gSvc.postdata("api/Subscriber/Subscribers", {}).subscribe(res => {
  //     this.subscriberList = res;
  //   }, err => {
  //     this.toastrService.error("Error! Subscribers not found!");
  //   })
  // }
  frmsearch() {
    
    // var dstrct: any = this.auth.getDistrict();
    // var upzla: any = this.auth.getUpazila();
    // var unon: any = this.auth.getUnion();

    this.frmsrc = this.fb.group({
      companyId: new FormControl(),
      clientId: new FormControl(),
      customerNumber: new FormControl(''),
      contactNumber: new FormControl(''),
      deviceNumber: new FormControl(''),
      name: new FormControl('') //,
      // cmnDistrictId: new FormControl(parseInt(dstrct)),
      // cmnUpazillaId: new FormControl(parseInt(upzla)),
      // cmnUnionId: new FormControl(parseInt(unon))
    })

    // this.getUpazillaByDistrictId();
    // this.getUnionByUpazillaId();

  }
  toggleTab(idx: number) {
    this.activeTabs[idx] = !this.activeTabs[idx];
  }
  openTab(idx: number) {
    if (!this.activeTabs[idx])
      this.activeTabs[idx] = true;
  }
  closeTab(idx: number) {
    if (this.activeTabs[idx])
      this.activeTabs[idx] = false;
  }

  //Start Of Create Subscriber

  saveSubscriber() {
    
    if (this.frm.invalid) {
      return false;
    }
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.frm.controls['id'].value == 0) {
          this.frm.controls['cmnCompanyId'].setValue(this.auth.getCompany());
          this.frm.controls['createdBy'].setValue(this.auth.getUserId());
          this.frm.controls['createdDate'].setValue(new Date());
        }
        else if (this.frm.controls['id'].value > 0) {
          this.frm.controls['modifiedBy'].setValue(this.auth.getUserId());
        }
        this.gSvc.postdata("api/Subscriber/Save", JSON.stringify(this.frm.value)).subscribe(res => {
          //New
         
         
          if (res.success) {
          this.scpSubscriberId = res.operationId;
          this.openTab(1);
          this.getSubscriberDetail();
          this.getSubscriberList();
          this.toastrService.success(res.message);
            this.sub_profile_frm();
             this.syncAddressAsMSO();
            if (res.operationId == 1) //1=Add
            {
              this.reset();

              //New
              this.syncAddressAsMSO();

              this.getSubscriberList();
              this.toastrService.success(res.message);
            }

            if (res.operationId == 2) //2=Update
            {
              this.getSubscriberList();
              this.toastrService.success(res.message);
            }
          }

          if (!res.success) {
            this.toastrService.warning(res.message);
          }

          //Old
          // if (res != undefined && res.OperationId == -1) {
          //   this.toastrService.warning("Error! Already exist,please try uisng another contact number.");
          // }
          // else if (res != undefined && res.OperationId == -2) {
          //   this.toastrService.warning("Error! MSO not able to create subscriber.");
          // }
          // else if (res != undefined && res.success == true) {
          //   this.reset();
          //   this.getSubscriberList();
          //   this.toastrService.success("Data saved successfully");
          // }
          // else {
          //   this.toastrService.error(res.message);
          //   console.log('Exception: (save)' +  res.message);
          //   //this.toastrService.error("Error! Data not save.");
          // }
        }, err => {
          this.toastrService.error(err.message);
          console.log('Exception: (save)' + err.message);
          //this.toastrService.error("Error! Data not save.");
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }
  clientPeriod(){
    this.gSvc.getdata("api/ScpPackagePeriod/GetScpPackagePeriodByCompanyId?cmnCompanyId=" + this.auth.getCompany()).subscribe(res => {
      this.subscribtionTypes = res;
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (subscribtionTypes)' + err.message);
    })
  }
  syncAddressAsMSO() {
    this.gSvc.getdata("Common/Company/GetMainServiceOperator").subscribe(res => {
      this.msoInfo = res;
      this.frm.controls['cmnCountryId'].setValue(this.msoInfo.cmnCountryId);
      this.frm.controls['cmnDivisionId'].setValue(this.msoInfo.cmnDivisionId);
      this.getDistrictByDivisionId();
      this.frm.controls['cmnDistrictId'].setValue(this.msoInfo.cmnDistrictId);
      this.getUpazillaByDistrictId();
    }, err => {
    })
  }

  getDistrictByDivisionId() {
    this.apiurl = "api/GeneralServices/District/" + this.frm.controls['cmnDivisionId'].value;
    this.gSvc.getdata(this.apiurl).subscribe(res => {
      this.districtList = res;
      if (this.frm.controls['id'].value > 0) {
        this.frm.controls['cmnDistrictId'].setValue(this.frm.controls['cmnDistrictId'].value);
        this.getUpazillaByDistrictId();
      }
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getDistrictByDivisionId)' + err.message);
    })
  }
  getUpazillaByDistrictId() {
    this.apiurl = "api/GeneralServices/Upazila/" + this.frm.controls['cmnDistrictId'].value;
    this.gSvc.getdata(this.apiurl).subscribe(res => {
      this.thanaList = res;
      if (this.frm.controls['id'].value > 0) {
        this.frm.controls['cmnUpazillaId'].setValue(this.frm.controls['cmnUpazillaId'].value);
        this.getUnionByUpazillaId();
      }
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getUpazillaByDistrictId)' + err.message);
    })
  }
  getUnionByUpazillaId() {
    this.apiurl = "api/GeneralServices/Union/" + this.frm.controls['cmnUpazillaId'].value;
    this.gSvc.getdata(this.apiurl).subscribe(res => {
      this.unionList = res;
      if (this.frm.controls['id'].value > 0) {
        this.frm.controls['cmnUpazillaId'].setValue(this.frm.controls['cmnUpazillaId'].value);
      }
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getUnionByUpazillaId)' + err.message);
    })
  }
  reload() {
    // this.formId = 0;
    this.router.navigateByUrl('/home/subscriber/packageassign')
  }
  getCountry() {
    this.gSvc.postdata("Common/Country/Countries", {}).subscribe(res => {
      this.countryList = res;
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getCountry)' + err.message);
    })
  }
  getDivision() {
    this.gSvc.postdata("api/Division/Divisions", {}).subscribe(res => {
      this.divisionList = res;
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getDivision)' + err.message);
    })
  }
  // getSubscriberList() {
  //   this.progressStatus = false;
  //   this.gSvc.postdata("api/Subscriber/GetByCompanyId/" + this.auth.getCompany(), {}).subscribe(res => {
  //     this.subscriberList = res;
  //     this.progressStatus = true;
  //   }, err => {
  //     this.progressStatus = true;
  //     this.toastrService.error(err.message);
  //     console.log('Exception: (getSubscriberList)' + err.message);
  //   })
  // }

  getSubscriberList() {
    var requestBody = { companyId: this.auth.getCompany() };
    this.progressStatus = false;
    this.gSvc.postdata("api/Subscriber/GetSubscriberWithDeviceByParameter", JSON.stringify(requestBody)).subscribe(res => {
      this.subscriberList = res;
      this.progressStatus = true;
    }, err => {
      this.progressStatus = true;
      this.toastrService.error(err.message);
      console.log('Exception: (getSubscriberList)' + err.message);
    })
  }
reConnect(data:any){
  this.customernumber=data.customerNumber
  this.progressreConnectStatus=false;
  this.gSvc.postdata("api/SubscriberPackage/ReconnectPackage?deviceNumberId=" + data.prdDeviceNumberId, {}).subscribe(res => {
    
    this.devices = res;
    this.customernumber=null;
    this.progressreConnectStatus=true;

    if(res.success){
      this.toastrService.success(res.message);
    }
    else{
      this.toastrService.warning(res.message);
    }
       

  }, err => {
    this.toastrService.error("Unable to perform operation, please try again later.");
    this.progressreConnectStatus=true;
  })

}
  edit(res: any) {
    debugger;
    this.selectedRow = res.id;
    this.scpSubscriberId = res.id;
    // this.getSubscriberList();
    //this.frm.patchValue(res);
    this.assignedDevices = res.devices;
    this.getDeviceBySubscriberId();
    this.subscriberFullName = res.firstName.trim() + ' ' + res.lastName.trim() + ' (' + res.customerNumber + ')';
    this.frm.setValue({
      id: res.id,
      cmnCompanyId: res.cmnCompanyId,
      code: res.code,
      firstName: res.firstName,
      lastName: res.lastName,
      gender: res.gender,
      contactNumber: res.contactNumber,
      customerNumber: res.customerNumber,
      email: res.email,
      nidNo: res.nidNo,
      kYC: res.kyc,
      cmnCountryId: res.cmnCountryId,
      cmnDivisionId: res.cmnDivisionId,
      cmnDistrictId: res.cmnDistrictId,
      cmnUpazillaId: res.cmnUpazillaId,
      cmnUnionId: res.cmnUnionId,
      address: res.address,
      postCode: res.postCode,
      subscriberType: res.subscriberType,
      isActive: true,
      createdBy: this.auth.getUserId,
      createdDate: new Date(),
      modifiedBy: new Date(),
    });

    if (res.devices.length == 1) {
      this.frmDeviceAssign.setValue({
        id: res.devices[0].id,
        refNo: "",
        scpSubscriberId: res.devices[0].scpSubscriberId,
        prdDeviceNumberId: res.devices[0].prdDeviceNumberId,
        deviceNumber: res.devices[0].deviceNumber,
        amount: res.devices[0].amount,
        paymentStatus: null,
        isPayWithSubscription: false,
        paymentSchedule: null,
        discount: null,
        date: new Date(),
        cardNumber: res.devices[0].cardNumber,
        prdCardNumberId: res.devices[0].prdCardNumberId,
        anFPaymentMethodId: '1',
        paidAmount: res.devices[0].amount,
        isActive: res.devices[0].isActive,
        createdBy: this.auth.getUserId(),
        createdDate: new Date(),
        modifiedBy: this.auth.getUserId(),
        subscriberName: (res.firstName.trim() + ' ' + res.lastName.trim()).trim(),
        scpDeviceAssignId: null,
        remarks: null,
        cmnCompanyId: this.auth.getCompany()
      });
    } else {
      this.frmDeviceAssign.setValue({
        id: 0,
        refNo: "",
        scpSubscriberId: res.id,
        prdDeviceNumberId: null,
        deviceNumber: null,
        amount: null,
        paymentStatus: null,
        isPayWithSubscription: false,
        paymentSchedule: null,
        discount: null,
        date: new Date(),
        cardNumber: null,
        prdCardNumberId: null,
        anFPaymentMethodId: '1',
        paidAmount: null,
        isActive: true,
        createdBy: this.auth.getUserId(),
        createdDate: new Date(),
        modifiedBy: this.auth.getUserId(),
        subscriberName: (res.firstName.trim() + ' ' + res.lastName.trim()).trim(),
        scpDeviceAssignId: null,
        remarks: null,
        cmnCompanyId: this.auth.getCompany()
      });
    }

    if (res.devices.length == 1) {
      this.frmPackageAssign.setValue({
        id: res.package.id,
        scpSubscriberId: res.package.scpSubscriberId,
        prdDeviceNumberId: res.package.prdDeviceNumberId,
        scpPackageId: res.package.scpPackageId,
        amount: res.package.amount,
        period: res.package.period,
        isFree: res.package.isFree,
        freeDays: res.package.freeDays,
        isActive: res.package.isActive,
        createdBy: this.auth.getUserId(),
        createdDate: new Date(),
        modifiedBy: this.auth.getUserId(),
        modifiedDate: new Date(),
        status: res.package.status,
        subscribtionTypeId: res.package.subscriptionTypeId,
        cardNumber: res.cardNumber,
        packageType: res.package.packageType,
        currentStatus: null,//res.package.currentStatus,
        anFPaymentMethodId: res.package.anFPaymentMethodId,
        isExpired: res.package.isExpired
      });

      this.getDeviceBySubscriberId();
    } else {
      this.frmPackageAssign.setValue({
        id: 0,
        scpSubscriberId: res.id,
        prdDeviceNumberId: null,
        scpPackageId: null,
        amount: null,
        period: 1,
        isFree: null,
        freeDays: null,
        isActive: true,
        createdBy: this.auth.getUserId(),
        createdDate: new Date(),
        modifiedBy: this.auth.getUserId(),
        modifiedDate: new Date(),
        status: null,
        subscribtionTypeId: 1,
        cardNumber: null,
        packageType: 2,
        currentStatus: null,//res.package.currentStatus,
        anFPaymentMethodId: 1,
        isExpired: null
      });

      if (res.devices.length > 1) {
        this.assignedDevices = res.devices;
        this.subscriberDeviceList=[];
        res.devices.forEach((item:any) => {
          this.subscriberDeviceList.push({deviceNumber:item.deviceNumber});
        });
      }
    }

    
    
    this.getSubscriberPackage();

    this.getDistrictByDivisionId();

    //this.getSubscriberDetail();
  }

  clear(table: Table) {
    table.clear();
  }
  search() {
    var requestBody = this.frmsrc.value;
    requestBody.companyId = this.auth.getCompany();
    this.progressStatus=false;
    this.gSvc.postdata("api/Subscriber/GetSubscriberWithDeviceByParameter", JSON.stringify(requestBody)).subscribe(res => {
      this.subscriberList = res;
      this.progressStatus=true;

    }, err => {
      this.progressStatus=true;
      this.toastrService.error(err.message);
            console.log('Exception: (search)' +  err.message);
      //this.toastrService.error("Error ! Data is not found . ");
    })
  }
  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }
  //End Of Create Subscriber

  searchReset() {
    this.frmsrc.reset();
    this.frmsrc.markAsPristine();
  }
  //Start Of DeviceAssign-------
  assignDevice() {
    if (this.frmDeviceAssign.invalid) return false;
    //console.log(this.frm.value);
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var obj = this.frmDeviceAssign.value;
        obj.scpSubscriberId = this.scpSubscriberId;
        obj.createdBy = this.auth.getUserId();
        obj.cmnCompanyId = this.auth.getCompany();


        console.log(JSON.stringify(obj));

        this.gSvc.postdata("api/DeviceAssign/AssignDevice", JSON.stringify(obj)).subscribe(res => {

          if (res.success == true) {
            this.openTab(2)
            this.toastrService.success("Device Assigned Successfully");
            //New On 03.02.2024
            this.isPayWithSubscription = false;

            //New: 07022024
            this.getDeviceBySubscriberId();
            //Old: 07022024
            //this.getDevices();

            this.getCards();

            //Asad Commented On 06.02.2023--> When Merging
            //this.getSubscriberInvoice();
            //this.getAssignHistory();
            //this.router.navigate(['/home/subscription/addSubscriber']);
            //End           

          } else {
            if (res.message != undefined) {
              this.toastrService.error(res.message);
            } else {
              this.toastrService.error("There is assign problem");
            }
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

  resetDeviceAssign() {
    this.isPayWithSubscription = false;
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }
  paymentType() {
    this.gSvc.postdata("api/PaymentMethod/GetActivePaymentMode", {}).subscribe(res => {
      this.paymentMoodList = res;
    }, err => {
      this.toastrService.error("Error ! Data is not Found . ");
    })
  }
  getDevices() {
    this.gSvc.postdata("Inventory/Purchase/GetUnassignStockInDeviceByCompanyId?companyId=" + this.auth.getCompany(), {}).subscribe(res => {
      this.devices = res;
    }, err => {
      this.toastrService.error("Error! Device not found!");
    })
  }
  getCards() {
    this.gSvc.postdata("Inventory/Purchase/GetUnpairStockInCardByCompanyId/" + this.auth.getCompany(), {}).subscribe(res => {
      this.deviceCards = res;
    }, err => {
      this.toastrService.error("Error! Card not found!");
    })
  }
  checkGetterAmount() {

    var amount = this.frmDeviceAssign.controls['amount'].value;
    var paidAmount = this.frmDeviceAssign.controls['paidAmount'].value;
    this.frmDeviceAssign.controls['paymentSchedule'].setValue(0);
    if (amount == null || paidAmount == null) {

      return;
    }

    if (amount > paidAmount) {
      this.checkGetter = false;
    }
    else {
      this.checkGetter = true;
    }
  }
  checkIsCardBase(id: any) {
    debugger;
    var cardbase = this.devices.find((x: { id: any; }) => x.id == id);
    if (cardbase.IsCardbased == true) {
      this.isCardBase = false;
    } else {
      this.isCardBase = true;

    }
  }
  getSubscriberInvoice() {
    this.gSvc.postdata("api/DeviceAssign/GetInvoiceInfoBySubscriberId?subscriberId=" + this.scpSubscriberId, {}).subscribe(res => {
      this.diviceInvoices = res;
    }, err => {

    })
  }
  getAssignHistory() {
    this.gSvc.postdata("api/DeviceAssign/GetAssignHistoryBySubscriberId?subscriberId=" + this.scpSubscriberId, {}).subscribe(res => {
      this.assignHistories = res;
    }, err => {

    })
  }

  subscriberFullName: string = '';
  getSubscriberDetail() {
    this.gSvc.postdata("api/Subscriber/GetById/" + this.scpSubscriberId, {}).subscribe(res => {
      this.subscriberDetails = res;
      if (this.subscriberDetails != null) {
        this.subscriberFullName = (this.subscriberDetails?.firstName + ' ' + this.subscriberDetails?.lastName).trim();
        if (this.subscriberFullName != '') {
          this.subscriberFullName = '- ' + this.subscriberFullName + ' (' + this.subscriberDetails?.customerNumber + ')';
        }
      }
    }, err => {
      this.toastrService.error("Error! Subscriber not found!");
    })
  }
  gateWayPermission(data: any) {
    this.payShow = false;
    if (this.frmDeviceAssign.get("anFPaymentMethodId")?.value == 5) {
      this.paymentAction = false;
      this.getPaymentList();
    } else {
      this.paymentAction = true;
    }
  }

  getPaymentList() {
    var param = {
      deviceNumberId: this.frmPackageAssign.get("prdDeviceNumberId")?.value,
      paymentMethodId: this.frmPackageAssign.get("anFPaymentMethodId")?.value,
      retUrl: this.curloc.split('?')[0]
    };
    var url = "api/MFSPGW/GetSSLCommerzGrantToken";
    this.gSvc.postparam(url, param).subscribe(res => {
      this.gateways = res.desc;

      this.getData();
      console.log(this.getArray);
      if (this.gateways.length > 0) {
        this.isShowSslPay = true;
      } else {
        this.isShowSslPay = false;
      }
    })
  }

  // getPaymentList() {
  //   var url = "api/MFSPGW/GetSSLCommerzGrantToken?deviceNumberId=" + this.frmPackageAssign.get("prdDeviceNumberId")?.value + "&&paymentMethodId=" + this.frmPackageAssign.get("anFPaymentMethodId")?.value;
  //   this.gSvc.postdata(url, {}).subscribe(res => {
  //     this.gateways = res.desc;
  //     this.getData();

  //     this.isShowSslPay = this.gateways.length > 0 ? true : false;
  //   })
  // }

  getData() {
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

  //End DeviceAssign-------


  //Strat Of Package

  getSubscriberPackage() {
    //New: 07.02.2024
    this.gSvc.postdata("api/SubscriberPackage/GetPackageInfoBySubscriberId?subscriberId=" + this.scpSubscriberId, {}).subscribe(res => {
      //Old: 07.02.2024
      //this.gSvc.postdata("api/SubscriberPackage/GetPackageInfoBySubscriberId?subscriberId=" + this.frm.get("scpSubscriberId")?.value, {}).subscribe(res => {
      this.SubPackageList = res;
      //console.log(this.SubPackageList);
      this.setPackageDetail();
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getSubscriberPackage)' + err.message);
    })
  }

  getStatus() {
    debugger;
    this.frmPackageAssign.controls['currentStatus'].setValue(null);
    this.setPackageDetail();
    this.GetDeviceLatestPackageInfoByDeviceNumberId();
    //New: 07.02.2024
    this.gSvc.postdata("api/SubscriberPackage/GetStatusBySubscriberAndDeviceId?subscriberId=" + this.scpSubscriberId + "&deviceNumberId=" + this.frmPackageAssign.get("prdDeviceNumberId")?.value, {}).subscribe(res => {
      //Old: 07.02.2024
      //this.gSvc.postdata("api/SubscriberPackage/GetStatusBySubscriberAndDeviceId?subscriberId=" + this.frm.get("scpSubscriberId")?.value + "&deviceNumberId=" + this.frm.get("prdDeviceNumberId")?.value, {}).subscribe(res => {
      debugger
      this.statusTypes = res;
    }, err => {
      debugger
      this.toastrService.error(err.message);
      console.log('Exception: (getStatus)' + err.message);
    })

  }

  setPackageDetail() {
    debugger;
    //var obj = this.frm.value;
    var objPackage = this.SubPackageList.find((w: { prdDeviceNumberId: any; }) => w.prdDeviceNumberId == this.frmPackageAssign.get("prdDeviceNumberId")?.value);

    if (objPackage != undefined) {
      this.frmPackageAssign.controls['amount'].setValue(objPackage.amount);
      this.frmPackageAssign.controls['isFree'].setValue(objPackage.isFree);
      this.frmPackageAssign.controls['freeDays'].setValue(objPackage.freeDays);
      this.frmPackageAssign.controls['isActive'].setValue(objPackage.isActive);

      this.frmPackageAssign.controls['scpPackageId'].setValue(objPackage.scpPackageId);
      this.frmPackageAssign.controls['period'].setValue(objPackage.period);
      this.frmPackageAssign.controls['packageType'].setValue(objPackage.packageType);
      this.frmPackageAssign.controls['currentStatus'].setValue(objPackage.statusType);
    }
  }

  GetDeviceLatestPackageInfoByDeviceNumberId() {
    //New: 07.02.2024
    debugger;
    var deviceNumberId = this.frmPackageAssign.controls["prdDeviceNumberId"].value;
    this.gSvc.postdata("api/SubscriberPackage/GetDeviceLatestPackageInfoByDeviceNumberId?deviceNumberId=" + deviceNumberId, {}).subscribe(res => {
      //Old: 07.02.2024
      //this.gSvc.postdata("api/SubscriberPackage/GetDeviceLatestPackageInfoByDeviceNumberId?deviceNumberId="+ this.frm.get("prdDeviceNumberId")?.value, {}).subscribe(res => {

      if (res == null || res === 'undedined') {//1st
        this.DeviceLatestPackageInfoByDeviceNumberId = res;
        this.isExpire = 1;
      } else {
        this.DeviceLatestPackageInfoByDeviceNumberId = res;
        this.isExpire = this.DeviceLatestPackageInfoByDeviceNumberId.isExpired;
      }

    }, err => {
      this.toastrService.error("Error ! Data is not Found . ");
    })
  }

  inactivePackage() {
    // this.toastrService.warning("This option is not active for you . ");
    // return;
    //if (this.frm.invalid) return false;
    //console.log(this.frm.value);
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        if (this.frmPackageAssign.controls['id'].value == 0) {
          this.frmPackageAssign.controls['createdBy'].setValue(this.auth.getUserId());
          this.frmPackageAssign.controls['createdDate'].setValue(new Date());
        } else if (this.frmPackageAssign.controls['id'].value > 0) {
          this.frmPackageAssign.controls['modifiedBy'].setValue(this.auth.getUserId());
        }

        var frmVal = this.frmPackageAssign.value;

        //New: 07.02.2024
        frmVal.scpSubscriberId = parseInt(this.scpSubscriberId);
        //Old: 07.02.2024
        //frmVal.scpSubscriberId = parseInt(this.frmPackageAssign.controls['scpSubscriberId'].value);

        this.gSvc.postdata("api/SubscriberPackage/InActivePackage", JSON.stringify({ obj: frmVal, status: 2 }))
          .subscribe(res => {
            if (res.success) {

              this.toastrService.success(res.message);

              this.getSubscriberPackage();
              //this.getPackageAssignHistory(); //Asad Commented At Merge- 02.06.2023

            }
          }, err => {
            this.toastrService.error(err.message);
            console.log('Exception: (save)' + err.message);
            //this.getPackageAssignHistory(); //Asad Commented At Merge- 02.06.2023
          })

        return true;
      },
      reject: () => {

      }

    })
    return false;
  }
  activateUnexpiredPackage() {

    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.frmPackageAssign.controls['anFPaymentMethodId'].setValue(1);
        if (this.frmPackageAssign.controls['id'].value == 0) {
          this.frmPackageAssign.controls['createdBy'].setValue(this.auth.getUserId());
          this.frmPackageAssign.controls['createdDate'].setValue(new Date());
        } else if (this.frmPackageAssign.controls['id'].value > 0) {
          this.frmPackageAssign.controls['modifiedBy'].setValue(this.auth.getUserId());
        }

        var frmVal = this.frmPackageAssign.value;

        //this.anFPaymentMethodId=frmVal.anFPaymentMethodId;
        frmVal.scpSubscriberId = parseInt(this.frmPackageAssign.controls['scpSubscriberId'].value);

        this.gSvc.postdata("api/SubscriberPackage/ActivateUnexpiredPackage", JSON.stringify({ obj: frmVal, status: 1 }))
          .subscribe(res => {
            if (res.success) {

              this.toastrService.success(res.message);

              this.getSubscriberPackage();
              //this.getPackageAssignHistory() //Asad Commented At Merge: 06.02.2024

            }
          }, err => {
            this.toastrService.error(err.message);
            console.log('Exception: (save)' + err.message);
            //this.getPackageAssignHistory(); //Asad Commented At Merge: 06.02.2024
          })

        return true;
      },
      reject: () => {

      }

    })
    return false;
  }

  getPackage() {
    this.gSvc.postdata("Subscription/Package/GetClientPackageByClientId/" + this.auth.getCompany(), {}).subscribe(res => {
      this.packages = res;
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getPackage)' + err.message);
    })
  }

  setPackagePrice() {
    debugger;
    var packageId = this.frmPackageAssign.get("scpPackageId")?.value;
    var objPackage = this.packages.find(w => w.id === packageId);
    if (objPackage != undefined) {
      this.frmPackageAssign.controls['amount'].setValue(objPackage.price);
    }
  }

  subDetails() {
    // console.log(id);
    var subscrId = this.frmPackageAssign.get("scpSubscriberId")?.value;
    this.gSvc.postdata("api/Subscriber/GetById/" + this.scpSubscriberId, {}).subscribe((res: any) => {
      //Old: 07.02.2024
      //this.gSvc.postdata("api/Subscriber/GetById/" + this.frm.get("scpSubscriberId")?.value, {}).subscribe((res: any) => {
      debugger;
      this.subscriberDetails = res; //ViewInfo Replaced By subscriberDetails At Merge
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (subDetails)' + err.message);
    })
  }

  getDeviceBySubscriberId() {

    //New: 07.02.2024
    const subscriberId = this.scpSubscriberId;
    //Old: 07.02.2024
    //const subscriberId = this.frmPackageAssign.get('scpSubscriberId')?.value;

    if (!subscriberId) {
      this.toastrService.error('Error! Please provide a subscriber ID.');
      return;
    }
    this.gSvc.postdata("api/DeviceAssign/GetAssignedDeviceBySubscriberId?subscriberId=" + subscriberId, {}).subscribe(
      (res) => {
        this.assignedDevices = res;

        this.subscriberDeviceList=[];
        res.forEach((item:any) => {
          this.subscriberDeviceList.push({deviceNumber:item.deviceNumber});
        });
        //console.log(JSON.stringify(res));

        if (res != undefined && res.length > 0) {
          this.frmPackageAssign.controls['prdDeviceNumberId'].setValue(res[0].prdDeviceNumberId);
          debugger;
          this.getStatus();
          this.getSubscriberPackage();


        }
      },
      (err) => {
        this.toastrService.error(err.message);
        console.log('Exception: (getDeviceBySubscriberId)' + err.message);
      }
    );
  }

  assignPackage() {
    // this.toastrService.warning("This option is not active for you . ");
    // return;
    if (this.frmPackageAssign.invalid) return false;
    //console.log(this.frm.value);
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        if (this.frmPackageAssign.controls['id'].value == 0) {
          this.frmPackageAssign.controls['createdBy'].setValue(this.auth.getUserId());
          this.frmPackageAssign.controls['createdDate'].setValue(new Date());
        } else if (this.frmPackageAssign.controls['id'].value > 0) {
          this.frmPackageAssign.controls['modifiedBy'].setValue(this.auth.getUserId());
        }

        var frmVal = this.frmPackageAssign.value;
        this.anFPaymentMethodId = frmVal.anFPaymentMethodId;
        frmVal.scpSubscriberId = parseInt(this.scpSubscriberId); // alert(parseInt(this.scpSubscriberId)); //parseInt(this.frmPackageAssign.controls['scpSubscriberId'].value);

        console.log(JSON.stringify(frmVal));


        this.gSvc.postdata("api/SubscriberPackage/Save", JSON.stringify({ obj: frmVal, status: 1 }))
          .subscribe(result => {
            if (result != undefined && result.operationId > 0) {
              this.gSvc.postdata("api/SubscriberPackage/ActivePackage", JSON.stringify({ obj: frmVal, status: 1 }))
                .subscribe(res => {
                  this.balService.updateCurrentBalance(0);
                  if (res != undefined && !res.success && res.operationId == -3) {
                    this.toastrService.warning("Error! Insufficient balance.");
                  }
                  else if (res.success) {

                    this.toastrService.success(res.message);
                    this.loadReportIn(res);
                    //this.getPackageAssignHistory() //Asad Commented At Merge
                    this.subDetails();
                    this.getDeviceBySubscriberId();

                  } else {
                    if (res.operationId == -4) {
                      if (this.anFPaymentMethodId == 5) {
                        this.paymentAction = false;
                        this.getPaymentList();
                        //this.getPackageAssignHistory(); //Asad Commented At Merge
                      }
                    } else {
                      this.toastrService.error("Error ! Package not assign . ");
                      //this.getPackageAssignHistory(); //Asad Commented At Merge
                    }
                  }
                }, err => {
                  this.toastrService.error(err.message);
                  console.log('Exception: (save)' + err.message);
                  //this.getPackageAssignHistory(); //Asad Commented At Merge
                })

            } else {
              this.toastrService.error("Error! " + result.message);
              //this.getPackageAssignHistory(); //Asad Commented At Merge
            }

          }, err => {
            this.toastrService.error(err.message);
            console.log('Exception: (save)' + err.message);
            //this.getPackageAssignHistory(); //Asad Commented At Merge
          })

        return true;
      },
      reject: () => {

      }

    })
    return false;
  }

  //End Of Package
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
  this._reportModal.maximized = true;
  var frm = { InvoiceId: data.operationId, companyId: this.auth.getCompany() };
  this.reportModal = true;
  var repFile = 'SubscriberBill.rdlc';
  var rmodel = { reportPath: '/reportfile/report/' + repFile, reportName: 'Subscriber Bill' };
  this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 800, 1);    
  var Models = JSON.stringify(frm);
  this._rptViewer.reportInPage(this._getReportUrl, Models);
}
//Report Execution




}