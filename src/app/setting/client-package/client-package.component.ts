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
  templateUrl: './client-package.component.html',
  styleUrls: ['./client-package.component.css'],
  providers: [ConfirmationService]
})
export class ClientPackageComponent implements OnInit {
  packages: ScpPackage[] = [];
  selectedPackages: ScpPackage[] = [];
  companies: Company[] = [];
  clientPackageDetails: ClientPackageDetail[] = [];
  frm: FormGroup;

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
      id: new FormControl(0, [Validators.required]),
      cmnCompanyId: new FormControl(),
      scpPackageId: new FormControl([Validators.required]),
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

        // if (this.frm.controls['id'].value == 0) {
        //   this.frm.controls['createdBy'].setValue(this.auth.getUserId());
        //   this.frm.controls['createdDate'].setValue(new Date());
        // } else if (this.frm.controls['id'].value > 0) {
        //   this.frm.controls['modifiedBy'].setValue(this.auth.getUserId());
        // }


        var frmVal = {
          id: 0,
          cmnCompanyId: this.auth.getCompany(),
          date: null,
          isActive: true,
          createdBy: this.auth.getUserId(),
          createdDate:null,
          modifiedBy: this.auth.getUserId(),
          modifiedDate: null
        };

        var details: any[] = [];
        this.companies.forEach(item => {
          details.push({
            id: 0,
            cmnCompanyId: item.id,
            name: item.name,
            effectDate: item.effectDate == undefined ? null : item.effectDate,
            scpClientPackageId: item.scpClientPackageId,
            scpPackageId: item.scpPackageId,
            rate: item.rate,
            commissionAmount: item.commissionAmount,
            isActive: item.isActive
          });
        });

        let reqestbody = {
          obj: frmVal,
          list: details,
        }

        debugger;
        // console.log(JSON.stringify(frmVal));
        // console.log(JSON.stringify(details));
        console.log(JSON.stringify(reqestbody));


        this.gSvc.postdata("Subscription/ClientPackage/Save", JSON.stringify(reqestbody)).subscribe(res => {
          
          //New
          if (res != undefined && res.success) {
            this.reset();
            this.toastrService.success(res.message);
          } else {
            this.toastrService.warning(res.message);
          }

          //Old
          // if (res != undefined && res.success) {
          //   this.reset();
          //   this.toastrService.success("Successful");
          // } else {
          //   this.toastrService.error("Unsuccessful");
          // }

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

  holdCompanies: any[] = [];
  getCompany() {
    this.holdCompanies = [];
    this.companies = [];
    this.gSvc.postdata("Common/Company/GetClientByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
      this.companies = res;
      this.companies.forEach(item => {
        item.scpClientPackageId = 0;
        item.scpPackageId = 0;
        item.commissionAmount = 0;
        item.rate = 0;
        item.isActive = false;
      });

      // this.companies.forEach(item => {
      //   this.holdCompanies.push({
      //     address: item.address,
      //     alternatePhone: item.alternatePhone,
      //     cmnCompanyId: item.cmnCompanyId,
      //     cmnCompanyTypeId: item.cmnCompanyTypeId,
      //     cmnCountryId: item.cmnCountryId,
      //     cmnDistrictId: item.cmnDistrictId,
      //     cmnDivisionId: item.cmnDivisionId,
      //     cmnUnionId: item.cmnUnionId,
      //     cmnUpazillaId: item.cmnUpazillaId,
      //     code: item.code,
      //     // companyType:item.companyType,
      //     contactNo: item.contactNo,
      //     contactPerson: item.contactPerson,
      //     // country:item.country,
      //     createdBy: item.createdBy,
      //     createdDate: item.createdDate,
      //     // district:item.district,
      //     // division:item.division,
      //     email: item.email,
      //     fax: item.fax,
      //     id: item.id,
      //     //isActive:item.isActive,
      //     // loginID:item.loginID,
      //     logo: item.logo,
      //     modifiedBy: item.modifiedBy,
      //     modifiedDate: item.modifiedDate,
      //     name: item.name,
      //     // parentLoginID:item.parentLoginID
      //     // parentName:item.parentName,          
      //     // parentPassword:item.parentPassword,
      //     // password:item.password,
      //     prefix: item.prefix,
      //     shortName: item.shortName,
      //     scpClientPackageId: 0,
      //     scpPackageId: 0,
      //     commissionAmount: 0,
      //     rate: 0,
      //     isActive: false
      //     // slsCustomerId:item.slsCustomerId,
      //     // type:item.type,          
      //     // union:item.union,
      //     // upazilla:item.upazilla
      //   });
      // });
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getCompany)' + err.message);
    })
  }

  isCheckedAll: boolean = false;
  checkedAll(ev: any) {
    debugger;
    if (this.frm.controls['scpPackageId'].value > 0) {
      var evn: any = ev.currentTarget;
      this.isCheckedAll = evn.checked;
      this.companies.forEach((item) => {
        if (item.isActive) {
          item.isActive = evn.checked;
          if (this.frm.controls['scpPackageId'].value > 0) {
            var pkgId = this.frm.controls['scpPackageId'].value;
            var pkgModel = this.packages.filter(x => x.id == pkgId)[0];
            var evn: any = ev.currentTarget;
            item.isActive = evn.checked;
            item.scpClientPackageId = 0;
            item.scpPackageId = pkgId;
            item.effectDate;
            item.commissionAmount = 0;
            item.rate = pkgModel.price;
          }
        }
      });
    } else {
      ev.currentTarget.checked = false;
      this.isCheckedAll = false;
      this.toastrService.warning("Please Select a package first!!!");
    }
  }

