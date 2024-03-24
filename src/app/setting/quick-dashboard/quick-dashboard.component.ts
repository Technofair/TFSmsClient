import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { read, utils } from "xlsx";
import { ExportService } from 'src/app/layout/service/export.service';
import { Utility } from 'src/app/services/utility.service';

@Component({
  selector: 'app-company',
  templateUrl: './quick-dashboard.component.html',
  styleUrls: ['./quick-dashboard.component.css'],
  providers: [ConfirmationService]
})
export class QuickDashboardComponent implements OnInit {

  companyList: any;
  companyTypeList: any;
  
  apiurl: any;
  displayModal: boolean = false;
  attachmentModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  id: any;
  genderList: any;
  clientViews: any[] = [];
  frm!: FormGroup;
  hideButton: boolean = true;
  attachmentTypes: any[] = [];
  attachmentList: any[] = [];
  removeData: any = "";
  grandTakenMonthTotal: any;
  oldUserName:any;
  oldUserPassword:any;
  isMobile: boolean = false;
  parentEmail:any;
  progressStatus:boolean=true;
  constructor(
    private fb: FormBuilder
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService
    , private toastrService: ToastrService
    , private route: ActivatedRoute
    , private auth: AuthService
    , private exportService: ExportService
    , public util: Utility,
  ) {
    if (window.screen.width < 541) { // 768px portrait
      this.isMobile = true;
  } else {
      this.isMobile = false;
  }
  }

  ngOnInit(): void {
    this.genderList = [{ 'id': 1, "name": 'Male' }, { 'id': 2, "name": 'Female' }, { 'id': 3, "name": 'Others' }]
    //this.attachmentList = [{ 'id': 0, "name": 'SELECT' }, { 'id': 1, "name": 'NID' }, { 'id': 2, "name": 'TRADE LICENSE' }, { 'id': 3, "name": 'TIN' }, { 'id': 4, "name": 'VAT/BIN' }, { 'id': 5, "name": 'ORGANIZATION MEMBERSHIP' }]
    this.getCompany();
    this.frm= this.fb.group({
      username: new FormControl(),
      userPassword: new FormControl(),
      parentLoginID: new FormControl(),
      parentPassword: new FormControl()
    })
  }

  getCompany() {
    this.progressStatus=false;
    var c= this.auth.getCompany();
    this.gSvc.postdata("Common/Company/GetClientForQuickLoginByCompanyId/"+c, {}).subscribe(res => {
      this.companyList = res;
      this.progressStatus=true;
    }, err => {
      this.progressStatus=true;
      this.toastrService.error("Error! Company not found ");
    })
  }

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/home/setting/company')
  }
  clear(table: Table) {
    table.clear();
  }
  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.controls['isActive'].setValue(true);
    this.frm.markAsPristine();
  }
  showClient(ref:any){
    debugger;
  // var url='home/dashboard/msodashboard/'+ref;
   // this.router.navigate(['home/dashboard/msodashboard'], { queryParams: { amount: this.grandTakenMonthTotal.toFixed(ref) }, queryParamsHandling: 'merge', skipLocationChange: false });
   // this.router.navigate([url]);
 //this.router.navigate(['/admin']);
   // this.toastrService.success("successfull");
   
   this.frm.patchValue({
    username: ref.loginID,
    userPassword: ref.password,
    parentLoginID: ref.parentLoginID,
    parentPassword: ref.parentPassword,
  });
   
   if (this.frm.valid) {
    this.parentEmail=ref.parentEmail
   this.oldUserName= ref.parentLoginID;
   this.oldUserPassword=ref.parentPassword;
    this.auth.login(this.frm.value).subscribe(
      (result:any) => {        
        console.log(result);
        if(result !=undefined && result.userId>0)
        {
        this.auth.setParentEmail(this.parentEmail);
        this.auth.setOldUserName(this.oldUserName);
        this.auth.setOldPassword(this.oldUserPassword);
        this.auth.setToken(result.token);
        this.auth.setRole(result.roleId);
        this.auth.setCompany(result.companyId);
        this.auth.setCompanyTypeShortName(result.companyTypeShortName);
        this.auth.setUserId(result.userId);
        this.auth.setPhotoUrl(result.photoUrl);
        this.auth.setUserName(result.userName);
        this.auth.setDistrict(result.districtId);
        this.auth.setUpazila(result.upazilaId);
        this.auth.setUnion(result.unionId);
        this.auth.setView(this.isMobile);
        //New: 12.02.2024 Added BY Shariful
        this.auth.setAppSetting(result.cmnAppSetting);
        //End
        this.auth.setlanguage('bn');

        this.openLinkInNewTab('/home/dashboard/msodashboard');
        }else{
          this.toastrService.warning("Incorrect User ID or Password");
        }
      },
      (err: Error) => {
        this.toastrService.error("Error! internal problem");
      }
    );
  }
  }
  openLinkInNewTab(link:string){
   //window.open(link, '_blank'); // Opens the link in a new tab/window
    location.reload(); // Refreshes the current page
    this.router.navigate(['/home/dashboard/msodashboard']);
  }
}
