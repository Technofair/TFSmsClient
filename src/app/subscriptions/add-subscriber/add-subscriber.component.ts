import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Table, TableHeaderCheckbox } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { read, utils } from "xlsx";
import { ExportService } from '../../layout/service/export.service';

@Component({
  selector: 'app-add-subscriber',
  templateUrl: './add-subscriber.component.html',
  styleUrls: ['./add-subscriber.component.css'],
  providers: [ConfirmationService]
})
export class AddSubscriberComponent implements OnInit {

  displayModal: boolean = false;
  displayPackageModal: boolean = false;
  displaySTBModal: boolean = false
  subsType: any;
  prefix: any;
  subscriberList: any;
  numberOfMonth: any;
  countryList: any;
  divisionList: any;
  districtList: any;
  unionList: any;
  thanaList: any;
  organizations: any;
  apiurl: any;
  formId = 0;
  id: any;
  genderList: any;
  devicesCards: any;
  importList: any[] = [];
  hideButton: boolean = true;
  frm!: FormGroup;
  frmsrc!:FormGroup;
  viewInfo: any;
  isShow: boolean = true;
  topPosToStartShowing = 100;
  selectedRow: any;
  reportData: any[] = [];
  msoInfo: any;
  progressStatus:boolean=true;
  bulkStatus:boolean=true;
  _auth: any;

  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService, private route: ActivatedRoute, private auth: AuthService) {
    this.displayModal = false;
    this._auth=auth;
    this.syncAddressAsMSO();
  }
 
  ngOnInit(): void {
    this.genderList = [{ 'id': 1, "name": 'Male' }, { 'id': 2, "name": "Female" }, { 'id': 3, "name": "Others" }]
    this.subsType = [{ 'id': "1", 'name': 'General-জেনারেল' }, { 'id': "2", 'name': 'Corporate-কর্পোরেট' }];
    this.frmsearch();
    this.frm = new FormGroup({
      id: new FormControl(0),
      cmnCompanyId: new FormControl(),
      code: new FormControl("0"),
      firstName: new FormControl("", Validators.required),
      lastName: new FormControl(""),
      gender: new FormControl(1),
      contactNumber: new FormControl("", Validators.required),
      customerNumber: new FormControl("",[Validators.maxLength(8)]),
      email: new FormControl(""),
      nidNo: new FormControl(""),
      kYC: new FormControl(""),
      cmnCountryId: new FormControl(1,Validators.required),
      cmnDivisionId: new FormControl(Validators.required),
      cmnDistrictId: new FormControl(Validators.required),
      cmnUpazillaId: new FormControl(Validators.required),
      cmnUnionId: new FormControl(),
      address: new FormControl(""),
      postCode: new FormControl(""),
      subscriberType: new FormControl(),
      isActive: new FormControl(true, Validators.required),
      createdBy: new FormControl(),
      //createdBy: new FormControl(this.auth.getUserId),
      createdDate: new FormControl(),
      modifiedBy: new FormControl(),
    });

    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.id = params.id;
        this.edit(this.id);
      }
    });

    this.getCountry();
    this.getDivision();
      //-13/02/2024
   // this.getSubscriberList();
       this.search();
   
  }

  
   getBulkStatus(){
    if(this.bulkStatus){
      this.bulkStatus=false;
    }else{
      this.bulkStatus=true;
    }
    
   }
   frmsearch() {
    
    // var dstrct: any = this.auth.getDistrict();
    // var upzla: any = this.auth.getUpazila();
    // var unon: any = this.auth.getUnion();

    this.frmsrc = this.fb.group({
      companyId: new FormControl(),
      clientId: new FormControl(),
      customerNumber: new FormControl(''),
      contactNumber: new FormControl(''),
      deviceNumber: new FormControl(''),
      name: new FormControl('') //,
      // cmnDistrictId: new FormControl(parseInt(dstrct)),
      // cmnUpazillaId: new FormControl(parseInt(upzla)),
      // cmnUnionId: new FormControl(parseInt(unon))
    })
  }
  syncAddressAsMSO(){
    this.gSvc.getdata("Common/Company/GetMainServiceOperator").subscribe(res => {
      this.msoInfo = res;     
      this.frm.controls['cmnCountryId'].setValue(this.msoInfo.cmnCountryId);
      this.frm.controls['cmnDivisionId'].setValue(this.msoInfo.cmnDivisionId);
      this.getDistrictByDivisionId();
      this.frm.controls['cmnDistrictId'].setValue(this.msoInfo.cmnDistrictId);
      this.getUpazillaByDistrictId();
    }, err => {
    })
  }

  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.frm.controls['id'].value == 0) {
          this.frm.controls['cmnCompanyId'].setValue(this.auth.getCompany());
          this.frm.controls['createdBy'].setValue(this.auth.getUserId());
          this.frm.controls['createdDate'].setValue(new Date());
        } else if (this.frm.controls['id'].value > 0) {
          this.frm.controls['modifiedBy'].setValue(this.auth.getUserId());
        }
        this.gSvc.postdata("api/Subscriber/Save", JSON.stringify(this.frm.value)).subscribe(res => {
          //New
          if(res.success){
            
            this.reset();
            this.syncAddressAsMSO();
              //-13/02/2024
           // this.getSubscriberList();
           this.search();
            this.toastrService.success(res.message);
            
            // if(res.operationId == 1) //1=Add
            // {
            // this.reset();
            // this.syncAddressAsMSO();
            // this.getSubscriberList();
            // this.toastrService.success(res.message);
            // }
            // if(res.operationId == 2) //2=Update
            // {
            // this.getSubscriberList();
            // this.toastrService.success(res.message);
            // }


          }

          if(!res.success){
            this.toastrService.warning(res.message);
          }

          //Old
          // if (res != undefined && res.OperationId == -1) {
          //   this.toastrService.warning("Error! Already exist,please try uisng another contact number.");
          // }
          // else if (res != undefined && res.OperationId == -2) {
          //   this.toastrService.warning("Error! MSO not able to create subscriber.");
          // }
          // else if (res != undefined && res.success == true) {
          //   this.reset();
          //   this.getSubscriberList();
          //   this.toastrService.success("Data saved successfully");
          // }
          // else {
          //   this.toastrService.error(res.message);
          //   console.log('Exception: (save)' +  res.message);
          //   //this.toastrService.error("Error! Data not save.");
          // }
        }, err => {
          this.toastrService.error(err.message);
          console.log('Exception: (save)' +  err.message);
          //this.toastrService.error("Error! Data not save.");
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  toUrl: string = '/home/subscription/'
  goToUrl(url: string, id: string) {
    
    var eurl = this.toUrl + url;
    this.router.navigate([eurl], { queryParams: { id: id, urlNam: eurl}, queryParamsHandling: 'merge', skipLocationChange: false });
  }

  getCountry() {
    this.gSvc.postdata("Common/Country/Countries", {}).subscribe(res => {
      this.countryList = res;
    }, err => {
      this.toastrService.error(err.message);
          console.log('Exception: (getCountry)' +  err.message);
    })
  }

  getDivision() {
    this.gSvc.postdata("api/Division/Divisions", {}).subscribe(res => {
      this.divisionList = res;
    }, err => {
      this.toastrService.error(err.message);
          console.log('Exception: (getDivision)' +  err.message);
    })
  }

  getDistrictByDivisionId() {
    this.apiurl = "api/GeneralServices/District/" + this.frm.controls['cmnDivisionId'].value;
    this.gSvc.getdata(this.apiurl).subscribe(res => {
      this.districtList = res;
      if (this.frm.controls['id'].value > 0) {
        this.frm.controls['cmnDistrictId'].setValue(this.frm.controls['cmnDistrictId'].value);
        this.getUpazillaByDistrictId();
      }
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getDistrictByDivisionId)' +  err.message);
    })
  }

  getUpazillaByDistrictId() {
    this.apiurl = "api/GeneralServices/Upazila/" + this.frm.controls['cmnDistrictId'].value;
    this.gSvc.getdata(this.apiurl).subscribe(res => {
      this.thanaList = res;
      if (this.frm.controls['id'].value > 0) {
        this.frm.controls['cmnUpazillaId'].setValue(this.frm.controls['cmnUpazillaId'].value);
        this.getUnionByUpazillaId();
      }
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getUpazillaByDistrictId)' +  err.message);
    })
  }

  getUnionByUpazillaId() {
    this.apiurl = "api/GeneralServices/Union/" + this.frm.controls['cmnUpazillaId'].value;
    this.gSvc.getdata(this.apiurl).subscribe(res => {
      this.unionList = res;
      if (this.frm.controls['id'].value > 0) {
        this.frm.controls['cmnUpazillaId'].setValue(this.frm.controls['cmnUpazillaId'].value);
      }
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getUnionByUpazillaId)' +  err.message);
    })
  }

  edit(res: any) {
    this.formId = 1;
    // this.getSubscriberList();
    this.frm.patchValue(res);
    this.selectedRow = res;
    this.getDistrictByDivisionId();
  }

  reload() {
    this.formId = 0;
  }

  clear(table: Table) {
    table.clear();
  }

  reset() {
    this.formId = 0;
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.controls['isActive'].setValue(true);
    this.frm.markAsPristine();
  }

  // getSubscriberList() {
  //   this.progressStatus=false;
  //   this.gSvc.postdata("api/Subscriber/GetByCompanyId/" + this.auth.getCompany(), {}).subscribe(res => {
  //     this.subscriberList = res;
  //     this.progressStatus=true;
  //   }, err => {
  //     this.progressStatus=true;
  //     this.toastrService.error(err.message);
  //     console.log('Exception: (getSubscriberList)' +  err.message);
  //   })
  // }
  search() {
    var requestBody = this.frmsrc.value;
    requestBody.companyId = this.auth.getCompany();
    this.progressStatus=false;
    this.gSvc.postdata("api/Subscriber/GetSubscriberWithDeviceByParameter", JSON.stringify(requestBody)).subscribe(res => {
      this.subscriberList = res;
      this.progressStatus=true;

    }, err => {
      this.progressStatus=true;
      this.toastrService.error(err.message);
            console.log('Exception: (search)' +  err.message);
      //this.toastrService.error("Error ! Data is not found . ");
    })
  }
  showModalDialog(res: any) {
    this.displayModal = true;
    this.viewInfo = res;
  }
  showPackageAssignModal(res: any) {
    this.displayPackageModal = true;
    this.reset();
    this.viewInfo = res;
  }

  showSTBAssignModal(id: any) {
    this.displaySTBModal = true;
    console.log(this.viewInfo);
    this.gSvc.postdata("Subscription/Subscriber/Subscriber/" + id + "", {}).subscribe((res: any) => {
      this.viewInfo = res;
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getSubscriberList)' +  err.message);
      //this.toastrService.error("Error! Data Not Found");
    })
  }
  assignPackage(id: any) {
    //console.log(id);
    this.router.navigate(['home/subscription/packageassign/' + id]);

  }

  bulkImport($event: any) {
    this.importList = [];
    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;

        if (sheets.length) {
          const sheetRows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          if (sheetRows != undefined && sheetRows.length) {


            for (var i = 0; i < sheetRows.length; i++) {
              var obj: any = { CompanyName: '', Type: '', CustomerNumber: '', FirstName: '', LastName: '', Address: '', GenderType: '', ContactNumber: '', Email: '', NIDNo: '', Country: '', Division: '', District: '', Upazilla: '', Union: '', PostCode: '', createdBy: 0 };
              obj = sheetRows[i];

              obj.createdBy = this.auth.getUserId();

              this.importList.push(obj);
              this.hideButton = false;
            }


          }
        }
      }
      reader.readAsArrayBuffer(file);
    }
  }

  bulkUpload() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.gSvc.postdata("api/Subscriber/BulkSave", JSON.stringify(this.importList)).subscribe(res => {
          //console.log(this.frm.value);
          if (res != undefined) {
            
            this.importList = [];
            this.hideButton = false;
            this.search();
            this.toastrService.success(res.message);

          } else {

            this.toastrService.error(res.message);
            console.log(res.message);
            
          }
        }, err => {
          this.toastrService.error(err.message);
          console.log(err.message);
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }

}
