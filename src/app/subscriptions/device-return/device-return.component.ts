import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-device-return',
  templateUrl: './device-return.component.html',
  styleUrls: ['./device-return.component.css'],
  providers: [ConfirmationService]
})
export class DeviceReturnComponent implements OnInit {

  packageList: any;
  stbAssignList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  apiurl: any;
  networkList: any;
  devices: any[] = [];
  deviceCards: any[] = [];
  subscribers: any[] = [];
  frm!: FormGroup;
  id: any;
  diviceInvoices: any[] = [];
  assignHistories: any[] = [];
  subscriberDetails: any;
  paymentMoodes: any = [{ name: "Cash", id: 1 }]
  constructor(
    private fb: FormBuilder
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService
    , private auth: AuthService
    , private toastrService: ToastrService
    , private route: ActivatedRoute
    , private _location: Location) {
    //this.getSubscriber();

    // this.route.paramMap.subscribe(params => {
    //   this.id = params.get('id');      
    // });

    debugger
    var currUrl = this.route.snapshot.queryParamMap.get('urlNam');
    if (currUrl != null) {
      this.id = this.route.snapshot.queryParamMap.get('id');
      this._location.replaceState(currUrl);

      this.getDeviceBySubscriberId();
    } else {
      this.router.navigate(['/home/subscription/addSubscriber']);
    }


  }

  ngOnInit(): void {

    this.createDeviceAssign();
    this.getSubscriberDetail();
    this.getSubscriberInvoice();
    this.getAssignHistory();
  }
  createDeviceAssign() {
    this.frm = this.fb.group({
      id: new FormControl(0),
      refNo: new FormControl(""),
      scpSubscriberId: new FormControl(),
      prdDeviceNumberId: new FormControl([Validators.required]),
      deviceNumber: new FormControl(),
      amount: new FormControl(),
      paymentStatus: new FormControl(),
      isPayWithSubscription: new FormControl(),
      paymentSchedule: new FormControl(),
      discount: new FormControl(),
      date: new FormControl(new Date()),
      cardNumber: new FormControl(),
      prdCardNumberId: new FormControl(),
      anFPaymentMethodId: new FormControl(),
      paidAmount: new FormControl(),
      isActive: new FormControl(true),
      createdBy: new FormControl(),
      createdDate: new FormControl(new Date()),
      modifiedBy: new FormControl(),
      subscriberName: new FormControl(),
    });
  }

  save() {
    if (this.frm.invalid) return false;
    //console.log(this.frm.value);
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        var obj = this.frm.value;
        obj.scpSubscriberId = this.id;
        obj.createdBy = this.auth.getUserId();
        this.gSvc.postdata("api/ReturnDevice/Save", JSON.stringify(obj)).subscribe(res => {
          if (res.success) {
            this.frm.reset();
            this.toastrService.success("Successfully saved");
          } else {
            this.toastrService.error("Error ! Data not save");
          }
        }, err => {
          this.toastrService.error("Error ! Data not save");
        })

        return true;
      },
      reject: () => {

      }

    })
    return false;
  }

  getSubscriberInvoice() {
    this.gSvc.postdata("api/DeviceAssign/GetInvoiceInfoBySubscriberId?subscriberId=" + this.id, {}).subscribe(res => {
      this.diviceInvoices = res;
    }, err => {
      this.toastrService.error("Error! Subscribers not found!");
    })
  }

  getAssignHistory() {
    this.gSvc.postdata("api/DeviceAssign/GetAssignHistoryBySubscriberId?subscriberId=" + this.id, {}).subscribe(res => {
      this.assignHistories = res;
    }, err => {
      this.toastrService.error("Error! Subscribers not found!");
    })
  }

  getSubscriberDetail() {
    this.gSvc.postdata("api/Subscriber/GetById/" + this.id, {}).subscribe(res => {
      this.subscriberDetails = res;
    }, err => {
      this.toastrService.error("Error! Data not found!");
    })
  }


  getDeviceBySubscriberId() {
    // const subscriberId = this.frm.get('scpSubscriberId')?.value;
    // if (!subscriberId) {
    //   this.toastrService.error('Error! Please provide a subscriber ID.');
    //   return;
    // }
    this.gSvc.postdata("api/DeviceAssign/GetAssignedDeviceBySubscriberId?subscriberId=" + +this.id, {}).subscribe(
      (res) => {
        this.devices = res;
      },
      (err) => {
        this.toastrService.error('Error! Device not found!');
      }
    );
  }

  getAvailableCard() {
    this.gSvc.postdata("api/NetworkInfo/NetworkInfos", {}).subscribe(res => {
      this.networkList = res;
    }, err => {
      this.toastrService.error("Network Not Loaded")
    })
  }



  showModalDialog(id: any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("api/DeviceAssign/STBAssign/" + id + "", {}).subscribe((res: any) => {
      this.viewInfo = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/subscriber/stbassign')
  }
  clear(table: Table) {
    table.clear();
  }
  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }
  edit(res: any) {
    this.frm.patchValue(res);
  }
}