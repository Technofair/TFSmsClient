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
      anFCompanyPackageTypeId: new FormControl(Validators.required),
      anFCompanyPackageId: new FormControl(),
      cmnCompanyCustomerId: new FormControl(Validators.required),
      date: new FormControl(new Date(), Validators.required),
      amount: new FormControl(null,Validators.required),
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
  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
       
          console.log(JSON.stringify(this.frm.value));

          this.gSvc.postdata("api/TfClientPackage/Save", JSON.stringify(this.frm.value)).subscribe(res => {
            this.getFrm();
            this.getClientPackage();
            this.toastrService.success("ClientPackage Saved");
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

  getClientPackage() {
    this.progressStatus=false;
    this.gSvc.postdata("api/TfClientPackage/GetAllClientPackage", {}).subscribe(res => {
      console.log(res);
      this.list = res;
    }, err => {
      this.toastrService.error("Error! Data list Not Found");
    })
    this.progressStatus=true;
  }

  getCompanyPackages(event:any) {
    debugger
    this.gSvc.postdata("api/CompanyPackage/GetCompanyPackageByPackageType?anFCompanyPackageTypeId=" + event, {}).subscribe(res => {
      this.CompanyPackagelist = res;
     
    }, err => {
      this.toastrService.error("Error! Data list Not Found");
    })
  }

  getCompanyCustomer() {
    this.gSvc.postdata("api/CompanyCustomer/GetAll", {} ).subscribe(res => {
      this.CompanyCustomerlist = res;
      
    }, err => {
      this.toastrService.error("Error! Company list not found ");
    })   
  }
  getcompanyPackageTypes() {
    this.gSvc.postdata("api/CompanyPackageType/GetAll", {}).subscribe(res => {
      this.companyPackageTypes = res;
    }, err => {
      this.toastrService.error("Error! Data list Not Found");
    })    
  }
  setPrice(event:any){
    var price = this.CompanyPackagelist.find((x: { id: any; }) => x.id = event.value).price;
    this.frm.controls['amount'].setValue(price);

  }

  setTotalAmount(event:any){    
    debugger
    
    const amount = this.frm.controls['amount'].value;
    const discount = this.frm.controls['discount'].value;

    const totalAmount = amount - discount;
    this.frm.controls['totalAmount'].setValue(totalAmount);

  }


  edit(res: any) {
    debugger
    //var package = this.frm.controls['anFCompanyPackageId'].value;
    this.getCompanyPackages(res.anFCompanyPackageTypeId);
    this.frm.patchValue(res);
    alert(res.anFCompanyPackageId);
    //this.frm.controls['anFCompanyPackageId'].setValue(res.anFCompanyPackageId);
    
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
