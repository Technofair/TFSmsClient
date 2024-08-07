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
  companyPackageTypes:any;
  allowPackage:boolean=false;
  rateshow:boolean=false;
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
    this.getCompanyCustomer();
    this. getcompanyPackageTypes();
  }
  getFrm(){
    this.frm = this.fb.group({
      id: new FormControl(0),
      tFACompanyPackageTypeId: new FormControl(Validators.required),
      tFACompanyPackageId: new FormControl(),
      tFACompanyCustomerId: new FormControl(Validators.required),
      date: new FormControl(new Date(), Validators.required),
      rate: new FormControl(),
      amount: new FormControl(),
      discount: new FormControl(null),
      isActive:new FormControl(true),
      isFixed:new FormControl(true),
      totalAmount: new FormControl(null),
      createdBy:new FormControl(this.auth.getUserId()),
      createdDate:new FormControl(new Date()),
      modifiedBy:new FormControl(this.auth.getUserId()),
      modifiedDate:new FormControl(new Date())
    });
  }
  getRatePrice(id:any){
    if(id==2){
     this.rateshow=true;
     this.frm.controls["rate"].setValidators(this.rateshow ? Validators.required:null);
     this.frm.controls["amount"].setValidators(null);
    }else{
     this.rateshow=false;
     this.frm.controls["rate"].setValidators(null);
     this.frm.controls["amount"].setValidators(this.rateshow?null:Validators.required);
    }
  }
  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.gSvc.postdata("api/TFAClientPackage/Save", JSON.stringify(this.frm.value)).subscribe(res => {
            this.getFrm();
            this.getClientPackage();
            this.toastrService.success(res.message);
          }, err => {
            this.toastrService.error("Error! ClientPackage Not Saved");
          })
        
        return true;
      },
      reject: () => {

      }
    })
    return false;
  }


  resetByCompanyChange(){
    this.frm.controls['tFACompanyPackageTypeId'].setValue(null);
    this.frm.controls['tFACompanyPackageId'].setValue(null);
    this.frm.controls['amount'].setValue(null);
    this.frm.controls['discount'].setValue(null);
    this.frm.controls['isActive'].setValue(true);
    this.frm.controls['totalAmount'].setValue(null);
    this.frm.controls['date'].setValue('');   
    
  }

  getClientPackage() {
    this.progressStatus=false;
    this.gSvc.postdata("api/TFAClientPackage/GetAllClientPackage", {}).subscribe(res => {
      this.list = res;
    }, err => {
      this.toastrService.error("Error! Data list Not Found");
    })
    this.progressStatus=true;
  }

  getCompanyPackages() {
    this.frm.controls['tFACompanyPackageId'].setValue(null);
    this.frm.controls['amount'].setValue(null);
    this.frm.controls['discount'].setValue(null);
    this.frm.controls['isActive'].setValue(true);
    this.frm.controls['totalAmount'].setValue(null);
    this.frm.controls['date'].setValue(''); 
    this.CompanyPackagelist='';
    var tFACompanyPackageTypeId = this.frm.controls['tFACompanyPackageTypeId'].value;
    this.allowPackage=this.companyPackageTypes.find((x: { id: any; })=>x.id==tFACompanyPackageTypeId).allowPackage;
    this.gSvc.postdata("api/TFACompanyPackage/GetCompanyPackageByPackageType?anFCompanyPackageTypeId=" + tFACompanyPackageTypeId, {}).subscribe(res => {
      this.CompanyPackagelist = res;
    }, err => {
      this.toastrService.error("Package list Not Found");
    })
  }

  getCompanyCustomer() {
    this.gSvc.postdata("api/TFACompanyCustomer/GetAll", {} ).subscribe(res => {
      this.CompanyCustomerlist = res;
      
    }, err => {
      this.toastrService.error("Error! Company list not found ");
    })   
  }
  getcompanyPackageTypes() {
    this.gSvc.postdata("api/TFACompanyPackageType/GetAll", {}).subscribe(res => {
     
      this.companyPackageTypes = res;
    }, err => {
      this.toastrService.error("Error! Data list Not Found");
    })    
  }

  
  setPrice(){
    var value =this.frm.controls['tFACompanyPackageId'].value;
    this.frm.controls['amount'].setValue('');    
    this.frm.controls['discount'].setValue(0);
    this.frm.controls['date'].setValue('');
    this.frm.controls['totalAmount'].setValue(null);
    
    var price = this.CompanyPackagelist.find((x: { id: any; }) => x.id ==value).price;
    this.frm.controls['amount'].setValue(price);    
    this.frm.controls['discount'].setValue(0);
    this.frm.controls['date'].setValue('');
    this.setTotalAmount();
  }

  setTotalAmount(){  
    const amount = this.frm.controls['amount'].value;
    const discount = this.frm.controls['discount'].value;
    const totalAmount = amount - discount;
    this.frm.controls['totalAmount'].setValue(totalAmount);

  }


  edit(res: any) {
    this.getCompanyPackages();
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
