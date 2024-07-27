import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-customers',
  templateUrl: './company-customers.component.html',
  styleUrls: ['./company-customers.component.css'],
  providers: [ConfirmationService]
})
export class CompanyCustomersComponent {
  [x: string]: any;
  companyList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  id: any;
  frm!: FormGroup; 
  fileTypes: any;
  fileSrc: any;
  fileToUpload: any;
  util: any;
  
  constructor(
    private fb: FormBuilder
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService
    , private toastrService: ToastrService
    , private route: ActivatedRoute
    , private auth: AuthService
  ) {

 }

 ngOnInit(): void{
  this.initialize();
  this.getCompany();
 }



 save() {  
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
      }     
      this.gSvc.postdata("api/TFACompanyCustomer/Save", JSON.stringify(this.frm.value)).subscribe(res => {
        if (res.success) {
          this.initialize();
          this.getCompany();
          this.toastrService.success(res.message);         
        }
        else {
          this.toastrService.warning(res.message);
        }
      }, err => {
        this.toastrService.error("Error! Data not save.");
      })
      return true;
    },
    reject: () => {
    }
  })
  return false;
}


getCompany() {  
  this.gSvc.postdata("api/TFACompanyCustomer/GetAll", {} ).subscribe(res => {    
    this.companyList = res;    
  }, err => {   
    this.toastrService.error("Error! Company list not found ");
  }) 
}

//File Upload
clickOnBtnFile() {
  debugger;
  this._fileInput.nativeElement.value = "";
  this._fileInput.nativeElement.click();
}
  
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


showModalDialog(res: any) {
  this.displayModal = true;
  this.initialize();
  this.viewInfo = res;
}


edit(res: any) {  
  this.formId = 1;
  //this.getFrm();
  this.frm.patchValue(res);
}

clear(){

}

initialize(){
  this.frm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl("", [Validators.required]),
    contactPerson: new FormControl(""),
    contactNo: new FormControl("",[Validators.required]),
    email: new FormControl("",[Validators.required]),
    web: new FormControl(""),
    code: new FormControl("0",[Validators.required]),
    address: new FormControl("",[Validators.required]),
    contactPersonNo: new FormControl(""),
    bin: new FormControl(""),
    shortName: new FormControl(""),
    cmnCountryId: new FormControl(),
    cmnCurrencyId: new FormControl(),
    logo: new FormControl(""),
    appKey: new FormControl(""),
    serverIP: new FormControl(""),
    motherBoardId: new FormControl(""),
    networkAdapterId: new FormControl(""),
    isActive: new FormControl(true,[Validators.required]),
    createdBy:new FormControl(this.auth.getUserId()),
    createdDate:new FormControl(new Date()),
    modifiedBy:new FormControl(this.auth.getUserId()),
    modifiedDate:new FormControl(new Date())
  })
}
}
