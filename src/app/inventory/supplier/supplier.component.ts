import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ExportService } from 'src/app/layout/service/export.service';

@Component({
  selector: 'app-item-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
  providers: [ConfirmationService]
})
export class SupplierComponent implements OnInit {
  suppliers: any;
  countries: any;
  selectedCustomers: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  frm!: FormGroup
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private authAvc: AuthService, private toastrService: ToastrService,private exportService: ExportService) {

    this.getSuppliers();
  }

  ngOnInit(): void {
    this.createFrm();
    this.getSuppliers();
  }

  createFrm() {
    this.frm = this.fb.group({
      id: new FormControl("0"),
      name: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required]),
      phone: new FormControl(),
      email: new FormControl("", [Validators.required, Validators.email]),
      contactPerson: new FormControl("", [Validators.required]),
      contactPersonNo: new FormControl("", [Validators.required]),
      cmnCompanyId: new FormControl(),
      createdBy: new FormControl(),
      modifiedBy: new FormControl(),
      isActive: new FormControl(true)

    });
  }
  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.frm.controls["cmnCompanyId"].setValue(this.authAvc.getCompany())
        this.frm.get("id")?.value == "0" ? this.frm.controls["createdBy"].setValue(this.authAvc.getUserId()) : this.frm.controls["modifiedBy"].setValue(this.authAvc.getUserId());
        this.gSvc.postdata("Inventory/Supplier/Save", JSON.stringify(this.frm.value)).subscribe(res => {
          this.frm.reset();
          this.getSuppliers();
          this.toastrService.success("Supplier Saved");
          this.formId = 0;
        }, err => {
          this.toastrService.error("Error! Supplier Not Saved");
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }
  getSuppliers() {
    this.gSvc.postdata("Inventory/Supplier/GetAll", {}).subscribe(res => {
      this.suppliers = res
    }, err => {
      this.toastrService.error("Error! Data list Not Found");
    })
  }

  edit(id: any) {
    this.formId = 1;
    this.gSvc.postdata("Inventory/Supplier/GetById/" + id + "", {}).subscribe((res: any) => {
      this.frm.patchValue(res);
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  showModalDialog(id: any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("Inventory/Supplier/GetById/" + id + "", {}).subscribe((res: any) => {
      this.viewInfo = res;
      debugger;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }
  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }
  clear(table: Table) {
    table.clear();
  }
  exportToExcel(): void {
    const columnsToExport: any[] = ['name', 'contactPerson', 'contactPersonNo', 'email','address'];
    this.exportService.exportToExcel(this.suppliers, 'supplier', columnsToExport);
  }
}
