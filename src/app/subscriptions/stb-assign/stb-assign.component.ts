import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-stb-assign',
  templateUrl: './stb-assign.component.html',
  styleUrls: ['./stb-assign.component.css'],
  providers: [ConfirmationService]
})
export class StbAssignComponent implements OnInit {
  subscriberList:any [] = [];
  packageList: any;
  stbAssignList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  apiurl: any;
  networkList: any;
  devices: any[] = [];
  devicesCards: any[] = [];
  subscribers: any[] = [];
  frm!:FormGroup;
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService,private auth: AuthService, private toastrService: ToastrService) {
    this.getSubscriber();
    this.getDevices();
    //this.getNetworkList();
  }

  
  ngOnInit(): void {
    //this.devicesCards = [{ 'id': 1, "number": '12345678' }, { 'id': 2, "number": '9876543' }, { 'id': 3, "number": 'Others' }]
    //this.devices = [{ 'id': 1, "name": 'STB' }, { 'id': 2, "name": 'olt' }, { 'id': 3, "name": 'Others' }]
    //this.subscribers = [{ 'id': 1, "number": '978734834' }, { 'id': 2, "number": '9876543' }, { 'id': 3, "number": 'Others' }]
    this.frm = this.fb.group({
      id: new FormControl(0),
      scpSubscriberId: new FormControl([Validators.required]),
      prdDeviceNumberId: new FormControl([Validators.required]),
    devicesNumber: new FormControl(""),    
    isActive: new FormControl(true),
    createdBy: new FormControl(this.auth.getUserId()),
    createdDate: new FormControl(new Date()),
    modifiedBy: new FormControl(this.auth.getUserId())
    });
    //this.getSubscriber();
    //this.getPackage();
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
        if (this.formId == 0) {
          this.gSvc.postdata("api/DeviceAssign/AssignDevice", JSON.stringify(this.frm.value)).subscribe(res => {
            this.frm.reset();
            this.toastrService.success("Assign successful");
          }, err => {
            this.toastrService.error("Error ! STB not assigned");
          })
        } else if (this.formId == 1) {
          this.gSvc.postdata("api/DeviceAssign/UpdateSTB", JSON.stringify(this.frm.value)).subscribe(res => {
            this.frm.reset();
            this.toastrService.success("Updated successful");
            this.formId == 1;
          }, err => {
            this.toastrService.error("Error ! Not updated . ");
          })
        } else {
          this.toastrService.error("Error ! STB Item is not Assined or updated");
        }
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

  getDevices() {
    this.gSvc.postdata("Inventory/Purchase/GetUnassignStockInDeviceByCompanyId/"+this.auth.getCompany(), {}).subscribe(res => {
      this.devices = res;
    }, err => {
      this.toastrService.error("Error! Device list not found!");
    })
  }

  getNetworkList() {
    this.gSvc.postdata("api/NetworkInfo/NetworkInfos", {}).subscribe(res => {
      this.networkList = res;
    }, err => {
      this.toastrService.error("Network Not Loaded")
    })
  }

  STBActive(cardNumber: any) {
    let obj = {
      cardNumber: cardNumber
    }
    this.gSvc.postdata("api/DeviceAssign/ReativeCard", JSON.stringify(obj)).subscribe(res => {
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
    this.gSvc.postdata("api/DeviceAssign/InActiveCard", JSON.stringify(obj)).subscribe(res => {
      this.frm.controls['cardNumber'].setValue(res.cardNumber);
      this.toastrService.success("Card Inactive Successful");
    }, err => {
      this.toastrService.error("Error! Data Not Found");
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
}