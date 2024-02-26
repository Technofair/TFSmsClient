import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

interface user {
  id: number;
  name: string;
  isActive: boolean;
}
interface roleUser {
  id: number;
  secUserId: number;
  secRoleId: number;
  isActive: boolean;
  createdBy: number;
  createdDate: Date;
  modifiedBy: number;
  modifiedDate: Date;
}
@Component({
  selector: 'app-user-roles',
  templateUrl: './transfer-subscriber.component.html',
  styleUrls: ['./transfer-subscriber.component.css'],
  providers: [ConfirmationService]
})

export class TransferSubscriberComponent implements OnInit {
  frm!: FormGroup;
  transferfrm!: FormGroup;
  companyList: any;
  fromSubscriberList: any[] = [];
  toSubscriberList: any[] = [];

  cmnCompanyId: any;

  constructor(
    private fb: FormBuilder
    , private gSvc: GeneralService
    , private toastrService: ToastrService
    , private router: Router
    , private confirmationService: ConfirmationService
    , private Authser: AuthService) {
  }
  ngOnInit() {
    this.frm = this.fb.group({
      id: new FormControl(0),
      companyId: new FormControl(null, Validators.required)
    });
    this.transferfrm = this.fb.group({
      id: new FormControl(0),
      trasCompanyId: new FormControl(null, Validators.required)
    });
    //this.roleList();
    this.getCompany();
  }

  getSubscriberList() {
  
  this.fromSubscriberList = [];
  var cmnCompanyId = this.frm.get('companyId')?.value == null ? 0 : this.frm.get('companyId')?.value;
  
  if(cmnCompanyId == 0){
    this.toastrService.warning("Please select from Company.");
    return;
  }
  

  var param = {
    companyId: cmnCompanyId,
    clientId: null,
    CmnCountryId: null,
    CmnDivisionId: null,
    CmnDistrictId: null,
    CmnUpazillaId: null,
    CmnUnionId: null,
    FromDate: null,
    ToDate: null,
    Status: 1
    };

    console.log(param);

     this.gSvc.postdata("api/SubscriberPackage/GetSubscriptionInfoByParameter", param).subscribe(res => {


    //Old
    // this.gSvc.postdata("api/Subscriber/GetSubscriberWithDeviceOnlyByParameter", { companyId: this.frm.get('companyId')?.value }).subscribe(res => {
      

      if (res.length > 0) {
        var subscriberList: any[] = res;
        subscriberList.forEach(item => {
          var lstNm = item.lastName == null ? '' : item.lastName;
          item.fullName = (item.firstName + ' ' + lstNm).trim();
          item.isChecked = false;
        });

        this.fromSubscriberList = subscriberList;
      }
    }, err => {
      console.log(err);
      this.toastrService.error(err);
    })
  }

  getCompany() {
    this.gSvc.postdata("Common/Company/GetAll", {}).subscribe(res => {
      debugger;
      var cmpny:any[]=res;
      this.companyList = cmpny.filter(x=> x.cmnCompanyTypeId!=1);
    }, err => {
      this.toastrService.error("Error! Company list not found ");
    })
  }

  save() {
    if (this.frm.invalid || this.transferfrm.invalid || this.toSubscriberList.length == 0) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        var frmMstr = this.frm.value;
        var frmTrns = this.transferfrm.value;
        var transformedList: any[] = [];

       
        var fromCompanyId = frmMstr.companyId;
        var toCompanyId = frmTrns.trasCompanyId;
        
        if(fromCompanyId == null){
          this.toastrService.warning("Please Select From Compamy");
          return;
        }

        if(toCompanyId == null){
          this.toastrService.warning("Please Select To Compamy");
          return;
        }

        if(fromCompanyId == toCompanyId){
          this.toastrService.warning("Please Select Different Compamy");
          return;
        }

        if(this.toSubscriberList.length == 0){
          this.toastrService.warning("Please Add Device");
          return;
        }

        this.toSubscriberList.forEach(item => {
          transformedList.push({
            id: 0,
            cmnCompanyId: this.Authser.getCompany(),
            fromCompanyId: frmMstr.companyId,
            toCompanyId: frmTrns.trasCompanyId,
            scpSubscriberId: item.scpSubscriberId,
            prdDeviceNumberId: item.prdDeviceNumberId,
            prdCardNumberId: item.prdCardNumberId,
            remarks: null,
            createdBy: this.Authser.getUserId(),
            createdDate: new Date()
          });
        });

        this.gSvc.postdata("api/TransferSubscriber/Save", transformedList).subscribe(res => {
          this.reset();
          this.toastrService.success("Saved success");
        }, err => {
          this.toastrService.error("Error ! Subscriber transfer is not saved . ");
        })

      },
      reject: () => {
      }

    })
    return false;
  }

  isAllCheckedFrom: boolean = false;
  selectAll(ev: any) {
    
    var evnt = ev.currentTarget;
    this.isAllCheckedFrom = evnt.checked;
    this.fromSubscriberList.forEach(subs => (subs.isChecked = this.isAllCheckedFrom));
  }

  singleChecked(ev: any, item: any) {
    
    item.isChecked = ev.currentTarget.checked;
    var isAnyModel = this.fromSubscriberList.filter(x => !x.isChecked)[0];
    if (isAnyModel == undefined) {
      this.isAllCheckedFrom = true;
    } else {
      this.isAllCheckedFrom = false;
    }
  }

  transfer() {

    var fromCheckedSubscriberList: any[] = this.fromSubscriberList.filter(x => x.isChecked);



    if(fromCheckedSubscriberList.length == 0){
      this.toastrService.warning("Please Check Device");
    }
    else
    {
    fromCheckedSubscriberList.forEach(item => {
      var isex = this.toSubscriberList.filter(x => x.id == item.id)[0];
      if (isex == undefined) {
        this.toSubscriberList.push({
          id: item.id,
          fullName: item.fullName,
          deviceNumber: item.deviceNumber,
          scpSubscriberId: item.id,
          prdCardNumberId: item.prdCardNumberId,
          prdDeviceNumberId: item.prdDeviceNumberId,
          contactNumber: item.contactNumber,
          isChecked: false
        });
      }
    });
    this.toastrService.success("Subscriber transfer successfully! Save now !");
  }
}

  delTransferTo(index: number) {
    this.toSubscriberList.splice(index, 1);
  }

  delAllTransferTo() {
    this.toSubscriberList = [];
  }

  reset() {
    this.frm = this.fb.group({
      id: 0,
      companyId: null
    });

    this.transferfrm = this.fb.group({
      id: 0,
      trasCompanyId: null
    });

    this.fromSubscriberList = [];
    this.toSubscriberList = [];

    this.frm.markAsPristine();
    this.transferfrm.markAsPristine();
  }

}
