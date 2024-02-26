import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common';
import { balanceService } from 'src/app/global';

@Component({
  selector: 'app-package-assign',
  templateUrl: './package-assign.component.html',
  styleUrls: ['./package-assign.component.css'],
  providers: [ConfirmationService]
})
export class PackageAssignComponent implements OnInit {
  paymentMsg: string = '';
  PaymentInfoVisible: boolean = false;
  paymentStatusId:string='';
  curloc: string = '';
  subscribers: any[] = [];
  packages: any[] = [];
  stbAssignList: any;
  displayModal: boolean = false;
  viewInfo: any = { firstName: "" };
  formId = 0;
  apiurl: any;
  networkList: any;
  devices: any[] = [];
  devicesCards: any;
  frm!: FormGroup;
  subscriberList: any;
  packageAssignList: any;
  statusTypes: any = [];
  SubPackageList: any = [];
  packageAssignHistory: any = [];
  userId: any;
  deviceId: any;
  status: any;
  gateways: any;
  getWayaList: any;
  distinctTyp: any;
  paymentMoodList: any
  paymentAction: boolean = true;
  isShowSslPay: boolean = false;
  anFPaymentMethodId:any;
  isExpire:any;
  DeviceLatestPackageInfoByDeviceNumberId:any;
  getArray: any = [{ id: 1, name: 'Mobile Banking', chield: [] }, { id: 2, name: 'Internet Banking', chield: [] }, { id: 3, name: 'Card', chield: [] }]
  //subscribtionTypes: any = [{ 'id': 1, 'name': 'Daily' }, { 'id': 2, 'name': 'Monthly' }, { 'id': 1, 'name': 'Yearly' }];
  subscribtionTypes: any = [{ 'id': 2, 'name': 'Monthly' }];
  constructor(
    private fb: FormBuilder
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService
    , private toastrService: ToastrService
    , private route: ActivatedRoute
    , private auth: AuthService
    , private _location: Location
    , private balService:balanceService) {
    debugger;
    this.curloc = location.href;
    this.getPackage();
    this.paymentType();
    // this.getDeviceBySubscriberId();
  }
  ngOnInit(): void {
    this.frm = this.fb.group({
      id: new FormControl(0),
      scpSubscriberId: new FormControl(parseInt(this.viewInfo.id)),
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
      isExpired:new FormControl()
    });

    var currUrl = this.route.snapshot.queryParamMap.get('urlNam');
    if (currUrl != null) {
      var trx = this.route.snapshot.queryParamMap.get('trxID');
      if (trx != null) {
        var sts:any = this.route.snapshot.queryParamMap.get('status');
        this.paymentMsg = sts == '1' ? 'Payment Success!!!' : sts == '2' ? 'Payment Faile!!!' : sts == '3' ? 'Payment Cancel' : '';
        this.PaymentInfoVisible = true;
        this.paymentStatusId=sts.toString();
        if(sts=='1'){
          this.balService.updateCurrentBalance(0);
        }
      }

      var id = this.route.snapshot.queryParamMap.get('id');
      if (id != null) {
        this._location.replaceState(currUrl);
        this.frm.controls["scpSubscriberId"].setValue(id);
        this.userId = id;
        this.subDetails();
        this.getDeviceBySubscriberId();
      }
    } else {
      this.router.navigate(['/home/subscription/addSubscriber']);
    }
  }
  paymentType() {
    this.gSvc.postdata("api/PaymentMethod/GetActivePaymentMode", {}).subscribe(res => {
      this.paymentMoodList = res;
    }, err => {
      this.toastrService.error("Error ! Data is not Found . ");
    })
  }
  GetDeviceLatestPackageInfoByDeviceNumberId() {
    this.gSvc.postdata("api/SubscriberPackage/GetDeviceLatestPackageInfoByDeviceNumberId?deviceNumberId="+ this.frm.get("prdDeviceNumberId")?.value, {}).subscribe(res => {
    
      if(res==null||res==='undedined'){//1st
        this.DeviceLatestPackageInfoByDeviceNumberId = res;
        this.isExpire=1;
      }else
      {
        this.DeviceLatestPackageInfoByDeviceNumberId = res;
        this.isExpire=this.DeviceLatestPackageInfoByDeviceNumberId.isExpired;
        

      }
     
      console.log(this.DeviceLatestPackageInfoByDeviceNumberId);

    }, err => {
      this.toastrService.error("Error ! Data is not Found . ");
    })
  }
  getSubscriberPackage() {
    this.gSvc.postdata("api/SubscriberPackage/GetPackageInfoBySubscriberId?subscriberId=" + this.frm.get("scpSubscriberId")?.value, {}).subscribe(res => {
      this.SubPackageList = res;
      console.log(this.SubPackageList);
      this.setPackageDetail();
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getSubscriberPackage)' + err.message);
    })
  }

  getPackageAssignHistory() {

    this.gSvc.postdata("api/SubscriberPackage/GetHistoryBySubscriberAndDeviceId?subscriberId=" + this.frm.get("scpSubscriberId")?.value + "&deviceNumberId=" + this.frm.get("prdDeviceNumberId")?.value, {}).subscribe(res => {
      this.packageAssignHistory = res;
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getPackageAssignHistory)' + err.message);

    })
  }
  getStatus() {
    this.frm.controls['currentStatus'].setValue(null);
    this.setPackageDetail();
    this.getPackageAssignHistory();
    this.GetDeviceLatestPackageInfoByDeviceNumberId()
    this.gSvc.postdata("api/SubscriberPackage/GetStatusBySubscriberAndDeviceId?subscriberId=" + this.frm.get("scpSubscriberId")?.value + "&deviceNumberId=" + this.frm.get("prdDeviceNumberId")?.value, {}).subscribe(res => {
      debugger
      this.statusTypes = res;
    }, err => {
      debugger
      this.toastrService.error(err.message);
      console.log('Exception: (getStatus)' + err.message);
    })

  }
  cardDetails(card: any) {
    var objPackage = this.SubPackageList.find((w: { prdDeviceNumberId: any; }) => w.prdDeviceNumberId == card.value);
    this.frm.patchValue(objPackage);
  }
  subDetails() {
    // console.log(id);
    var subscrId = this.frm.get("scpSubscriberId")?.value;
    this.gSvc.postdata("api/Subscriber/GetById/" + this.frm.get("scpSubscriberId")?.value, {}).subscribe((res: any) => {
      debugger;
      this.viewInfo = res;
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (subDetails)' + err.message);
    })
  }

  getPackage() {
    this.gSvc.postdata("Subscription/Package/GetClientPackageByClientId/" + this.auth.getCompany(), {}).subscribe(res => {
      this.packages = res;
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getPackage)' + err.message);
    })
  }

  // getDeviceBySubscriberId() {
  //   this.gSvc.postdata("api/DeviceAssign/GetAssignedDeviceBySubscriberId?subscriberId=" + this.frm.get("scpSubscriberId")?.value, {}).subscribe(res => {
  //     this.devices = res;
  //   }, err => {
  //     this.toastrService.error("Error! Device list not found!");
  //   })
  // }

  getDeviceBySubscriberId() {
    const subscriberId = this.frm.get('scpSubscriberId')?.value;
    if (!subscriberId) {
      this.toastrService.error('Error! Please provide a subscriber ID.');
      return;
    }
    this.gSvc.postdata("api/DeviceAssign/GetAssignedDeviceBySubscriberId?subscriberId=" + subscriberId, {}).subscribe(
      (res) => {
        this.devices = res;

        console.log(JSON.stringify(res));

        if (res != undefined && res.length > 0) {
          this.frm.controls['prdDeviceNumberId'].setValue(res[0].prdDeviceNumberId);
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

  setPackagePrice() {
    //var obj = this.frm.value;
    var packageId = this.frm.get("scpPackageId")?.value;
    var objPackage = this.packages.find(w => w.id === packageId);
    if (objPackage != undefined) {
      //obj.price=objPackage.price;
      this.frm.controls['amount'].setValue(objPackage.price);
      //this.frm.controls['frm'].setValue(obj);
    }
  }

  setPackageDetail() {
    var obj = this.frm.value;
    var objPackage = this.SubPackageList.find((w: { prdDeviceNumberId: any; }) => w.prdDeviceNumberId == this.frm.get("prdDeviceNumberId")?.value);
   console.log(objPackage);
    if (objPackage != undefined ) {
      if (objPackage.isActive)
      {
      this.frm.controls['amount'].setValue(objPackage.amount);
      this.frm.controls['isFree'].setValue(objPackage.isFree);
      this.frm.controls['freeDays'].setValue(objPackage.freeDays);
      this.frm.controls['isActive'].setValue(objPackage.isActive);

      this.frm.controls['scpPackageId'].setValue(objPackage.scpPackageId);
      this.frm.controls['period'].setValue(objPackage.period);
      this.frm.controls['packageType'].setValue(objPackage.packageType);
      }
      this.frm.controls['currentStatus'].setValue(objPackage.statusType);

      //this.frm.controls['anFPaymentMethodId'].setValue(objPackage.anFPaymentMethodId);

      //this.frm.controls['frm'].setValue(obj);
      //this.frm.patchValue(objPackage);
    }
  }

  save() {
    // this.toastrService.warning("This option is not active for you . ");
    // return;
    if (this.frm.invalid) return false;
    //console.log(this.frm.value);
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

        var frmVal = this.frm.value;
        this.anFPaymentMethodId=frmVal.anFPaymentMethodId;
        frmVal.scpSubscriberId = parseInt(this.frm.controls['scpSubscriberId'].value);

        this.gSvc.postdata("api/SubscriberPackage/Save", JSON.stringify({ obj: frmVal, status: 1}))
          .subscribe(result => {
            if (result != undefined && result.operationId>0) {
              this.gSvc.postdata("api/SubscriberPackage/ActivePackage", JSON.stringify({ obj: frmVal, status: 1 }))
                .subscribe(res => {
                  if (res != undefined && !res.success && res.operationId == -3) {
                    this.toastrService.warning("Error! Insufficient balance.");
                  }
                  else if (res.success) {
                    //this.toastrService.success("Package assign successfully");
                    this.toastrService.success(res.message);
                    //this.getPackage(); 
                    this.getPackageAssignHistory()
                    this.subDetails();
                    this.getDeviceBySubscriberId();
                    //  this.reset();
                    //this.reload();
                  } else {
                    if (res.operationId == -4) {
                      if (this.anFPaymentMethodId == 5) {
                        this.paymentAction = false;
                        this.getPaymentList();
                        this.getPackageAssignHistory();
                      }
                    } else {
                      this.toastrService.error("Error ! Package not assign . ");
                      this.getPackageAssignHistory();
                      //this.reset();
                      //this.reload();
                    }
                  }
                }, err => {
                  this.toastrService.error(err.message);
                  console.log('Exception: (save)' + err.message);
                  this.getPackageAssignHistory();
                })

            } else {
              this.toastrService.error("Error ! Subscriber package not map. ");
              this.getPackageAssignHistory();
            }

          }, err => {
            this.toastrService.error(err.message);
            console.log('Exception: (save)' + err.message);
            this.getPackageAssignHistory();
          })

        return true;
      },
      reject: () => {

      }

    })
    return false;
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

        if (this.frm.controls['id'].value == 0) {
          this.frm.controls['createdBy'].setValue(this.auth.getUserId());
          this.frm.controls['createdDate'].setValue(new Date());
        } else if (this.frm.controls['id'].value > 0) {
          this.frm.controls['modifiedBy'].setValue(this.auth.getUserId());
        }

        var frmVal = this.frm.value;
        //this.anFPaymentMethodId=frmVal.anFPaymentMethodId;
        frmVal.scpSubscriberId = parseInt(this.frm.controls['scpSubscriberId'].value);

              this.gSvc.postdata("api/SubscriberPackage/InActivePackage", JSON.stringify({ obj: frmVal, status: 2 }))
                .subscribe(res => {
                   if (res.success) {

                    this.toastrService.success(res.message);
                    
                    this.getSubscriberPackage(); //New: 03.02.2024
                    this.getPackageAssignHistory();

                    //this.subDetails();
                    //this.getDeviceBySubscriberId();
                    //  this.reset();
                    //this.reload();
                  } 
                }, err => {
                  this.toastrService.error(err.message);
                  console.log('Exception: (save)' + err.message);
                  this.getPackageAssignHistory();
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
         
        this.frm.controls['anFPaymentMethodId'].setValue(1);
        if (this.frm.controls['id'].value == 0) {
          this.frm.controls['createdBy'].setValue(this.auth.getUserId());
          this.frm.controls['createdDate'].setValue(new Date());
        } else if (this.frm.controls['id'].value > 0) {
          this.frm.controls['modifiedBy'].setValue(this.auth.getUserId());
        }

        var frmVal = this.frm.value;
      
        //this.anFPaymentMethodId=frmVal.anFPaymentMethodId;
        frmVal.scpSubscriberId = parseInt(this.frm.controls['scpSubscriberId'].value);

              this.gSvc.postdata("api/SubscriberPackage/ActivateUnexpiredPackage", JSON.stringify({ obj: frmVal, status: 1 }))
                .subscribe(res => {
                   if (res.success) {

                    this.toastrService.success(res.message);
                    
                    this.getSubscriberPackage(); //New: 03.02.2024
                    this.getPackageAssignHistory()
                    //this.subDetails();
                    //this.getDeviceBySubscriberId();
                    //  this.reset();
                    //this.reload();
                  } 
                }, err => {
                  this.toastrService.error(err.message);
                  console.log('Exception: (save)' + err.message);
                  this.getPackageAssignHistory();
                })

        return true;
      },
      reject: () => {

      }

    })
    return false;
  }
  reload() {
    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.frm.controls["scpSubscriberId"].setValue(params.id);

        this.subDetails();
        this.getDeviceBySubscriberId();
        this.getSubscriberPackage();
      }
    });

  }

  clear(table: Table) {
    table.clear();
  }

  reset() {
    this.frm.reset();
    this.frm.controls['period'].setValue(1);
   // this.anFPaymentMethodId = 1;

    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }
  activeInactive(res: any, st: any) {
    if (this.frm.invalid) return false;
    //console.log(this.frm.value);
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.frm.controls['scpSubscriberId'].setValue(this.viewInfo.id);
        this.frm.controls['prdDeviceNumberId'].setValue(res.prdDeviceNumberId);
        var dvc = this.SubPackageList.find((x: { prdDeviceNumberId: any; }) => x.prdDeviceNumberId == this.frm.get("prdDeviceNumberId")?.value);
        this.deviceId = dvc.deviceNumber;
        this.gSvc.postdata("api/SubscriberPackage/ActivePackage", JSON.stringify({ obj: res, status: st })).subscribe(res => {
          this.toastrService.success("Success");
          //this.getPackage(); 
          this.reset();
          this.reload();
          if (this.anFPaymentMethodId == 5) {
            this.paymentAction = false;
            this.getPaymentList();
          }
        }, err => {
          this.toastrService.error(err.message);
          console.log('Exception: (activeInactive)' + err.message);
        })
        this.getPackageAssignHistory();
        return true;
      },
      reject: () => {

      }

    })
    return false;
  }
  
  getPaymentList() {
    var param = {
      deviceNumberId: this.frm.get("prdDeviceNumberId")?.value,
      paymentMethodId: this.anFPaymentMethodId,
      retUrl: this.curloc.split('?')[0]
    };
    var url = "api/MFSPGW/GetSSLCommerzGrantToken";
    this.gSvc.postparam(url, param).subscribe(res => {
      this.gateways = res.desc;
     
      this.getData();
      console.log(this.getArray) ;
      if (this.gateways.length > 0) {
        this.isShowSslPay = true;
      } else {
        this.isShowSslPay = false;
      }
    })

    // var url = "api/MFSPGW/GetSSLCommerzGrantToken?deviceNumberId=" + this.frm.get("prdDeviceNumberId")?.value + "&&paymentMethodId=" + this.frm.get("anFPaymentMethodId")?.value;
    // this.gSvc.postdata(url, {}).subscribe(res => {
    //   this.gateways = res.desc;
    //   this.getData();
    // })
  }
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
  getWayaLists(data: any) {
    var dt = this.getArray.find((x: { id: any; }) => x.id == data);
    this.getWayaList = dt.chield;
  }

}
