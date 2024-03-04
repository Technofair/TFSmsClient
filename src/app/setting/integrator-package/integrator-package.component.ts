import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

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
  integrators:any;
  packages:any;
  products:any;
  integratorPackages:any;
  integratorPackageList:any;
  frm!:FormGroup
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService,private auth:AuthService) {
    this.getServiceType();
    this.getSuppliers();
  }

 
  ngOnInit(): void {
    this.frm = this.fb.group({
    id: new FormControl(0),
    cmnCompanyId: new FormControl(this.auth.getCompany(),Validators.required),
    cmnIntegratorId: new FormControl(Validators.required),
    scpProductId: new FormControl(Validators.required),
    packageNo: new FormControl(Validators.required),
    name: new FormControl("",Validators.required),
    price: new FormControl(""),
    period: new FormControl(""),
    packageGroup: new FormControl(""),
    isActive: new FormControl(true),
    });
    this.getIntregatorCompany();
    this.getProducts();
    this.getIntegratorPackageList();
  }
  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
       
        console.log(JSON.stringify(this.frm.value));
          this.gSvc.postdata("Common/IntegratorPackage/Save", JSON.stringify(this.frm.value)).subscribe(res => {
            this.frm.reset();
            this.getSuppliers();
            this.toastrService.success(res.message);
          }, err => {
            this.toastrService.error(err.message);
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
  getPackages(id:any){
    this.gSvc.getdata("Common/IntegratorPackage/GetIntegratorPackageByCmnIntegratorId?companyId="+this.auth.getCompany()+"&cmnIntegratorId="+this.frm.controls['cmnIntegratorId'].value).subscribe(res => {
      
      this.integratorPackages = res;
     
      
    }, err => {
      //this.toastrService.error("Error! Package not found");
    })
  }
  setName(){
    var packageNo= this.frm.controls['packageNo'].value;
    var name =this.integratorPackages.find((item: { packageNo: number; })=> item.packageNo==packageNo).name;
    this.frm.controls['name'].setValue(name);
  }
  getIntregatorCompany() {
    this.gSvc.postdata("Common/Integrator/GetPermittedIntegratorByCompanyId?cmnCompanyId="+this.auth.getCompany(), {}).subscribe(res => {      
      this.integrators = res;
    }, err => {
      this.toastrService.error("Error! Intregation Company List not found");
    })
  }
  getProducts() {
    this.gSvc.postdata("api/ScpProduct/GetAll", {}).subscribe(res => {
      this.products = res;
    }, err => {
      this.toastrService.error("Error! Product Not Found");
    })
  }
  getIntegratorPackageList() {
    this.gSvc.getdata("Common/IntegratorPackage/GetIntegratorPackageByAnyKey?integratorId="+"&scpProductId=" ).subscribe(res => {
      
      this.integratorPackageList = res;
    }, err => {
      
    })
  }
  edit(res: any) {
    this.frm.patchValue(res);    
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
