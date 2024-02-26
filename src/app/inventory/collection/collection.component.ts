import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css'],
  providers: [ConfirmationService]
})
export class CollectionComponent {

  organizationList: any;
  test: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  frm!: FormGroup
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService) {
    this.getOrganizationList();
  }


  ngOnInit(): void {

    this.frm = this.fb.group({
      id: new FormControl(""),
      orgId: new FormControl(""),
      employeeId: new FormControl(""),
      client: new FormControl(""),
      dateform: new FormControl(""),
      dateto: new FormControl(""),
      refno: new FormControl(""),
      purchaseDate: new FormControl(""),
      amount: new FormControl(""),
      commission: new FormControl(""),
      totalCommission: new FormControl(""),
    });

  }

  save() {

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
    this.formId = 1;
    this.getOrganizationList();
    this.gSvc.postdata("api/ItemType/ItemType/" + id + "", {}).subscribe((res: any) => {
      // this.frm.controls['name'].setValue(res.name);
      // this.frm.controls['code'].setValue(res.code);
      // this.frm.controls['remarks'].setValue(res.remarks);
      // this.frm.controls['id'].setValue(res.id);
    }, err => {

      // this.toastrService.error("Error ! Item not found . ");
    })
  }

  showModalDialog(id: any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("api/ItemType/ItemType/" + id + "", {}).subscribe((res: any) => {
      this.viewInfo = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }
  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/inventory/collection')
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