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
  templateUrl: './client-package.component.html',
  styleUrls: ['./client-package.component.css'],
  providers: [ConfirmationService]
})
export class ClientPackageComponent implements OnInit {
  [x: string]: any;

  CompanyPackagelist: any;
  CompanyCustomerlist: any;
  list:any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  progressStatus:boolean=true;
  frm!:FormGroup

  constructor(private fb: FormBuilder,
    private router: Router,
    private confirmationService: ConfirmationService,
    private gSvc: GeneralService,
    private toastrService: ToastrService,
    private auth :AuthService) {
  }

  ngOnInit(): void {
    this.getFrm();
    this.getClientPackage();
  }
  getFrm(){
    this.frm = this.fb.group({
      id: new FormControl(0),
      AnFCompanyPackageId: new FormControl(),
      CmnCompanyCustomerId: new FormControl([Validators.required]),
      date: new FormControl(new Date(), [Validators.required]),
      Rate: new FormControl([Validators.required]),
      Discount: new FormControl(),
      IsActive:new FormControl(true),
      IsFixed:new FormControl(true),
      Amount: new FormControl(),
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
        if (this.formId == 0) {
          this.gSvc.postdata("api/ClientPackage/Save", JSON.stringify(this.frm.value)).subscribe(res => {
            this.frm.reset();
            this.getClientPackage();
            this.toastrService.success("Bank Information Saved");
          }, err => {
            this.toastrService.error("Error! Bank Information Not Saved");
          })
        } else if (this.formId == 1) {
          this.gSvc.postdata("api/BankInformation/Save", JSON.stringify(this.frm.value)).subscribe(res => {
            this.frm.reset();
            this.formId = 0;
            this.getClientPackage();
            this.toastrService.success("Bank Information Updated");

          }, err => {
            this.toastrService.error("Error! Bank Information Not updated");
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

  getClientPackage() {
    this.progressStatus=false;
    this.gSvc.postdata("api/BankInformation/GetAll", {}).subscribe(res => {
      this.list = res;
    }, err => {
      this.toastrService.error("Error! Data list Not Found");
    })
    this.progressStatus=true;
  }

  getCompanyPackages() {
    this.progressStatus=false;
    this.gSvc.postdata("api/CompanyPackage/GetAll", {}).subscribe(res => {
      this.CompanyPackagelist = res;
    }, err => {
      this.toastrService.error("Error! Data list Not Found");
    })
    this.progressStatus=true;
  }

  getCompanyCustomer() {
    this.gSvc.postdata("api/CompanyCustomer/GetAll", {} ).subscribe(res => {
      this.CompanyCustomerlist = res;
    }, err => {
      this.toastrService.error("Error! Company list not found ");
    })   
  }


  edit(res: any) {
    this.formId = 1;
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
