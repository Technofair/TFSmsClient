import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.css'],
  providers: [ConfirmationService]
})
export class DesignationComponent implements OnInit {

  companyList: any;
  designationList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  frm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService, private auth: AuthService) {

  }

  ngOnInit(): void {
    this.frm = new FormGroup({
      id: new FormControl(0,[Validators.required]),
      // cmnCompanyId: new FormControl(1, [Validators.required]),
      name: new FormControl("",[Validators.required]),
      shortName: new FormControl(),
      // hrmDesignationId: new FormControl("", [Validators.required]),
      priority: new FormControl([Validators.required]),
      isActive: new FormControl(true, [Validators.required]),
      createdBy: new FormControl(1, [Validators.required])
    })
    this.getDesignation();
  }

  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.gSvc.postdata("HRM/Designation/Save", JSON.stringify(this.frm.value)).subscribe(res => {
          console.log(this.frm.value);
          this.frm.reset();
          this.getDesignation();
          this.toastrService.success("Successful");
        }, err => {
          this.toastrService.error("Error! Data Not Saved.");
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }

  // getCompany() {
  //   this.gSvc.postdata("Common/Company/GetAll",{}).subscribe(res => {
  //     this.companyList = res;

  //   }, err => {
  //     this.toastrService.error("error");
  //   })
  // }

  getDesignation() {
    this.gSvc.postdata("HRM/Designation/GetAll", {}).subscribe(res => {
      this.designationList = res;

    }, err => {
      this.toastrService.error("error");
    })
  }

  edit(res: any) {
    this.formId = 1;
    this.frm.patchValue(res);
  }

  showModalDialog(res: any) {
    this.displayModal = true;
    this.reset();
    this.viewInfo = res;
  }

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/home/hrm/designation')
  }
  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }

  clear(table: Table) {
    table.clear();
  }
}