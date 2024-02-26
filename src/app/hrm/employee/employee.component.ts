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
    this.frm = this.fb.group({
      id: new FormControl(0),
      cmnCompanyId: new FormControl("", Validators.required),
      employeeId: new FormControl("", Validators.required),
      name: new FormControl("", Validators.required),
      mobile: new FormControl(),
      officialEmail: new FormControl(),
      sex: new FormControl(true,Validators.required),
      //hrmDesignationId: new FormControl(),
      // hrmDepartmentId: new FormControl(),
      //  hrmSectionId: new FormControl(),
      joiningDate: new FormControl(),
      photoUrl: new FormControl(),
      signatureUrl: new FormControl(),
      //userId: new FormControl(),
      //password: new FormControl(),
      isActive: new FormControl(true),
      createdBy: new FormControl(),
      createdDate: new FormControl(),
      modifiedBy: new FormControl(),
      modifiedDate: new FormControl(),

    });
    this.genderList = [{ 'id': true, "name": 'Male' }, { 'id': false, "name": 'Female' }]
    this.getEmployee();
    this.getCompany();
    this.getDesignation();
  }


//Asad Added 12.02.2024

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

//end




  save() {
    debugger
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
          this.frm.controls['modifiedDate'].setValue(new Date());
        }

         
        this.gSvc.postdata("HRM/Employee/Save", JSON.stringify(this.frm.value)).subscribe(res => {

          //New: Start
          if(res!= 'undefined')
          {
            if(res.success){
              this.UploadPhoto(res.operationId);
              this.frm.reset();
              this.getEmployee();
              this.toastrService.success(res.message);
            }
            else{
              this.toastrService.warning(res.message);
            }
         }
          //End

          //old: Commented By Asad
          // this.frm.reset();
          // this.getEmployee();
          // this.toastrService.success("Successful");

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


  getCompany() {
    this.gSvc.postdata("Common/Company/GetAll", {}).subscribe(res => {
      this.companyList = res;
    }, err => {
      this.toastrService.error("Company List Not Found");
    })
  }

  getEmployee() {
    //GetEmployeeSummary/{companyId:int}
    this.gSvc.postdata("HRM/Employee/GetEmployeeByCompanyId/" + "1", {}).subscribe(res => {
      this.employeeList = res;
    }, err => {
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
    this.frm.reset();
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