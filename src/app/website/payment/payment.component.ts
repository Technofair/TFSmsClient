import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { WebMenuComponent } from 'src/app/website/menu/menu.component';
import { TopNavBarComponent } from '../topnavbar/topnavbar.component';
import { FooterComponent } from '../footer/footer.component';
import { Location } from '@angular/common';
import { GeneralService } from 'src/app/services/general.service';
import { ConfirmationService } from 'primeng/api';
import { Utility } from 'src/app/services/utility.service';

@Component({
  selector: 'app-web',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  providers: [ConfirmationService]
})
export class PaymentComponent implements OnInit {

  @ViewChild(TopNavBarComponent) topNavBar!: TopNavBarComponent;
  @ViewChild(FooterComponent) footer!: FooterComponent;
  curloc: string = '';
  paymentMsg: string = '';
  PaymentInfoVisible: boolean = false;
  paymentStatusId:string='';
  constructor(private router: Router
    , public layoutService: LayoutService
    , private toastrService: ToastrService
    , private gSvc: GeneralService
    , private confirmationService: ConfirmationService
    , private fb: FormBuilder
    , private route: ActivatedRoute
    , private _location: Location
    , public util: Utility,) {
    this.curloc = location.href;
  }

  info: any;
  frmG!: FormGroup;
  subscriberDevices: any;
  devicesPackageInfo: any;
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

    this.getSubscriberDevice();
    this.createPackageRenew();
    this.getfrmG();
  };
  getfrmG() {
    this.frmG = this.fb.group({
      refNo: new FormControl(),
      fromDate: new FormControl(),
      toDate: new FormControl(),
      invSupplierId: new FormControl(),
      prdEditionId: new FormControl(),
      cmnCompanyId: new FormControl(),
      cmnFinancialYearId: new FormControl(),
      deviceNumber: new FormControl(''),
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
      deviceNumber: new FormControl(''),
      period: new FormControl(),
      packageType: new FormControl(),
      value: new FormControl([Validators.required, Validators.min(0)]),
      expDate: new FormControl(),
      isActive: new FormControl(true),
      createdBy: new FormControl(),
      createdDate: new FormControl(new Date()),
      modifiedBy: new FormControl(),
      modifiedDate: new FormControl(),
      packageValue: new FormControl(),
      paymentType: new FormControl(),
      anFPaymentMethodId: new FormControl(),
      statusType: new FormControl()
    });
  }
  login() {
    this.router.navigateByUrl(environment.baseurl + '#/login')
  }
 
  getSubscriberDevice() {

    this.gSvc.getdata("api/Company/GetMainServiceOperator").subscribe(res => {
      this.subscriberDevices = res;
    }, err => {
    
    })
  }
  getDevicePackageStatus(data: any) {
    this.devicesPackageInfo = this.subscriberDevices.find((w: { id: any; }) => w.id == data);
  }
  save() {

  }


  phoneNumber:string='';
  subscriberName:string='';
  userInfos: any;
  userInfoList:any[]=[];
  getUserInfoList() {
    debugger;    
    if (this.phoneNumber == '' || this.phoneNumber == null || this.phoneNumber == undefined) {
      return;
    }

    var url = "api/SubscriberPackage/GetSubscriptionInfoByMobileOrDeviceID?mdobileOrDeviceID="+this.phoneNumber;
    this.gSvc.postdata(url, {}).subscribe(res => {
      debugger;
      this.assignedDevices = res;
      //this.userInfos = res[0];
      this.subscriberName=res[0].package.subscriberName;
      if(this.assignedDevices.length==1){
        this.frmPackageRenew.controls['deviceNumber'].setValue(res[0].package.deviceNumber);
        this.getInfoOnChange();
      }
      //this.getAssignHistory(res.package.scpSubscriberId, res);
    }, err => {
      
    })
  }

  assignedDevices:any[]=[];
  getInfoOnChange() {
    debugger;
    var dvcNumber=this.frmPackageRenew.controls['deviceNumber'].value;
    if(dvcNumber==''){
      this.frmPackageRenew.setValue({
        id: null,        
        packageName:'',
        scpSubscriberId: null,
        prdDeviceNumberId: null,
        amount: null,
        discount: null,
        endDate: null,
        scpPackageId: null,
        deviceNumber: '',
        period: null,
        packageType: 2,
        value: null,
        expDate: null,
        isActive: true,
        createdBy: null,
        createdDate: new Date(),
        modifiedBy: null,
        modifiedDate: new Date(),
        packageValue: null,
        paymentType: 5,
        anFPaymentMethodId: 5,
        statusType: null
      });    
    }else{
    var model= this.assignedDevices.filter(x=> x.deviceNumber==dvcNumber)[0];
      this.frmPackageRenew.setValue({
        id: model.package.id,        
        packageName: model.package.packageName,
        scpSubscriberId: model.package.scpSubscriberId,
        prdDeviceNumberId: model.package.prdDeviceNumberId,
        amount: model.package.amount,
        discount: model.package.discount,
        endDate: model.package.endDate,
        scpPackageId: model.package.scpPackageId,
        deviceNumber: model.package.deviceNumber,
        period: model.package.period,
        packageType: 2,
        value: model.package.amount,
        expDate: model.package.endDate,
        isActive: true,
        createdBy: model.id,
        createdDate: new Date(),
        modifiedBy: model.id,
        modifiedDate: new Date(),
        packageValue: model.package.amount,
        paymentType: 5,
        anFPaymentMethodId: 5,
        statusType: model.package.statusType
      });    
    }
  }

  frmPackageRenew!: FormGroup;
  isShowSslPay: boolean = false;
  getArray: any = [{ id: 1, name: 'Mobile Banking', chield: [] }, { id: 2, name: 'Internet Banking', chield: [] }, { id: 3, name: 'Card', chield: [] }]
  gateways: any;
  getWayaList: any;
  savePackageRenew() {
    //this.frmPackageRenew.controls['createdBy'].setValue(this.auth.getUserId());
    this.frmPackageRenew.controls['createdDate'].setValue(new Date());
    this.frmPackageRenew.controls['endDate'].setValue(new Date());
    if (this.frmPackageRenew.invalid || this.isShowSslPay) return false;
    //console.log(this.frm.value); 
    // this.confirmationService.confirm({
    //   message: 'Are you sure that you want to proceed?',
    //   header: 'Confirmation',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {

        this.gSvc.postdata("api/SubscriberPackage/RenewPackage", JSON.stringify({ obj: this.frmPackageRenew.value, status: 0 })).subscribe(res => {
          debugger;
          if (res != undefined && !res.success && res.OperationId == -3) {
            this.toastrService.warning("Error! Insufficient balance.");
          }
          else {
            if (res.operationId == -4) {
              if (this.frmPackageRenew.controls['anFPaymentMethodId'].value == 5) {
                //this.paymentAction = false;
                this.getPaymentList();
                // this.getRenewableSubscriber();
              }
            } else {
              this.toastrService.error("Error ! Package not assign . ");
              // this.getRenewableSubscriber();
            }
          }

        }, err => {
          this.toastrService.error("Error ! Data is not saved . ");
        })

        return true;
    //   },
    //   reject: () => {
    //   }
    // })
    // return false;
  }

  getPaymentList() {
    // this.gSvc.postdata("api/MFSPGW/GetSSLCommerzGrantToken?deviceNumberId=553&&paymentMethodId=5", {}).subscribe(res => {
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
}
