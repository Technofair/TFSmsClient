import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-package-create',
  templateUrl: './package-create.component.html',
  styleUrls: ['./package-create.component.css'],
  providers: [ConfirmationService]
})
export class PackageCreateComponent {

  services: any[] = [];
  integratorPackages: any[] = [];
  packages: any[] = [];
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  id: any;
  isDisplayed: boolean = false;
  frm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService,private auth: AuthService, private toastrService: ToastrService, private route: ActivatedRoute) {
    this.frm = new FormGroup({
      id: new FormControl(0),
      cmnCompanyId:new FormControl(),
      cmnServiceTypeId: new FormControl("", [Validators.required]),
      name: new FormControl("",[Validators.required]),
      cmnIntegratorPackageId: new FormControl("", [Validators.required]),
      price: new FormControl("", [Validators.required]),
      period: new FormControl(0 ,[Validators.required]),
      isBasic: new FormControl(true),
      isFree: new FormControl(),
      maxFreeDays: new FormControl(),
      isAutoRefund: new FormControl(),
      isActive: new FormControl(true),
      createdBy: new FormControl(),
      createdDate: new FormControl(),
      modifiedBy: new FormControl(),
      modifiedDate: new FormControl()

    })
  }

  ngOnInit(): void {    
    this.getServiceType();
    this.getIntegratorPackage();
    this.getPackage();
  }

  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        if(this.frm.controls['id'].value==0){          
          this.frm.controls['cmnCompanyId'].setValue(this.auth.getCompany());
          this.frm.controls['createdBy'].setValue(this.auth.getUserId());
          this.frm.controls['createdDate'].setValue(new Date());
          }else if(this.frm.controls['id'].value>0){
            this.frm.controls['modifiedBy'].setValue(this.auth.getUserId());
          }

          this.gSvc.postdata("Subscription/Package/Save", JSON.stringify(this.frm.value)).subscribe(res => {            
            this.toastrService.success("Saved success");   
            this.getPackage(); 
            this.reset();
          }, err => {
            console.log(err.message);
            this.toastrService.error(err.message);
          })
        return true;
      },
      reject: () => {

      }

    })
    return false;
  }

  getServiceType() {
    this.gSvc.postdata("Common/ServiceType/GetAll", {}).subscribe(res => {      
      this.services = res;
    }, err => {
      this.toastrService.error("Error! Service type not found");
    })
  }

  getIntegratorPackage() {
    this.gSvc.postdata("Common/IntegratorPackage/GetIntegratorPackageByCompanyId?companyId="+this.auth.getCompany(), {}).subscribe(res => {
      //console.log(res);
      this.integratorPackages = res;
    }, err => {
      //this.toastrService.error("Error! Package not found");
    })
  }

  getPackage() {
    this.gSvc.postdata("Subscription/Package/GetAll", {}).subscribe(res => {
      this.packages = res;
    }, err => {
     // this.toastrService.error("Error! Package not found");
    })
  }

  onclick(event: any) {
    if (event.target.checked == true) {
      this.isDisplayed = true;
    }
    else {
      this.isDisplayed = false;
    }
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
    this.router.navigateByUrl('/home/subscription/packagecreate')
  }
  clear(table: Table) {
    table.clear();
  }
  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.controls['period'].setValue(0);
    this.frm.controls['isBasic'].setValue(true);
    this.frm.controls['isActive'].setValue(true);
    this.frm.markAsPristine();
  }
}