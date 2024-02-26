import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-stb-assign-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [ConfirmationService]
})
export class TestComponent implements OnInit {
  subscribers: any[] = [];
  packages: any[] = [];
  stbAssignList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  apiurl: any;
  networkList: any;
  devices: any;
  devicesCards: any;
  frm!: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private auth: AuthService, private toastrService: ToastrService) {
    this.frm = this.fb.group({
      id: new FormControl(0),
      scpSubscriberId: new FormControl(),
      prdDeviceNumberId: new FormControl(),
      scpPackageId: new FormControl(),
      amount: new FormControl(),
      period: new FormControl(),
      isFree: new FormControl(),
      freeDays: new FormControl(),
      isActive: new FormControl(true),
      createdBy: new FormControl(),
      createdDate: new FormControl(),
      modifiedBy: new FormControl(),
      modifiedDate: new FormControl()

    });
  }



  ngOnInit(): void {

    this.getSubscriber();
    this.getPackage();
    //this.getNetworkList();
  }

  save() {
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

        this.gSvc.postdata("api/SubscriberPackage/ActivePackage", JSON.stringify(this.frm.value)).subscribe(res => {
          this.toastrService.success("Saved success");
          //this.getPackage(); 
          this.reset();
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

  getSubscriber() {
    this.gSvc.postdata("api/Subscriber/GetAll", {}).subscribe(res => {
      this.subscribers = res;
    }, err => {
      this.toastrService.error("Error! Subscribers not found!");
    })
  }

  getPackage() {
    this.gSvc.postdata("Subscription/Package/GetAll", {}).subscribe(res => {
      this.packages = res;
    }, err => {
      this.toastrService.error("Error! Package not found");
    })
  }

  getDeviceBySubscriberId() {
    this.gSvc.postdata("api/DeviceAssign/GetAssignedDeviceBySubscriberId?subscriberId=" + this.frm.get("scpSubscriberId")?.value, {}).subscribe(res => {
      this.devices = res;
    }, err => {
      this.toastrService.error("Error! Device list not found!");
    })
  }

  setPackagePrice() {
    //var obj = this.frm.value;
    var packageId = this.frm.get("scpPackageId")?.value;
    var objPackage = this.packages.find(w => w.id === packageId);
    if (objPackage != undefined) {
      //obj.price=objPackage.price;
      this.frm.controls['price'].setValue(objPackage.price);
      //this.frm.controls['frm'].setValue(obj);
    }
  }

  STBActive(cardNumber: any) {
    let obj = {
      cardNumber: cardNumber
    }
    this.gSvc.postdata("api/SubscriberPackage/ReativeCard", JSON.stringify(obj)).subscribe(res => {
      this.frm.controls['cardNumber'].setValue(res.cardNumber);
      this.toastrService.success("Card Reactive Successful");
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  STBInActive(cardNumber: any) {
    let obj = {
      cardNumber: cardNumber
    }
    this.gSvc.postdata("api/SubscriberPackage/InActiveCard", JSON.stringify(obj)).subscribe(res => {
      this.frm.controls['cardNumber'].setValue(res.cardNumber);
      this.toastrService.success("Card Inactive Successful");
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  showModalDialog(id: any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("api/SubscriberPackage/STBAssign/" + id + "", {}).subscribe((res: any) => {
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
}