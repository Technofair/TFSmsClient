import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-charge-config',
  templateUrl: './charge-config.component.html',
  styleUrls: ['./charge-config.component.css'],
  providers: [ConfirmationService]
})
export class ChargeConfigComponent implements OnInit {

  chargeConfigList: any;
  headList: any;
  organizationList: any;

  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService) {
    this.getChargeConfigList();
    this.getOrganizationList();
    this.getHeadList();
  }

  frm: FormGroup = new FormGroup({
    id: new FormControl(""),
    headId: new FormControl(""),
    orgId: new FormControl(""),
    chrgAmnt: new FormControl(""),
    remarks: new FormControl(""),
    isActive: new FormControl(""),
  })

  ngOnInit(): void {
    this.frm = this.fb.group({
      headId: ["", [Validators.required]],
      orgId: ["", [Validators.required]],
      chrgAmnt: ["", [Validators.required]],
      id: ["0"],
      remarks: [""],
      isActive: [""],
    });
    this.getChargeConfigList();
    this.getOrganizationList();
    this.getHeadList();
  }

  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.frm.controls['id'].value == 0) {
          this.gSvc.postdata("api/ChargeConfig/AddChargeConfig", JSON.stringify(this.frm.value)).subscribe(res => {
            this.frm.reset();
            this.getChargeConfigList();
            this.toastrService.success("Charge Amount Saved");
          }, err => {
            this.toastrService.error("error");
          })
        } else if (this.frm.controls['id'].value > 0) {
          this.gSvc.postdata("api/ChargeConfig/UpdateChargeConfig", JSON.stringify(this.frm.value)).subscribe(res => {
            this.reset();
            this.getChargeConfigList();
            this.toastrService.success("Charge Amount Updated");
            this.router.navigateByUrl('/admin/chargeconfig')
          }, err => {
            this.toastrService.error("error");
          })
        } else {
          this.toastrService.error("Error");
        }
        return true;
      },
      reject: () => {

      }

    })
    return false;
  }

  getChargeConfigList() {
    this.gSvc.postdata("api/ChargeConfig/ChargeConfiges", {}).subscribe(res => {
      this.chargeConfigList = res;
      console.log(res);
    }, err => {
      this.toastrService.error("Error! Charge Amount list not found");
    })
  }

  getHeadList() {
    this.gSvc.postdata("api/DigitalHead/DigitalHeads", {}).subscribe(res => {
      this.headList = res;
      console.log(res);
    }, err => {
      this.toastrService.error("Error! Charge Amount list not found");
    })
  }

  getOrganizationList() {
    this.gSvc.postdata("api/Organization/Organizations", {}).subscribe(res => {
      this.organizationList = res;
      console.log(res);
    }, err => {
      this.toastrService.error("Error! Charge Amount list not found");
    })
  }

  edit(id: any) {
    this.getChargeConfigList();
    this.formId = 1;
    this.gSvc.postdata("api/ChargeConfig/ChargeConfig/" + id + "", {}).subscribe((res: any) => {
      this.frm.controls['headId'].setValue(res.headId);
      this.frm.controls['orgId'].setValue(res.orgId);
      this.frm.controls['chrgAmnt'].setValue(res.chrgAmnt);
      this.frm.controls['remarks'].setValue(res.remarks);
      this.frm.controls['id'].setValue(res.id);
    }, err => {
      this.toastrService.error("Error! Charge Amount not found");
    })
  }

  showModalDialog(id: any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("api/ChargeConfig/ChargeConfig/" + id + "", {}).subscribe((res: any) => {
      this.viewInfo = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/admin/chargeconfig')
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