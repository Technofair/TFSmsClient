import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-package-assign',
  templateUrl: './subscriber-package.component.html',
  styleUrls: ['./subscriber-package.component.css'],
  providers: [ConfirmationService]
})
export class SubscriberPackageComponent implements OnInit {

  subscriberList: any;
  stbList: any;
  id: any;
  displayModal: boolean = false;
  displayRenewModal: boolean = false;
  packageList: any = [{ 'id': 1, 'name': 'Allpackage', 'price': 250, 'channel': 200 }];
  alacartList: any = [{ 'id': 1, 'name': 'Btv', 'price': 25 }];
  addonList: any = [{ 'id': 1, 'name': 'BTV,ETV', 'price': 30 }];
  packageAssignList: any
  subscribtionTypes: any = [{ 'id': 1, 'name': 'Daily' }, { 'id': 2, 'name': 'Monthly' }, { 'id': 1, 'name': 'Yearly' }];
  numberOfMonth: any;
  formId = 0;
  apiurl: any;
  casTypeList: any;
  networkList: any;
  deviceList: any;
  isRenewModal: boolean = false;
  isStopModal: boolean = false;
  RENEWPACKAGE: any;
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService, private route: ActivatedRoute) {

  }
  hideDivPackage = false;
  hideDivAdon = true;
  hideDivAlacart = true;
  toggleDivPackage() {
    this.hideDivAdon = true;
    this.hideDivAlacart = true;
    this.hideDivPackage = !this.hideDivPackage;
    //this.packageList = [{ 'id': 1, 'name': 'Allpackage', 'price': 250, 'channel': 200 }];
  }
  toggleDivAdon() {
    this.hideDivPackage = true;
    this.hideDivAlacart = true;
    this.hideDivAdon = false;
    // this.hideDivAdon = !this.hideDivAdon;
  }
  toggleDivAlacart() {
    this.hideDivPackage = true;
    this.hideDivAdon = true;
    this.hideDivAlacart = false;
    // this.hideDivAlacart = !this.hideDivAlacart;
  }
  isFree = true;
  toggleDivIsFree() {
    this.isFree = !this.isFree;
  }

  frm: FormGroup = new FormGroup({
    packageId: new FormControl(""),
    monthDayAmount: new FormControl(""),
    subscribtionTypeId: new FormControl(""),
    cardNumber: new FormControl(""),
    startDate: new FormControl(""),
    networkNo: new FormControl(""),
    casType: new FormControl(""),
    isMonth: new FormControl(""),
    remarks: new FormControl(""),
    endDate: new FormControl(""),
    articleNumber: new FormControl(""),
  })

  frmModal: FormGroup = new FormGroup({
    cardNumber: new FormControl(""),
    startDate: new FormControl(new Date()),
    endDate: new FormControl(""),
    articleNumber: new FormControl(""),
  })


  ngOnInit(): void {

    this.frm = this.fb.group({
      id: ["0"],
      subscriberId: [""],
      packageId: [""],
      monthDayAmount: [""],
      startDate: [""],
      cardNumber: [""],
      networkNo: [""],
      casType: [""],
      isMonth: [JSON.parse('true')],
      remarks: [""],
      articleNo: ["0"],
      endDate: [""],
      articleNumber: [""],

    });

    this.frmModal = this.fb.group({
      cardNumber: [""],
      startDate: [new Date()],
      endDate: [new Date()],
      articleNumber: [""],
    })



    this.getStbList();
    this.getCasType();
    this.getSubscriberInfo();
    this.getPackageAssignList();

  }

  getSubscriberInfo() {
    this.gSvc.postdata("api/Subscriber/Subscribers", {}).subscribe(res => {
      this.subscriberList = res;
    }, err => {
      this.toastrService.error("Error! Subscribers not found!");
    })
  }


  getCasType() {
    this.gSvc.getdata("api/GeneralServices/CasType").subscribe(res => {
      this.casTypeList = res;
    }, err => {
      this.toastrService.error("CAS Type Not Loaded!");
    })
  }

  getCasTypeByNetwork() {
    console.log(this.frm.value);

    let d = this.frm.controls['casType'].value;
    this.apiurl = "api/GeneralServices/NetworkByCasType?casTypeId=" + this.frm.controls['casType'].value;
    this.gSvc.getdata(this.apiurl).subscribe(res => {
      console.log(res);
      this.networkList = res;

    }, err => {
      this.toastrService.error("error");
    })
  }

  getStbList() {
    this.gSvc.postdata("api/Item/Items/", {}).subscribe((res: any) => {
      console.log(res);
      this.stbList = res;
    }, err => {
      this.toastrService.error("error");
    })
  }

  getPackageAssignList() {
    this.gSvc.postdata("api/SubScriberPackage/PackageList", {}).subscribe((res: any) => {
      console.log(res);
      this.packageAssignList = res;
    }, err => {
      this.toastrService.error("error");
    })
  }

  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(this.frm.value);
        this.gSvc.postdata("api/SubScriberPackage/AssignPackage", JSON.stringify(this.frm.value)).subscribe(res => {
          console.log(this.frm.value);
          this.frm.reset();
          this.getPackageAssignList();
          this.toastrService.success("Assign successful");
        }, err => {
          this.toastrService.error("Error ! Package not assigned");
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }

  showRenewModal(cardNumber: any, startDate: any, endDate: any, articleNumber: any) {

    this.RENEWPACKAGE = "Renew Package";
    this.isRenewModal = true;
    this.isStopModal = false;
    this.displayRenewModal = true;
    this.frmModal.controls["cardNumber"].setValue(cardNumber);
    this.frmModal.controls["startDate"].setValue(new Date());
    this.frmModal.controls["endDate"].setValue(endDate);
    this.frmModal.controls["articleNumber"].setValue(articleNumber);
  }

  showStopModal(cardNumber: any, startDate: any, endDate: any, articleNumber: any) {

    this.isRenewModal = false;
    this.isStopModal = true;
    this.RENEWPACKAGE = "Stop Package";
    this.displayRenewModal = true;
    this.frmModal.controls["cardNumber"].setValue(cardNumber);
    this.frmModal.controls["startDate"].setValue(startDate);
    this.frmModal.controls["endDate"].setValue(endDate);
    this.frmModal.controls["articleNumber"].setValue(articleNumber);
  }


  renewPackage() {
    let obj = {
      cardNumber: this.frmModal.controls['cardNumber'].value,
      startDate: this.frmModal.controls['startDate'].value,
      endDate: this.frmModal.controls['endDate'].value,
      articleNumber: this.frmModal.controls['articleNumber'].value,
    }
    console.log(obj);
    this.gSvc.postdata("api/SubScriberPackage/RenewPackage", JSON.stringify(obj)).subscribe(res => {
      this.toastrService.success("Package Renew Successful");
      this.displayRenewModal = false;
    })
  }

  stopPackage() {
    let obj = {
      cardNumber: this.frmModal.controls['cardNumber'].value,
      startDate: this.frmModal.controls['startDate'].value,
      endDate: this.frmModal.controls['endDate'].value,
      articleNumber: this.frmModal.controls['articleNumber'].value,
    }
    console.log(obj);
    this.gSvc.postdata("api/SubScriberPackage/StopPackage", JSON.stringify(obj)).subscribe(res => {
      this.toastrService.success("Package Stoped Successful");
      this.displayRenewModal = false;
    })
  }

  revalidPackage(cardNumber: any, articleNumber: any) {
    this.frm.controls["cardNumber"].setValue(cardNumber);
    this.frm.controls["articleNumber"].setValue(articleNumber);
    let obj = {
      cardNumber: this.frm.controls['cardNumber'].value,
      articleNumber: this.frm.controls['articleNumber'].value,
    }
    console.log(obj);
    this.gSvc.postdata("api/SubScriberPackage/ReActivePackage", JSON.stringify(obj)).subscribe(res => {
      this.toastrService.success("Package Revalid Successful");
    })
  }

  invalidPackage(cardNumber: any, articleNumber: any) {
    this.frm.controls["cardNumber"].setValue(cardNumber);
    this.frm.controls["articleNumber"].setValue(articleNumber);
    let obj = {
      cardNumber: this.frm.controls['cardNumber'].value,
      articleNumber: this.frm.controls['articleNumber'].value,
    }
    console.log(obj);
    this.gSvc.postdata("api/SubScriberPackage/InActivePackage", JSON.stringify(obj)).subscribe(res => {
      this.toastrService.success("Package Invalid Successful");
    })
  }

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/home/subscriber/packageassign')
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