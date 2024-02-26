import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-stb-assign-list',
  templateUrl: './stb-assign-list.component.html',
  styleUrls: ['./stb-assign-list.component.css'],
  providers: [ConfirmationService]
})
export class StbAssignListComponent implements OnInit {
  subscriberList: any;
  packageList: any;
  stbAssignList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  casTypeList: any;
  apiurl: any;
  networkList: any;
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService) {
    this.getStbAssignList();
  }

  frm: FormGroup = new FormGroup({
    id: new FormGroup(""),
    subscriberId: new FormControl(""),
    cardNumber: new FormControl(""),
    netId: new FormControl(""),
    remarks: new FormControl(""),
    isActive: new FormControl(),
  })

  ngOnInit(): void {

    this.frm = this.fb.group({
      id: ["0"],
      subscriberId: ["", [Validators.required]],
      cardNumber: ["", [Validators.required]],
      netId: ["", [Validators.required]],
      remarks: [""],
      isActive: [true],
    });
    this.getStbAssignList();
  }

  getStbAssignList() {
    this.gSvc.postdata("api/STBAssign/STBAssigns", {}).subscribe(res => {
      this.stbAssignList = res;
    }, err => {
      this.toastrService.error("Division error!");
    })
  }

  STBActive(cardNumber: any) {
    let obj = {
      cardNumber: cardNumber
    }
    this.gSvc.postdata("api/STBAssign/ReativeCard", JSON.stringify(obj)).subscribe(res => {
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
    this.gSvc.postdata("api/STBAssign/InActiveCard", JSON.stringify(obj)).subscribe(res => {
      this.frm.controls['cardNumber'].setValue(res.cardNumber);
      this.toastrService.success("Card Inactive Successful");
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  edit(id: any) {
    this.formId = 1;
    this.getStbAssignList();
    this.gSvc.postdata("api/STBAssign/STBAssign/" + id + "", {}).subscribe((res: any) => {
      this.frm.controls['id'].setValue(res.id);
      this.frm.controls['subscriberId'].setValue(res.subscriberId);
      this.frm.controls['cardNumber'].setValue(res.cardNumber);
      this.frm.controls['remarks'].setValue(res.remarks);
    }, err => {
      this.toastrService.error("error");
    })
  }

  showModalDialog(id: any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("api/STBAssign/STBAssign/" + id + "", {}).subscribe((res: any) => {
      this.viewInfo = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/subscriber/stbAssign')
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