import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-digital-money',
  templateUrl: './digital-money.component.html',
  styleUrls: ['./digital-money.component.css'],
  providers: [ConfirmationService]
})
export class DigitalMoneyComponent implements OnInit {

  digitalMoneyList: any;
  organizations: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService) {
    this.getDigitalMoneyList();
    this.getOrganizations();
    this.reload();
  }

  frm: FormGroup = new FormGroup({
    id: new FormControl(""),
    orgId: new FormControl(""),
    balance: new FormControl(""),
    remarks: new FormControl(""),
  })

  ngOnInit(): void {
    this.frm = this.fb.group({
      orgId: ["", [Validators.required]],
      balance: ["", [Validators.required]],
      id: ["0"],
      remarks: [""],
    });
    this.getDigitalMoneyList();
    this.getOrganizations();
  }

  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.frm.controls['id'].value == 0) {
          this.gSvc.postdata("api/DigitalMoney/AddMoney", JSON.stringify(this.frm.value)).subscribe(res => {
            this.frm.reset();
            this.getDigitalMoneyList();
            this.toastrService.success("Digital Money Saved");
            window.location.reload();
          }, err => {
            this.toastrService.error("error");
          })
        } else if (this.frm.controls['id'].value > 0) {
          this.gSvc.postdata("api/DigitalMoney/UpdateMoney", JSON.stringify(this.frm.value)).subscribe(res => {
            this.frm.reset();
            this.getDigitalMoneyList();
            this.toastrService.success("Digital Money Updated");
            this.router.navigateByUrl('/admin/digitalmoney')
          }, err => {
            this.toastrService.error("error");
          })
        } else {
          this.toastrService.error("Error");
        }
        this.reload();
        return true;
      },
      reject: () => {

      }

    })
    return false;
  }


  getDigitalMoneyList() {
    this.gSvc.postdata("api/DigitalMoney/DigitalMoneyes", {}).subscribe(res => {
      this.digitalMoneyList = res;
      console.log(res);
    }, err => {
      this.toastrService.error("Error! Digital Money list not found");
    })
  }

  getOrganizations() {
    this.gSvc.postdata("api/Organization/Organizations", {}).subscribe(res => {
      this.organizations = res;
      console.log(res);
    }, err => {
      this.toastrService.error("error ! Organizations not found. ");
    })
  }

  edit(id: any) {
    this.getDigitalMoneyList();
    this.formId = 1;
    this.gSvc.postdata("api/DigitalMoney/DigitalMoney/" + id + "", {}).subscribe((res: any) => {
      this.frm.controls['orgId'].setValue(res.orgId);
      this.frm.controls['balance'].setValue(res.balance);
      this.frm.controls['remarks'].setValue(res.remarks);
      this.frm.controls['id'].setValue(res.id);
    }, err => {
      this.toastrService.error("Error! Digital Money not found");
    })
  }

  showModalDialog(id: any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("api/DigitalMoney/DigitalMoney/" + id + "", {}).subscribe((res: any) => {
      this.viewInfo = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/home/account/digitalmoney');
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