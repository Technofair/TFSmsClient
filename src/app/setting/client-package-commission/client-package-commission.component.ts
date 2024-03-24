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
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-client-package-permission',
  templateUrl: './client-package-commission.component.html',
  styleUrls: ['./client-package-commission.component.css'],
  providers: [ConfirmationService]
})
export class ClientPackageCommissionComponent implements OnInit {
    packages: ScpPackage[] = [];
    selectedPackages: ScpPackage[] = [];
    companies: Company[] = [];
    clientPackageDetails: ClientPackageDetail[] = [];
    frm: FormGroup;
    progressStatus=true;
    constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private auth: AuthService, private toastrService: ToastrService, private route: ActivatedRoute) {
      this.frm = new FormGroup({
        id: new FormControl(0, [Validators.required]),
        cmnCompanyId: new FormControl([Validators.required]),
        date: new FormControl(new Date()),
        effectDate: new FormControl(),
        amount: new FormControl([Validators.required]),
        isActive: new FormControl(true, [Validators.required]),
        createdBy: new FormControl(),
        createdDate: new FormControl(),
        modifiedBy: new FormControl(),
        ModifiedDate: new FormControl()
      });
    }
    ngOnInit(): void {
      this.getCompany();
      this.getPackage();
    }
    save() {
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
          
          const details: ClientPackageDetail[] = this.selectedPackages.map(scpPackage => this.createPackageDetail(scpPackage));
          let reqestbody = {
            obj: this.frm.value,
            list: details,
          }
          
          this.gSvc.postdata("Subscription/ClientPackage/Save", JSON.stringify(reqestbody)).subscribe(res => {
            //console.log(this.frm.value);
            if(res !=undefined && res.success)
            {
            this.reset();
            this.toastrService.success("Successful");
            }else{
              this.toastrService.error("Unsuccessful");
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
  
    // getCompany() {
    //   this.gSvc.postdata("Common/Company/GetAll", {}).subscribe(res => {
    //     this.companies = res;
    //   }, err => {
    //     this.toastrService.error("Error! Company List not found ");
    //   })
    // }
    
    getCompany() {
      this.gSvc.postdata("Common/Company/GetClientByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
        this.companies = res;
      }, err => {
        this.toastrService.error(err.message);
        console.log('Exception: (getCompany)' + err.message);
      })
    }
  getPackagelByClientId() {
    this.gSvc.postdata("Subscription/ClientPackage/GetPackageDetailByClientId?companyId=" + this.frm.get("cmnCompanyId")?.value, {}).subscribe(res => {
    debugger;
      if (res != undefined && res.id > 0) {
        this.frm.patchValue(res);
        if(res.effectDate!=undefined){ 
          var date=formatDate(res.effectDate, 'dd/MM/yyyy', 'en-US');
         this.frm.controls['effectDate'].setValue(date);
        }
      } else {
        var comId = this.frm.get("cmnCompanyId")?.value
        this.reset()
        this.frm.controls['cmnCompanyId'].setValue(comId);
      }
    }, err => {
      this.toastrService.error("Package mot found");
    })

    this.getPackageDetailByClientId();
  }

    getPackageDetailByClientId() {
      if(!this.frm.get("cmnCompanyId")?.value) {
        this.selectedPackages = [];
        this.toastrService.error("Please select a company");
        return;
      }
      this.gSvc.postdata("Subscription/ClientPackage/GetPackageDetailByClientId?companyId=" + this.frm.get("cmnCompanyId")?.value, {}).subscribe(res => {
        this.clientPackageDetails = res;
        this.selectedPackages = this.packages.filter(packageInfo => this.clientPackageDetails.some(packageDetail => packageDetail.scpPackageId === packageInfo.id));
      }, err => {
        this.toastrService.error("Package mot found");
      })
    }

    getPackage() {
        this.progressStatus=false;
      this.gSvc.postdata("Subscription/Package/GetAll", {}).subscribe(res => {
        this.packages = res;
        this.progressStatus=true;
      }, err => {
        this.progressStatus=true;
        this.toastrService.error("Error! Package not found");
      })
      
    }
  
    reload() {
      this.router.navigateByUrl('/home/setting/clientpackage')
    }

    clear(table: Table) {
      table.clear();
    }
  
  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.controls['date'].setValue(new Date());
    this.frm.controls['isActive'].setValue(true);
    this.selectedPackages = [];
    this.frm.markAsPristine();
  }
  
    private createPackageDetail(packageInfo: ScpPackage): ClientPackageDetail {
      debugger
      let packageDetail = this.clientPackageDetails.find(p => p.scpPackageId === packageInfo.id);
      if (packageDetail) {
      } else {
        packageDetail = {
          id: 0,
          scpClientPackageId: 0,
          scpPackageId: packageInfo.id,
          rate: packageInfo.price,
          commissionAmount:packageInfo.commissionAmount,
          isActive: true,
        };
      }
      return packageDetail;
    }
  }