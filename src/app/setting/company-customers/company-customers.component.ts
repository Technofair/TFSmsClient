import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-company-customers',
  templateUrl: './company-customers.component.html',
  styleUrls: ['./company-customers.component.css'],
  providers: [ConfirmationService]
})
export class CompanyCustomersComponent {
  companyList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  id: any;
  frm!: FormGroup; 
  fileTypes: any;
  toastrService: any;
  fileSrc: any;
  fileToUpload: any;
  util: any;
  
  constructor(
    private fb: FormBuilder
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService
    //, private toastrService: ToastrService
    //, private route: ActivatedRoute
    , private auth: AuthService
   // , private exportService: ExportService
    //, public util: Utility,
  ) {

 }

 ngOnInit(): void{
  this.frm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl("", [Validators.required]),
    contactPerson: new FormControl(""),
    contactNo: new FormControl(),
    email: new FormControl("",[Validators.required]),
    web: new FormControl(),
    address: new FormControl("",[Validators.required]),
    phone: new FormControl("",[Validators.required]),
    isActive: new FormControl(true,[Validators.required]),
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
        this.frm.controls['createdBy'].setValue(this.auth.getUserId());
        this.frm.controls['createdDate'].setValue(new Date());
      } else if (this.frm.controls['id'].value > 0) {
        this.frm.controls['modifiedBy'].setValue(this.auth.getUserId());
      }

      this.gSvc.postdata("Common/Company/Save", JSON.stringify(this.frm.value)).subscribe(res => {
        debugger;
        if (res == undefined) {
          
          this.toastrService.error("Something went wrong");
        }
        else {
          this.toastrService.error("Error! Data not save.");
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
  this.reset();
  this.viewInfo = res;
}


edit(){

}
clear(){

}

reset(){

}

}
