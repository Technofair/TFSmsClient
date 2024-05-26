import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],

  providers: [ConfirmationService]
})
export class UserComponent implements OnInit {
  companyTypeList: any;
  userList: any;
  formId = 0;
  id: any;
  companyList: any;
  employeeList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  frm!: FormGroup;
  userTypes: any;
  users: any;
  roles:any;
  progressStatus:boolean=true;
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService, private route: ActivatedRoute, private auth: AuthService) {

  }

  ngOnInit(): void {
    this.frm = new FormGroup({
      id: new FormControl(0),
      hrmEmployeeId: new FormControl(0,Validators.required),
      loginID: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
      isActive: new FormControl(true, Validators.required),
      cmnCompanyTypeId: new FormControl(null, [Validators.required]),
      cmnCompanyId: new FormControl( 0, Validators.required),
      secUserTypeId: new FormControl( 0, Validators.required),
      createdBy: new FormControl(0,),
      createdDate: new FormControl( ),
      modifiedBy: new FormControl()
    });
    this.getUsers();
    this.getCompanyType();
    this.getCompany();
    //this.getEmployee();
    this.getRoles();
  }
  save() {
    debugger
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.frm.controls['id'].value == 0) {
          //Old
          //this.frm.controls['cmnCompanyId'].setValue(this.auth.getCompany());
          this.frm.controls['createdBy'].setValue(this.auth.getUserId());
          this.frm.controls['createdDate'].setValue(new Date());
        } else if (this.frm.controls['id'].value > 0) {
          this.frm.controls['modifiedBy'].setValue(this.auth.getUserId());
        }

        this.gSvc.postdata("Security/User/Save", JSON.stringify(this.frm.value)).subscribe(res => {
          //console.log(this.frm.value);
          
          if(res.success){
            this.toastrService.success(res.message);
          }
          else{
            this.toastrService.warning(res.message);
          }

          this.frm.reset();
          this.getUsers();
          
        }, err => {
          this.toastrService.error("Error! Data not Saved.");
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }
  getRoles(){
    this.gSvc.postdata("Security/SecUserType/GetAllSecUserType", {}).subscribe(res => {
      this.roles = res;
    }, err => {
      this.toastrService.error("Error! Roles not found ");
    })
  }

  getCompanyType() {
    this.gSvc.postdata("Common/Company/GetAllCompanyType", {}).subscribe(res => {
    this.companyTypeList = res;
    }, err => {
      
      this.toastrService.error(err.message);
    })
  }

  getCompanyByCompanyTypeOne() {
    var cmnCompanyTypeId = this.frm.controls["cmnCompanyTypeId"].value;
    this.getCompanyByCompanyType(cmnCompanyTypeId);
  }

  // getCompanyByCompanyTypeTwo() {
  //   var cmnCompanyTypeId = this.frmsrc.controls["cmnCompanyTypeId"].value;
  //   this.getCompanyByCompanyType(cmnCompanyTypeId);
  // }

  getCompanyByCompanyType(cmnCompanyTypeId: any) {
    
    this.gSvc.postdata("Common/Company/GetCompanyByCompanyTypeId?companyTypeId="+ cmnCompanyTypeId, {}).subscribe(res => {
         this.companyList = res;
    }, err => {
      this.toastrService.error("Error! Company list not found ");
    })
  }

  getCompany() {
    this.gSvc.postdata("Common/Company/GetClientByCompanyIdForAdmin/"+this.auth.getCompany(), {}).subscribe(res => {
      this.companyList = res;
    }, err => {
      this.toastrService.error("Error! Company not found ");
    })
  }

  getEmployee() {
    //New
    var cmnCompanyId = this.frm.controls["cmnCompanyId"].value;
    
    this.gSvc.postdata("HRM/Employee/GetEmployeeByCompanyId?companyId=" + cmnCompanyId + "&userLevel=" + this.auth.getUserLevel() , {}).subscribe(res => {
    //Old: 26.05.2024
    //this.gSvc.postdata("HRM/Employee/GetHrmEmployeeByCompanyId/"+this.auth.getCompany(), {}).subscribe(res => {
      if(res !=undefined)
      {
        for (var i = 0; i < res.length; i++) {
          res[i].name +=' ('+res[i].employeeId+')';
        }
      }
      this.employeeList = res;
    }, err => {
      this.toastrService.error("Error! Employee not found ");
    })
  }

  getUsers() {
    this.progressStatus=false;
    //New
    this.gSvc.postdata("Security/User/GetUserByCompanyId?companyId="+this.auth.getCompany() + "&userLevel="+ this.auth.getUserLevel() , {}).subscribe(res => {
   //Old
      //this.gSvc.postdata("Security/User/GetUserInfoByCompanyId?companyId="+this.auth.getCompany(), {}).subscribe(res => {
      this.userList = res;
      this.progressStatus=true;
    }, err => {
      this.progressStatus=true;
      this.toastrService.error("Error! User  not found");
    })
  }

  edit(res: any) {
    this.formId = 1;
    this.frm.patchValue(res);
  }

  delete() {

  }

  showModalDialog(res: any) {
    this.displayModal = true;
    this.reset();
    this.viewInfo = res;
  }

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/home/security/addUser')
  }
  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.controls['isActive'].setValue(true);
    this.frm.markAsPristine();
  }
  clear(table: Table) {
    table.clear();
  }
}
