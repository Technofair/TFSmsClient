import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ClientPackageDetail } from 'src/app/model/client-package-detail';
import { ScpPackage } from 'src/app/model/scpPackage';
import { Company } from 'src/app/model/company';
import { formatDate } from '@angular/common';
import { Utility } from 'src/app/services/utility.service';

@Component({
  selector: 'app-client-package-permission',
  templateUrl: './package-period-permission.component.html',
  styleUrls: ['./package-period-permission.component.css'],
  providers: [ConfirmationService]
})
export class PackagePeriodPermissionComponent implements OnInit {
  
  frm: FormGroup;
  frmsrc!:FormGroup;
  companies:any;
  cols:any=[];
  products:any;
//   products:any=[
//     {
//         companyId:2,
//         companyName:'Mso',
//         day:0,
//         month:0,
//         year:0,
//     }
//   ]
  constructor(
    private fb: FormBuilder
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService
    , private auth: AuthService
    , private toastrService: ToastrService
    , private route: ActivatedRoute
    , private _util: Utility) {

    this.frm = new FormGroup({
      
      cmnCompanyId: new FormControl(),
      companyName: new FormControl(),
      day: new FormControl(),
      month: new FormControl(),
      year: new FormControl(),
    });
    
  }

  ngOnInit(): void {
    this.getCompanyPackagePeriod();
    //this.productService.getProductsSmall().then(data => this.products = data);

    // this.cols = [
    //     { field: 'code', header: 'Code' },
    //     { field: 'name', header: 'Name' },
    //     { field: 'category', header: 'Category' },
    //     { field: 'quantity', header: 'Quantity' }
    // ];
   
  }
  save() {
    debugger
    console.log(JSON.stringify(this.products));
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.gSvc.postdata("api/ScpPackagePeriodPermission/SaveScpPkgPeriodPermission", JSON.stringify(this.products)).subscribe(res => {
          
          if(res!='undefined'){
            if(res.success){
              this.toastrService.success(res.message);
              this.getCompanyPackagePeriod();
            }
            else{
              this.toastrService.warning(res.message);
            }
        }

        }, err => {
          this.toastrService.error("Error! Data Not Saved.");
        })
        return true;
      },
      reject: () => {
      }
    })
    return true;
  }

 
  getCompanyPackagePeriod() {
    this.gSvc.postdata("api/ScpPackagePeriodPermission/GetCompanyPackagePeriod", {}).subscribe((res: any) => {
      this.products = res;
      this.cols = Object.keys( this.products[0]);
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getCompany)' + err.message);
    })
  }

  reload() {
    this.router.navigateByUrl('/home/setting/clientpackage')
  }

  clear(table: Table) {
    table.clear();
  }

  reset() {

    this.frm.controls['scpPackageId'].setValue(null);
    this.frm.reset();
    // this.frm.controls['id'].setValue(0);
    // this.frm.controls['date'].setValue(new Date());
    // this.frm.controls['isActive'].setValue(true);
    // this.selectedPackages = [];
    this.frm.markAsPristine();
    this.getCompanyPackagePeriod();
  }

  
   
}