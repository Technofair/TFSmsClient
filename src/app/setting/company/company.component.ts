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
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css'],
  providers: [ConfirmationService]
})
export class CompanyComponent implements OnInit {


  companyList: any;
  companyTypeList: any;
  divisionList: any;
  districtList: any;
  upazilla: any;
  thanaList: any;
  unionList: any;
  countryList: any;

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
  msoInfo: any;
  bulkImport:boolean=true;
  cmnCountryId: any;
  cmnDistrictId: any;
  cmnDivisionId: any;
  secUserTypeList: any;
  progressStatus=true;
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

   this.syncAddressAsMSO();

  }
  ngOnInit(): void {
    this.genderList = [{ 'id': 1, "name": 'Male' }, { 'id': 2, "name": 'Female' }, { 'id': 3, "name": 'Others' }]
    this.getDivision();
   // console.log(this.msoInfo.cmnCountryId);
    this.frm = new FormGroup({
      id: new FormControl(0, [Validators.required]),
      code: new FormControl("0"),
      name: new FormControl("", [Validators.required]),
      prefix: new FormControl("",[Validators.required]),
      contactPerson: new FormControl("", [Validators.required]),
      contactNo: new FormControl("", [Validators.required]),
      alternatePhone: new FormControl(),
      welcomeNote:new FormControl(),
      //email: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      zip: new FormControl(),
      cmnCompanyId: new FormControl(this.auth.getCompany()),
      cmnCompanyTypeId: new FormControl("", [Validators.required]),

      //cmnCountryId: new FormControl(),
      // cmnDivisionId: new FormControl(this.msoInfo.cmnDivisionId, [Validators.required]),
      // cmnDistrictId: new FormControl(this.msoInfo.cmnDistrictId, [Validators.required]),

      cmnCountryId: new FormControl(),
      cmnDivisionId: new FormControl("", [Validators.required]),
      cmnDistrictId: new FormControl("", [Validators.required]),

      cmnUpazillaId: new FormControl("", [Validators.required]),
      secUserTypeId: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required]),
      cmnUnionId: new FormControl(),
      fax: new FormControl(),
      web: new FormControl(),
      isActive: new FormControl(true),
      createdBy: new FormControl(),
      createdDate: new FormControl(),
      modifiedBy: new FormControl(),
      ModifiedDate: new FormControl(),

      frmFileAttachment: this.fb.group({
        id: new FormControl(0),
        cmnCompanyId: new FormControl(0),
        filePath: new FormControl(""),
        identificationNo: new FormControl(""),
        hrmFileCategoryId: new FormControl(0),
        fileName: new FormControl(""),
        fileCategory: new FormControl(""),
        uploadFile: new FormControl(""),
      }),
    });
    this.getCompany();
    this.getAttachType();
    this.getCompanyType();
    this.getCountry();
    this.getSecUserType();
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
 getbulkImport(){
  if(this.bulkImport){
    this.bulkImport=false;
  }else{
    this.bulkImport=true;
  }
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
          else if (res != undefined && res.success == true) {
            debugger;
            this.saveFile(res.operationId)

            if (this.fileToUpload) {
              this.submitForm(res.operationId);
            }

            this.reset();
            this.getCompany();
            this.toastrService.success("Saved successfully");
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

  exportToExcel(): void {
    const columnsToExport: string[] = ['name', 'code', 'contactPerson', 'contactNo', 'email', 'address'];
    this.exportService.exportToExcel(this.companyList, 'client_report', columnsToExport);
  }

  getCompany() {
    this.progressStatus=false;
    this.gSvc.postdata("Common/Company/GetCompanyList", {}).subscribe(res => {
      this.companyList = res;
      this.progressStatus=true;
    }, err => {
      this.progressStatus=true;
      this.toastrService.error("Error! Company list not found ");
    })
   
  }

  getCompanyType() {
    this.gSvc.postdata("Common/Company/GetCompanyType", this.auth.getCompany()).subscribe(res => {
      this.companyTypeList = res;
    }, err => {
      this.toastrService.error("Error! Company type list not found");
    })
  }

  getCountry() {
    this.gSvc.postdata("Common/Country/Countries", {}).subscribe(res => {
      this.countryList = res;
    }, err => {
      this.toastrService.error("Error! Country list not found");
    })
  }

  getDivision() {
    this.gSvc.postdata("api/Division/Divisions", {}).subscribe(res => {
      this.divisionList = res;
    }, err => {
      this.toastrService.error("Division error!");
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
      this.toastrService.error("District error!");
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
      this.toastrService.error("Upazila error!");
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
      this.toastrService.error("Union error!");
    })
  }

  getSecUserType() {
    this.gSvc.postdata("Security/SecUserType/GetAllSecUserType", {}).subscribe(res => {
      this.secUserTypeList = res;
    }, err => {
      this.toastrService.error("Error! SecUserType list not found");
    })
  }

//Asad Added 28.11.2023

  //File Upload
  clickOnBtnFile() {
    debugger;
    this._fileInput.nativeElement.value = "";
    this._fileInput.nativeElement.click();
    //$('#attachedSingleFile').click();
  }

  // public fileSrc: any;
  // fileToUpload: any;

  @ViewChild('fileInput') _fileInput!: ElementRef;
  onFileChange() {
    //debugger;

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




  edit(res: any) {
    this.getCompany();
    this.frm.patchValue(res);
    this.getDistrictByDivisionId();
    this.getUploadList(res);
  }

  getUploadList(model: any) {
    debugger;
    var param = {
      companyId: model.id
    }
    this.apiurl = "Common/Company/GetAttachmentByCompanyId";
    this.gSvc.postparam(this.apiurl, param).subscribe(res => {
      debugger;
      //this.unionList = res;
      this.attachmentList=[];
      if (res.length > 0) {
        var resList: any[] = res;
        resList.forEach(item => {
          this.attachmentList.push({
            hrmFileCategoryId: item.hrmFileCategoryId,
            fileCategory: item.fileCategory,
            identificationNo: item.identificationNo,
            fileName: item.fileName,
            fileType: 0,
            fileSize: 0,
            attachedFile: {},
            viewFile: this.util.openSanitizedReportByUrl(environment.baseurl+item.filePath),
            virtualPath:  item.filePath
          });
        });
      }
    }, err => {
      this.toastrService.error("Upload List error!");
    })
  }

  showModalDialog(res: any) {
    this.displayModal = true;
    this.reset();
    this.viewInfo = res;
  }

  attachModal() {
    this.attachmentModal = true;
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
    this.frm.controls['cmnCompanyId'].setValue(this.auth.getCompany());
    this.frm.controls['id'].setValue(0);
    this.frm.controls['isActive'].setValue(true);
    this.frm.markAsPristine();
  }

  fileToUpload: any;
  handleFileInput(event: Event) {
    // Access the file from the event object
    const target = event.target as HTMLInputElement;
    const file: File | null = target.files?.[0] || null;

    if (file) {
      this.fileToUpload = file;
      this.uploadAvatar("", file)
      // Handle the file
      // You can access the file properties like file.name, file.size, etc.
    } else {
      alert("Error");
      // No file selected or an error occurred
    }
  }


  deleteDoc(index: any) {
    this.uploadedDocuments.splice(index, 1);
  }
  uploadedDocuments: any = [];
  uploadAvatar(imageSrc: any, file: any) {
    // if(this.uploadedDocuments.length < 5){
    this.uploadedDocuments.push({
      imageUrl: imageSrc,
      fileSize: file.size,
      fileName: file.name.replace(/ /g, '_'),
    });
    //}else{
    // this.genralService.openSnackBar('Maximum 5 documents can be uploaded');
    // }

  }

  importClients($event: any) {
    this.clientViews = [];
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
              var obj: any = { ParentName: '', Type: '', Name: '', Address: '', ContactPerson: '', ContactNo: '', AlternatePhone: '', Email: '', Country: '', Division: '', District: '', Upazilla: '', Union: '', Zip: '', Fax: '', Web: '', createdBy: 0 };
              obj = sheetRows[i];
              obj.createdBy = this.auth.getUserId();
              this.clientViews.push(obj);
              this.hideButton = false;
            }
          }
        }
      }
      reader.readAsArrayBuffer(file);
    }
  }


  clientBulkUpload() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.gSvc.postdata("Common/Company/BulkSave", JSON.stringify(this.clientViews)).subscribe(res => {
          //console.log(this.frm.value);
          if (res != undefined) {
            this.clientViews = [];
            this.hideButton = false;
            this.getCompany();
            this.toastrService.success("Data saved successfully");
          } else {
            this.toastrService.error("Error! Data not save.");
          }
        }, err => {
          this.toastrService.error("Error! Data Not save.");
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }


  getAttachType() {
    this.gSvc.postdata("HRM/FileCategory/GetAll", {}).subscribe(res => {
      this.attachmentTypes = res;
    }, err => {
      this.toastrService.error("Error! Attachment list not found");
    })
  }

  public fileSrc: any;
  public fileTypes: any = ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"];
  @ViewChild('doc') _doc!: ElementRef;
  addRow(): void {
    debugger;
    const filList = this.frm.get('frmFileAttachment')?.value;
    if (this._doc.nativeElement.files.length > 0) {
      var exmodel = this.attachmentList.filter(x => x.fileName == this._doc.nativeElement.files[0].name)[0];
      if (exmodel == undefined) {
        let file = this._doc.nativeElement.files[0];
        var arryext = file.name.split(".");
        var ext = arryext[arryext.length - 1];
        var extlwr = ext.toLowerCase();
        var fileIndex = this.fileTypes.indexOf(extlwr);
        var fileSize = file.size / 1024 / 1024; // in MB
        //var fileType = file.type;
        if (fileSize > 5) {
          this.toastrService.error('File size exceeds 5 MB', 'File Upload Error!');
        } else if (fileIndex === -1) {
          this.toastrService.error('File type not supported. Valid file types are ' + this.fileTypes, 'File Type Error!');
        } else {
          this.fileSrc = this.util.openSanitizedReportByFile(file);
          var model = this.attachmentTypes.filter(x => x.id == filList.hrmFileCategoryId)[0];
          var sl = this.attachmentList.length + 1;
          this.attachmentList.push({
            hrmFileCategoryId: filList.hrmFileCategoryId,
            fileCategory: model.name,
            identificationNo: filList.identificationNo,
            fileName: file.name,
            fileType: extlwr,
            fileSize: fileSize,
            attachedFile: file,
            viewFile: this.fileSrc,
            virtualPath: this.fileSrc.changingThisBreaksApplicationSecurity
          });
          //this.frmFileAttachment={};
          this._doc.nativeElement.value = "";
        }
      } else {
        this.toastrService.warning("Same file already exists!!!");
      }
    }
  }

  removeRow(index: number, rowData: any): void {
    if (rowData != undefined && rowData.Id > 0) {
      if (this.removeData == "") {
        this.removeData = rowData.id;
      } else {
        this.removeData += ',' + rowData.id;
      }
    }
    this.attachmentList.splice(index, 1); // 'index' is the index of the row you want to remove
  }

  saveFile(comId: number) {
    debugger;
    var formData = new FormData();
    if (this.attachmentList.length > 0) {
      this.attachmentList.forEach(item => {
        formData.append('file', item.attachedFile);
      });
    }

    var uplist: any[] = [];
    this.attachmentList.forEach((item) => {
      uplist.push({
        id: 0,
        cmnCompanyId: comId,
        filePath: "",
        identificationNo: item.identificationNo,
        hrmFileCategoryId: item.hrmFileCategoryId,
        fileName: item.fileName,
        fileCategory: item.fileCategory
      });
    })

    formData.append('comId', comId.toString());
    formData.append('details', this.removeData.toString());
    formData.append('lists', JSON.stringify(uplist));

    this.gSvc.postdatafile('Common/Company/UploadFile', formData).subscribe(res => {
      if (res != undefined) {
        this.toastrService.success("File uploaded successfully");
      } else {
        this.toastrService.error("Error! file not uploaded.");
      }
    }, err => {
      this.toastrService.error("Error! file not uploaded.");
    })
  }


//Asad Added 
submitForm(companyId: string) {
  debugger;
  const formData: FormData = new FormData();

  formData.append('fileSource', this.fileToUpload);
  formData.append('companyId', companyId.toString());
  return this.gSvc.postdatafile('Common/Company/UploadLogo', formData).subscribe(() => alert("Logo uploaded"));
}

displayImage: boolean = false;
imageSrc: any;
showImage(r: any) {
  debugger;
  this.displayImage = true;
  this.imageSrc = undefined;

  this.imageSrc = this.util.openSanitizedReportByUrl(environment.baseurl + r.virtualPath);
  //this.imageSrc=environment.baseurl+r.filePath;
}


}
