import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-integrator-package',
  templateUrl: './integrator-package.component.html',
  styleUrls: ['./integrator-package.component.css'],
  providers: [ConfirmationService]
})
export class IntegratorPackageComponent implements OnInit {



  suppliers: any;
  serviceList: any;
  countries: any;
  selectedCustomers: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  packageTypes: any;
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService) {
    this.getServiceType();
    this.getSuppliers();
  }

  frm: FormGroup = new FormGroup({
    Id: new FormControl(""),
    Name: new FormControl(""),
    Address: new FormControl(""),
    Phone: new FormControl(""),
    Fax: new FormControl(""),
    Email: new FormControl(""),
    Website: new FormControl(""),
    ContactPerson: new FormControl(""),
    ContactPersonNo: new FormControl(""),
    CmnCountryId: new FormControl(""),
    AnFChartOfAccountParentId: new FormControl(""),
    AnFChartOfAccountId: new FormControl(""),
    CmnCompanyId: new FormControl(""),
    CmnCurrencyId: new FormControl(""),
    isActive: new FormControl(""),
    isEnlisted: new FormControl(""),
    createdBy: new FormControl(""),
    createdDate: new FormControl(""),
    modifiedBy: new FormControl(""),
    modifiedDate: new FormControl(""),
    remarks: new FormControl(""),
  })

  ngOnInit(): void {
    this.frm = this.fb.group({
      id: ["0"],
      name: ["", [Validators.required]],
      phone: ["1"],
      address: [""],
      fax: ["0"],
      email: [""],
      website: ["0"],
      contactPerson: [""],
      contactPersonNo: [""],
      cmnCountryId: ["1"],
      anFChartOfAccountParentId: ["1"],
      anFChartOfAccountId: ["1"],
      cmnCompanyId: [""],
      cmnCurrencyId: [""],
      isActive: [true],
      isEnlisted: [true],
      createdBy: ["1"],
      createdDate: ["2023-05-17"],
      modifiedBy: ["1"],
      modifiedDate: [""],
      remarks: [""],
    });
    // this.getCountries();
    this.getSuppliers();
    this.packageTypes = [{ 'id': 1, "name": 'Basic' }, { 'id': 2, "name": 'Addon' }, { 'id': 2, "name": 'Alacart' }];
  }

  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.formId == 0) {

          this.gSvc.postdata("Inventory/Supplier/Save", JSON.stringify(this.frm.value)).subscribe(res => {
            this.frm.reset();
            this.getSuppliers();
            this.toastrService.success("Supplier Saved");
          }, err => {
            this.toastrService.error("Error! Supplier Not Saved");
          })
        } else if (this.formId == 1) {
          this.gSvc.postdata("Inventory/Supplier/Save", JSON.stringify(this.frm.value)).subscribe(res => {
            this.frm.reset();
            this.formId = 0;
            this.getSuppliers();
            this.toastrService.success("Supplier Updated");

          }, err => {
            this.toastrService.error("Error! Supplier Not updated");
          })
        } else {
          this.toastrService.error("System error!");
        }
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
      this.frm.controls['id'].setValue(res.id);
      this.frm.controls['name'].setValue(res.name);
      this.frm.controls['phone'].setValue(res.phone);
      this.frm.controls['fax'].setValue(res.fax);
      this.frm.controls['email'].setValue(res.email);
      this.frm.controls['website'].setValue(res.website);
      this.frm.controls['contactPerson'].setValue(res.contactPerson);
      this.frm.controls['contactPersonNo'].setValue(res.contactPersonNo);
      this.frm.controls['cmnCountryId'].setValue(res.cmnCountryId);
      this.frm.controls['anFChartOfAccountParentId'].setValue(res.anFChartOfAccountParentId);
      this.frm.controls['anFChartOfAccountId'].setValue(res.anFChartOfAccountId);
      this.frm.controls['cmnCompanyId'].setValue(res.cmnCompanyId);
      this.frm.controls['cmnCurrencyId'].setValue(res.cmnCurrencyId);
      this.frm.controls['isActive'].setValue(res.isActive);
      this.frm.controls['isEnlisted'].setValue(res.isEnlisted);
      this.frm.controls['createdBy'].setValue(res.isActive);
      this.frm.controls['createdDate'].setValue(res.isEnlisted);
      this.frm.controls['modifiedBy'].setValue(res.modifiedBy);
      this.frm.controls['modifiedDate'].setValue(res.modifiedDate);

      this.viewInfo = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }
  getServiceType() {
    this.gSvc.postdata("Common/ServiceType/GetAll", {}).subscribe(res => {
      console.log(res);
      this.serviceList = res;
    }, err => {
      this.toastrService.error("Error! Service Type List not found");
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
  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/inventory/itembrand')
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