  checkedItem(ev: any, model: any) {
    debugger;
    if (this.frm.controls['scpPackageId'].value > 0) {
      var evn: any = ev.currentTarget;
      model.isActive = evn.checked;
      if (model.isActive) {
        var pkgId = this.frm.controls['scpPackageId'].value;
        var pkgModel = this.packages.filter(x => x.id == pkgId)[0];
        model.scpClientPackageId = model.scpClientPackageId == 0 ? 0 : model.scpClientPackageId;
        model.scpPackageId = model.scpClientPackageId == 0 ? pkgId : model.scpPackageId;
        model.effectDate = model.scpClientPackageId == 0 ? null : model.effectDate;
        model.commissionAmount = model.scpClientPackageId == 0 ? 0 : model.commissionAmount;
        model.rate = model.scpClientPackageId == 0 ? pkgModel.price : model.rate;
      }
      else {
        model.scpPackageId = model.scpClientPackageId == 0 ? 0 : model.scpPackageId;
        model.rate = model.scpClientPackageId == 0 ? 0 : model.rate;
        model.effectDate = model.scpClientPackageId == 0 ? undefined : model.effectDate;
        model.commissionAmount = model.scpClientPackageId == 0 ? 0 : model.commissionAmount;
      }

      var clist = this.companies.filter(x => !x.isActive);
      if (clist.length == 0) {
        this.isCheckedAll = true;
      } else {
        this.isCheckedAll = false;
      }
    } else {
      ev.currentTarget.checked = false;
      this.toastrService.warning("Please Select a package first!!!");
    }
  }

  // getPackagelByClientId() {
  //   this.gSvc.postdata("Subscription/ClientPackage/GetPackageDetailByClientId?companyId=" + this.frm.get("cmnCompanyId")?.value, {}).subscribe(res => {
  //     debugger;
  //     if (res != undefined && res.id > 0) {
  //       this.frm.patchValue(res);
  //       if (res.effectDate != undefined) {
  //         var date = formatDate(res.effectDate, 'dd/MM/yyyy', 'en-US');
  //         this.frm.controls['effectDate'].setValue(date);
  //       }
  //     } else {
  //       var comId = this.frm.get("cmnCompanyId")?.value
  //       this.reset()
  //       this.frm.controls['cmnCompanyId'].setValue(comId);
  //     }
  //   }, err => {
  //     this.toastrService.error("Package mot found");
  //   })

  //   this.getPackageDetailByClientId();
  // }

  getPackageDetailByClientId() {
    if (!this.frm.get("cmnCompanyId")?.value) {
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

  getClientDetailByPackageId() {
    if (!this.frm.get("scpPackageId")?.value) {
      this.selectedPackages = [];
      this.toastrService.error("Please select a company");
      return;
    }

    this.companies.forEach(item => {
      item.scpClientPackageId = 0;
        item.scpPackageId = 0;
        item.effectDate = undefined;
        item.commissionAmount = 0;
        item.rate = 0;
        item.isActive = false;
    });

    this.gSvc.postdata("Subscription/ClientPackage/GetPackageDetailByPackageId?packageId=" + this.frm.get("scpPackageId")?.value, {}).subscribe(res => {
          debugger;
      var packClientList: any[] = res;
      this.companies.forEach(item => {
        var fldata = packClientList.filter(x => x.cmnCompanyId == item.id)[0];
        if (fldata != undefined) {
          item.scpClientPackageId = fldata.scpClientPackageId;
          item.scpPackageId = fldata.scpPackageId;
          item.effectDate = fldata.effectDate; //Asad Commented--> this._util.DateConvert(fldata.effectDate);
          item.commissionAmount = fldata.commissionAmount;
          item.rate = fldata.rate;
          item.isActive = fldata.isActive;
        }
      });

      var clist = this.companies.filter(x => !x.isActive);
      if (clist.length == 0) {
        this.isCheckedAll = true;
      } else {
        this.isCheckedAll = false;
      }
    }, err => {
      this.toastrService.error("Package mot found");
    })
  }


  getPackage() {
    this.gSvc.postdata("Subscription/Package/GetAll", {}).subscribe(res => {
      debugger;
      this.packages = res;
      this.packages.forEach(item => {
        item.display = item.name + ' (' + item.price + ')'
      });
    }, err => {
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

    this.frm.controls['scpPackageId'].setValue(null);
    this.frm.reset();
    // this.frm.controls['id'].setValue(0);
    // this.frm.controls['date'].setValue(new Date());
    // this.frm.controls['isActive'].setValue(true);
    // this.selectedPackages = [];
    this.frm.markAsPristine();
    this.getCompany();
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
        commissionAmount: packageInfo.commissionAmount,
        isActive: true,
      };
    }
    return packageDetail;
  }
}