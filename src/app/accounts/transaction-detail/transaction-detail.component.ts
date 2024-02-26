import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.css'],
  providers: [ConfirmationService]
})
export class TransactionDetailComponent implements OnInit {

  transdetailList: any;
  digitalMoneyList: any;
  headList: any;
  chargeList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService) {
    this.getTransDetailList();
    this.getDigitalMoneyList();
    this.getHeadListList();
    this.getChargeList();
  }

  frm: FormGroup = new FormGroup({
    id: new FormControl(""),
    digitalMoneyId: new FormControl(""),
    headId: new FormControl(""),
    chargeId: new FormControl(""),
    credit: new FormControl(""),
    debit: new FormControl(""),
    remarks: new FormControl(""),
    isActive: new FormControl(""),
  })

  ngOnInit(): void {
    this.frm = this.fb.group({
      digitalMoneyId: ["", [Validators.required]],
      headId: [""],
      chargeId: [""],
      credit: [""],
      debit: [""],
      id: ["0"],
      remarks: [""],
      isActive: [""],
    });
    this.getTransDetailList();
    this.getDigitalMoneyList();
    this.getHeadListList();
    this.getChargeList();
  }

  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.formId == 0) {
          console.log(this.frm.value);
          this.gSvc.postdata("api/TransDetail/AddTransaction", JSON.stringify(this.frm.value)).subscribe(res => {
            this.frm.reset();
            this.getTransDetailList();
            this.toastrService.success("Transaction Saved");
            window.location.reload();
          }, err => {
            this.toastrService.error("Error ! Transaction is not saved . ");
          })
        } else if (this.formId == 1) {
          this.gSvc.postdata("api/TransDetail/UpdateTransaction", JSON.stringify(this.frm.value)).subscribe(res => {
            this.frm.reset();
            this.getTransDetailList();
            this.toastrService.success("Transaction Updated");
            this.formId == 1;
            window.location.reload();
          }, err => {
            this.toastrService.error("Error ! Transaction is not updated");
          })
        } else {
          this.toastrService.error("Error ! Transaction is not updated. ");
        }
        return true;
      },
      reject: () => {

      }

    })
    return false;
  }

  getTransDetailList() {
    this.gSvc.postdata("api/TransDetail/Transactions", {}).subscribe(res => {
      this.transdetailList = res;
      console.log(res);
    }, err => {
      this.toastrService.error("Error! Transaction list not found");
    })
  }

  getDigitalMoneyList() {
    this.gSvc.postdata("api/DigitalMoney/DigitalMoneyes", {}).subscribe(res => {
      this.digitalMoneyList = res;
      console.log(res);
    }, err => {
      this.toastrService.error("Error! Transaction list not found");
    })
  }

  getHeadListList() {
    this.gSvc.postdata("api/DigitalHead/DigitalHeads", {}).subscribe(res => {
      this.headList = res;
      console.log(res);
    }, err => {
      this.toastrService.error("Error! Transaction list not found");
    })
  }

  getChargeList() {
    this.gSvc.postdata("api/ChargeConfig/ChargeConfiges", {}).subscribe(res => {
      this.chargeList = res;
      console.log(res);
    }, err => {
      this.toastrService.error("Error! Transaction list not found");
    })
  }

  edit(id: any) {
    this.formId = 1;
    this.getTransDetailList();
    this.gSvc.postdata("api/TransDetail/Transaction/" + id + "", {}).subscribe((res: any) => {
      this.frm.controls['digitalMoneyId'].setValue(res.digitalMoneyId);
      this.frm.controls['headId'].setValue(res.headId);
      this.frm.controls['chargeId'].setValue(res.chargeId);
      this.frm.controls['credit'].setValue(res.credit);
      this.frm.controls['debit'].setValue(res.debit);
      this.frm.controls['remarks'].setValue(res.remarks);
      this.frm.controls['id'].setValue(res.id);
    }, err => {
      this.toastrService.error("Error! Digital Head not found");
    })
  }

  showModalDialog(id: any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("api/TransDetail/Transaction/" + id + "", {}).subscribe((res: any) => {
      this.viewInfo = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/home/account/transdetail');
    this.frm.value.id = 0;
  }
  clear(table: Table) {
    table.clear();
  }
  reset() { this.formId = 0; }
}