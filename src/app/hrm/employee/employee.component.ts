import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ExportService } from 'src/app/layout/service/export.service';
import { Utility } from 'src/app/services/utility.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  providers: [ConfirmationService]
})
export class EmployeeComponent implements OnInit {

  designationList: any;
  depertmentList: any;
  companyTypeList:any;
  companyList: any;
  employList: any;
  sectionList: any;
  employeeList: any;

  genderList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  frm!: FormGroup;
  id = 1;
  fileToUpload: any;
  frmsrc! :FormGroup;
  companyListPgStatus:boolean=true;
  employeeListPgStatus:boolean=true;
  //isAppointedByOtherCompany: boolean = true;
  appointedCompanyList: any;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private confirmationService: ConfirmationService, 
    private gSvc: GeneralService, 
    private toastrService: ToastrService, 
    private auth: AuthService, 
    private exportService: ExportService,
    public util: Utility
    ) {

  }

  ngOnInit(): void {

    
    this.initializeFrm();
    this.frmsearch();
    this.genderList = [{ 'id': true, "name": 'Male' }, { 'id': false, "name": 'Female' }]
    //this.getEmployee(this.frm.controls["cmnCompanyTypeId"].value,  this.auth.getCompany(), this.auth.getUserLevel());
    this.getCompanyType();
    //this.getCompany();
    this.getDesignation();
    //this.isAppointedByOtherCompany = true;
  }

  initializeFrm(){
    this.frm = this.fb.group({
      id: new FormControl(0),
      cmnCompanyTypeId: new FormControl(null, [Validators.required]),
      cmnCompanyId: new FormControl(null, Validators.required),
      //appointedCompanyId: new FormControl(null),
      employeeId: new FormControl("", Validators.required),
      name: new FormControl("", Validators.required),
      mobile: new FormControl(),
      officialEmail: new FormControl(),
      sex: new FormControl(true,Validators.required),
      joiningDate: new FormControl(),
      photoUrl: new FormControl(),
      signatureUrl: new FormControl(),
      isProxy: new FormControl(false),
      isActive: new FormControl(true),
      //isAppointedByOtherCompany: new FormControl(false),
      createdBy: new FormControl(),
      createdDate: new FormControl(),
      modifiedBy: new FormControl(),
      modifiedDate: new FormControl()
    });
  }

  // appointmentChange(){
  //   var isAppointed = this.frm.get('isAppointedByOtherCompany')?.value;
  //   if(isAppointed){
  //     this.isAppointedByOtherCompany = false;
  //     //GetTopNLevelCompany
  //     this.getTopNLevelCompany();
  //   }
  //   else{
  //     this.isAppointedByOtherCompany = true;
  //     //this.appointedCompanyList = [];
  //   }
  // }

  search() {
    
    var cmnCompanyTypeId = this.frmsrc.controls["cmnCompanyTypeId"].value;
    var cmnCompanyId = this.frmsrc.controls["cmnCompanyId"].value;

    cmnCompanyTypeId = cmnCompanyTypeId ==  0 ? null : cmnCompanyTypeId;
    cmnCompanyId = cmnCompanyId ==  0 ? null : cmnCompanyId;
    var userLevel = this.auth.getUserLevel();
    this.getEmployee(cmnCompanyTypeId, cmnCompanyId, userLevel);

  }
  frmsearch() {
    this.frmsrc = this.fb.group({
      cmnCompanyId: new FormControl(null),
      cmnCompanyTypeId: new FormControl(null),
    })
  }
  clickOnBtnFile() {
    debugger;
    this._fileInput.nativeElement.value = "";
    this._fileInput.nativeElement.click();
  }

  public fileSrc: any;
  public fileTypes: any = ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"];
  @ViewChild('fileInput') _fileInput!: ElementRef;
  onFileChange() {
    
    if (this._fileInput.nativeElement.files.length > 0) {
      let file = this._fileInput.nativeElement.files[0];
      var arryext = file.name.split(".");
      var ext = arryext[arryext.length - 1];
      var extlwr = ext.toLowerCase();
      var fileIndex = this.fileTypes.indexOf(extlwr);
      var fileSize = file.size / 1024 / 1024; // in MB
     
      if (fileSize > 5) {
        this.toastrService.error('File size exceeds 5 MB', 'File Upload Error!');
      } else if (fileIndex === -1) {
        this.toastrService.error('File type not supported. Valid file types are ' + this.fileTypes, 'File Type Error!');
      } else {
        this.fileSrc = this.util.openSanitizedReportByFile(file);
        this.fileToUpload = file;
      }
    }
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
          this.frm.controls['createdBy'].setValue(this.auth.getUserId());
          this.frm.controls['createdDate'].setValue(new Date());
        } else if (this.frm.controls['id'].value > 0) {
          this.frm.controls['modifiedBy'].setValue(this.auth.getUserId());
          this.frm.controls['modifiedDate'].setValue(new Date());
        }
                
        this.gSvc.postdata("HRM/Employee/Save", JSON.stringify(this.frm.value)).subscribe(res => {

          if(res!= 'undefined')
          {
            if(res.success){
              this.UploadPhoto(res.operationId);
              //this.frm.reset();
              this.getEmployee(this.frm.controls["cmnCompanyTypeId"].value, this.frm.controls["cmnCompanyId"].value, this.auth.getUserLevel());
              this.toastrService.success(res.message);
              this.initializeFrm();
              //this.isAppointedByOtherCompany = true;
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
    return false;
  }


  UploadPhoto(employeeId: string) {
    debugger;
    const formData: FormData = new FormData();
  
    formData.append('fileSource', this.fileToUpload);
    formData.append('employeeId', employeeId.toString());
    return this.gSvc.postdatafile('HRM/Employee/UploadPhoto', formData).subscribe(() => alert("Photo Uploaded Successfully"));
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

  getCompanyByCompanyTypeTwo() {
    var cmnCompanyTypeId = this.frmsrc.controls["cmnCompanyTypeId"].value;
    this.getCompanyByCompanyType(cmnCompanyTypeId);
  }

  getCompanyByCompanyType(cmnCompanyTypeId: any) {
    this.companyListPgStatus=false;
    //var cmnCompanyTypeId = this.frm.controls["cmnCompanyTypeId"].value;
    this.gSvc.postdata("Common/Company/GetCompanyByCompanyTypeId?companyTypeId="+ cmnCompanyTypeId, {}).subscribe(res => {
         this.companyList = res;
    this.companyListPgStatus=true;
    }, err => {
      this.companyListPgStatus=true;
      this.toastrService.error("Error! Company list not found ");
    })
  }

  // getTopNLevelCompany() {
  //   //var cmnCompanyTypeId = this.frm.controls["cmnCompanyTypeId"].value;
  //   this.gSvc.postdata("Common/Company/GetTopNLevelCompany?level="+ 2, {}).subscribe(res => {
  //        this.appointedCompanyList = res;
  //   }, err => {
  //     this.toastrService.error("Error! Company list not found ");
  //   })
  // }

  getEmployee(cmnCompanyTypeId: any, cmnComnayId: any, userLevel: any) {
    this.employeeListPgStatus=false;
    //this.auth.getCompany() + "&userLevel=" + this.auth.getUserLevel()
    this.gSvc.postdata("HRM/Employee/GetEmployeeByAnyKey?cmnCompanyTypeId=" + cmnCompanyTypeId + "&companyId=" + cmnComnayId + "&userLevel=" + userLevel, {}).subscribe(res => {
    this.employeeList = res;
    this.employeeListPgStatus=true;
    }, err => {
      this.employeeListPgStatus=true;
      this.toastrService.error("Employee List Not Found");
    })
  }

  getDesignation() {
    this.gSvc.postdata("HRM/Designation/GetAll", {}).subscribe(res => {
      this.designationList = res;
    }, err => {
      this.toastrService.error("Designation List Not Found");
    })
  }
  getDepertment() {
    this.gSvc.postdata("HRM/Designation/GetAll", {}).subscribe(res => {
      this.depertmentList = res;
    }, err => {
      this.toastrService.error("Designation List Not Found");
    })
  }
  getSection() {
    this.gSvc.postdata("HRM/Designation/GetAll", {}).subscribe(res => {
      this.sectionList = res;
    }, err => {
      this.toastrService.error("Designation List Not Found");
    })
  }


  edit(res: any) {
    this.formId = 1;
    this.frm.patchValue(res);
    var cmnCompanyTypeId = this.frm.controls["cmnCompanyTypeId"].value;
    this.getCompanyByCompanyType(cmnCompanyTypeId);
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
    this.router.navigateByUrl('/home/hrm/employee')
  }
  reset() {
    this.initializeFrm();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }

  clear(table: Table) {
    table.clear();
  }
  exportToExcel(): void {
    const columnsToExport: any[] = ['name', 'employeeId', 'mobile', 'officialEmail'];
    this.exportService.exportToExcel(this.employeeList, 'employeeList', columnsToExport);
}
}