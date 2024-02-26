import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-package',
  templateUrl: './company-package.component.html',
  styleUrls: ['./company-package.component.css'],
  providers: [ConfirmationService]
})
export class CompanyPackageComponent {

  companyList: any;
  companyTypeList: any;
  orgType: any;
  divisionList: any;
  districtList: any;
  upazilla: any;
  thanaList: any;
  unionList: any;
  countryList: any;
  attachmentList: any;
  apiurl: any;
  displayModal: boolean = false;
  attachmentModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  id: any;
  genderList: any;
  rows: any[] = [];
  orderdetails: any[] = [];

  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService, private route: ActivatedRoute) {
    // this.getCompany();
    // this.getCompanyType();
    // this.getCountry();
    // this.getDivision();
  }

  frm: FormGroup = new FormGroup({
    // Id: new FormControl(""),
    // Code: new FormControl(""),
    // Name: new FormControl(""),
    // ShortName: new FormControl(""),
    // Address: new FormControl(""),
    // ContactPerson: new FormControl(""),
    // ContactNo: new FormControl(""),
    // AlternatePhone: new FormControl(""),
    // Email: new FormControl(""),
    // Zip: new FormControl(""),
    // CmnCompanyId: new FormControl(""),
    // CmnCompanyTypeId: new FormControl(""),
    // CmnUpazillaId: new FormControl(""),
    // CmnUnionId: new FormControl(""),
    // BIN: new FormControl(""),
    // TIN: new FormControl(""),
    // Fax: new FormControl(""),
    // Web: new FormControl(""),
    // Logo: new FormControl(""),
    // IsActive: new FormControl(""),
    // CreatedBy: new FormControl(""),
    // CreatedDate: new FormControl(""),
    // ModifiedBy: new FormControl(""),
    // ModifiedDate: new FormControl(""),
    // divisionId: new FormControl(""),
    // districtId: new FormControl(""),
    // upazillaId: new FormControl(""),
  })

  ngOnInit(): void {

    this.frm = this.fb.group({
      Id: ["0", [Validators.required]],
      Code: ["0", [Validators.required]],
      Name: ["", [Validators.required]],
      ShortName: [""],
      Address: ["", [Validators.required]],
      ContactPerson: ["", [Validators.required]],
      ContactNo: ["", [Validators.required]],
      AlternatePhone: [""],
      Email: ["", [Validators.required]],
      City: [""],
      State: [""],
      Zip: [""],
      CmnCompanyId: [""],
      CmnCompanyTypeId: ["", [Validators.required]],
      CmnUpazillaId: [""],
      CmnUnionId: [""],
      BIN: [""],
      TIN: [""],
      Fax: [""],
      Web: [""],
      Logo: [""],
      IsActive: [true, [Validators.required]],
      CreatedBy: ["1", [Validators.required]],
      ModifiedBy: ["1"],
      divisionId: [""],
      districtId: [""],
      upazillaId: [""],
    });
    // this.getCompany();
    // this.getCompanyType();
    // this.getCountry();
    // this.getDivision();
  }

  save() {

    // if (this.frm.invalid) return false;
    // this.confirmationService.confirm({
    //   message: 'Are you sure that you want to proceed?',
    //   header: 'Confirmation',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     if (this.formId == 0) {
    //       // console.log(this.frm.value);
    //       // let appmneu={
    //       //   link:res.link,
    //       //   title:res.title,
    //       //   isParents:res.isParents,
    //       //   parentsId:res.parentsId.toString(),
    //       //   moduleId:res.moduleId,
    //       //   icon:res.icon,
    //       //   isActive:res.isActive=="Y"?true:false,
    //       //   id:res.id

    //       // };

    //       //this.frm.controls['name'].setValue(1);
    //       this.gSvc.postdata("Common/Company/Save", JSON.stringify(this.frm.value)).subscribe(res => {
    //         console.log(res);
    //         this.frm.reset();
    //         this.toastrService.success("Saved success");
    //       }, err => {
    //         this.toastrService.error("Error ! Data is not saved . ");
    //       })
    //     } else if (this.formId == 1) {
    //       this.gSvc.postdata("Common/Company/Save", JSON.stringify(this.frm.value)).subscribe(res => {
    //         this.frm.reset();
    //         this.toastrService.success("Updated success");
    //         this.formId == 1;
    //       }, err => {
    //         this.toastrService.error("Error ! Data is not updated . ");
    //       })
    //     } else {
    //       this.toastrService.error("Error ! Data is not saved or updated. ");
    //     }
    //     return true;
    //   },
    //   reject: () => {

    //   }

    // })
    // return false;
  }

  // getCompany() {
  //   this.gSvc.postdata("Common/Company/GetAll", {}).subscribe(res => {
  //     this.companyList = res;
  //   }, err => {
  //     this.toastrService.error("Error! Company List not found ");
  //   })
  // }

  edit(id: any) {
    // this.formId = 1;
    // this.getCompany();
    // this.gSvc.postdata("Common/Company/GetByCompanyId/" + id + "", {}).subscribe((res: any) => {
    //   this.frm.controls['id'].setValue(res.id);
    //   this.frm.controls['code'].setValue(res.code);
    //   this.frm.controls['name'].setValue(res.name);
    //   this.frm.controls['shortName'].setValue(res.shortName);
    //   this.frm.controls['address'].setValue(res.address);
    //   this.frm.controls['contactPerson'].setValue(res.contactPerson);
    //   this.frm.controls['contactNo'].setValue(res.contactNo);
    //   this.frm.controls['alternatePhone'].setValue(res.alternatePhone);
    //   this.frm.controls['email'].setValue(res.email);
    //   this.frm.controls['city'].setValue(res.city);
    //   this.frm.controls['state'].setValue(res.state);
    //   this.frm.controls['zip'].setValue(res.zip);
    //   this.frm.controls['cmnCompanyId'].setValue(res.cmnCompanyId);
    //   this.frm.controls['cmnCompanyTypeId'].setValue(res.cmnCompanyTypeId);
    //   this.frm.controls['cmnUpazillaId'].setValue(res.cmnUpazillaId);
    //   this.frm.controls['cmnUnionId'].setValue(res.cmnUnionId);
    //   this.frm.controls['bIN'].setValue(res.bIN);
    //   this.frm.controls['tIN'].setValue(res.tIN);
    //   this.frm.controls['fax'].setValue(res.fax);
    //   this.frm.controls['web'].setValue(res.web);
    //   this.frm.controls['logo'].setValue(res.logo);
    //   this.frm.controls['prefix'].setValue(res.prefix);
    //   // this.frm.patchValue(res);
    // }, err => {
    //   this.toastrService.error("error");
    // })
  }

  showModalDialog(id: any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("Common/Company/GetByCompanyId/" + id + "", {}).subscribe((res: any) => {
      this.viewInfo = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  attachModal() {
    this.attachmentModal = true;
  }

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/home/setting/casprovidersetting')
  }
  clear(table: Table) {
    table.clear();
  }
  reset() {
    this.frm.reset();
    this.frm.controls['Id'].setValue(0);
    this.frm.markAsPristine();
  }
}