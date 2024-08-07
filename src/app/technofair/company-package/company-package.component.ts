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
  templateUrl: './company-package.component.html',
  styleUrls: ['./company-package.component.css'],
  providers: [ConfirmationService]
})
export class CompanyPackageComponent implements OnInit {

  CompanyPackages: any;
  selectedCustomers: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  progressStatus:boolean=true;
  frm!:FormGroup
  companyPackageTypes:any;
  rateshow:boolean=false;
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService, private auth :AuthService) {
   
  }

  ngOnInit(): void {
    this.getFrm();
    this.getCompanyPackages();
    this.getCompanyPackageTypeByAllowPackage();
  }
  getFrm(){
    this.frm = this.fb.group({
      id: new FormControl(0),
      tfaCompanyPackageTypeId:new FormControl(null,Validators.required),
      minSubscriber:new FormControl(null,Validators.required),
      maxSubscriber:new FormControl(null,Validators.required),
      rate:new FormControl(),
      price:new FormControl(),
      remarks:new FormControl(),
      isActive:new FormControl(true),
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
         
        if (this.frm.controls['id'].value == 0) {
          this.frm.controls['createdBy'].setValue(this.auth.getUserId());
          this.frm.controls['createdDate'].setValue(new Date());
        } else if (this.frm.controls['id'].value > 0) {
          this.frm.controls['modifiedBy'].setValue(this.auth.getUserId());
        }

          this.gSvc.postdata("api/TFACompanyPackage/Save", JSON.stringify(this.frm.value)).subscribe(res => {
            this.getFrm();
            this.getCompanyPackages();
            this.toastrService.success(res.message);
          }, err => {
            this.toastrService.error("Error! Company Package Not Saved");
          })
        
        return true;
      },
      reject: () => {

      }

    })
    return false;
  }
  // getcompanyPackageTypes() {
  //   this.gSvc.postdata("api/CompanyPackageType/GetAll", {}).subscribe(res => {
  //     this.companyPackageTypes = res;
  //   }, err => {
  //     this.toastrService.error("Error! Data list Not Found");
  //   })    
  // }


  getCompanyPackageTypeByAllowPackage(){
      this.gSvc.postdata("api/TFACompanyPackageType/GetCompanyPackageTypeByAllowPackage?allowPackage=" + true, {}).subscribe(res => {
      this.companyPackageTypes = res;
      console.log(this.companyPackageTypes);
    }, err => {
      this.toastrService.error("Error! Data list Not Found");
    }) 
  }
  getRatePrice(id:any){
   if(id==2){
    this.rateshow=true;
    this.frm.controls["rate"].setValidators(this.rateshow ? Validators.required:null);
    this.frm.controls["price"].setValidators(null);
   }else{
    this.rateshow=false;
    this.frm.controls["rate"].setValidators(null);
    this.frm.controls["price"].setValidators(this.rateshow?null:Validators.required);
   }
   
  
  }
  getCompanyPackages() {
    this.progressStatus=false;
    this.gSvc.postdata("api/TFACompanyPackage/GetAllCompanyPackage", {}).subscribe(res => {
    this.CompanyPackages = res;
    }, err => {
      this.toastrService.error("Error! Data list Not Found");
    })
    this.progressStatus=true;
  }

  edit(res: any) {
    
    this.frm.patchValue(res);
    this.getRatePrice(this.frm.controls['tfaCompanyPackageTypeId'].value);
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
    this.getFrm();
  }
  clear(table: Table) {
    table.clear();
  }
}
