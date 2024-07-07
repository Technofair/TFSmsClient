import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-item-brand',
  templateUrl: './company-package-type.component.html',
  styleUrls: ['./company-package-type.component.css'],
  providers: [ConfirmationService]
})
export class CompanyPackageTypeComponent implements OnInit {
  [x: string]: any;

  companyPackageTypes: any;
  CompanyCustomerlist: any;
  list:any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  progressStatus:boolean=true;
  frm!:FormGroup
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService, private auth :AuthService) {
   
  }

  ngOnInit(): void {
    this.getFrm();
    this.getCompanyPackageTypes();
  }
  getFrm(){
    this.frm = this.fb.group({
      id: new FormControl(0),
      title: new FormControl("",Validators.required),
      remarks: new FormControl(""),
      isActive:new FormControl(true),
      allowPackage:new FormControl(false),
      createdBy:new FormControl(this.auth.getUserId()),
      createdDate:new FormControl(new Date()),
      modifiedBy:new FormControl(this.auth.getUserId()),
      modifiedDate:new FormControl(new Date())
    });
  }
  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
       
          //New
          this.gSvc.postdata("api/TFACompanyPackageType/Save", JSON.stringify(this.frm.value)).subscribe(res => {
            //Ole
          //this.gSvc.postdata("api/CompanyPackageType/Save", JSON.stringify(this.frm.value)).subscribe(res => {
            this.getFrm();
            this.getCompanyPackageTypes();
            this.toastrService.success("Company Package Type Saved");
          }, err => {
            this.toastrService.error("Error! Company Package Type Not Saved");
          })
         
        return true;
      },
      reject: () => {

      }

    })
    return false;
  }

  getCompanyPackageTypes() {
    this.progressStatus=false;
    this.gSvc.postdata("api/TFACompanyPackageType/GetAll", {}).subscribe(res => {
      this.companyPackageTypes = res;
    }, err => {
      this.toastrService.error("Error! Data list Not Found");
    })
    this.progressStatus=true;
  }

  edit(res: any) {
    this.frm.patchValue(res);
  }

  showModalDialog(id: any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("api/ItemBrand/ItemBrand/" + id + "", {}).subscribe((res: any) => {
      this.viewInfo = res;
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
