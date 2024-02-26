import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { Utility } from 'src/app/services/utility.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-item-model',
  templateUrl: './product-gallery.component.html',
  styleUrls: ['./product-gallery.component.css'],
  providers: [ConfirmationService]
})
export class ProductGalleryComponent implements OnInit {

  productGalleryList: any;
  selectedCustomers: any;
  products:any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  url:any=environment.baseurl;
  fileToUpload: any;
  fileToUpload2:any;
  public fileSrc: any;
  public fileSrc2: any;
  public fileTypes: any = ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"];
  @ViewChild('fileInput') _fileInput!: ElementRef;
  @ViewChild('fileInput2') _fileInput2!: ElementRef;

  constructor(private fb: FormBuilder, private router: Router,private confirmationService: ConfirmationService,private gSvc: GeneralService, private toastrService: ToastrService,public util: Utility,private auth:AuthService ) {
    
  }

  frm: FormGroup = new FormGroup({
    id: new FormControl(""),
    prdProductId: new FormControl(),
    cmnCompanyId: new FormControl(),
    isSolutionProvider: new FormControl(),
    imageUrl: new FormControl(),
    specificationUrl: new FormControl(""),
    isActive: new FormControl(""),
    createdBy:new FormControl(""),
  })
  
  ngOnInit(): void {
    this.frm = this.fb.group({
      id: ["0"],
      prdProductId: [ [Validators.required]],
      cmnCompanyId: [this.auth.getCompany()],
      isSolutionProvider: [true],
      imageUrl: [""],
      specificationUrl:[""],
      isActive:[true],
      createdBy:[this.auth.getUserId()]
    });
    this.getProductGalleryList();
    this.getProducts();
  }

  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.gSvc.postdata("Common/CmnProductGallery/Save", JSON.stringify(this.frm.value)).subscribe(res => {
             if (this.fileToUpload) {
                   this.submitForm(res.operationId);
                 }
             this.frm.reset();
             this.getProductGalleryList();
             this.toastrService.success(res.message);
           }, err => {
             this.toastrService.error(err.message);
           })
    // if(this.formId==0){
       
    //   this.gSvc.postdata("Common/CmnProductGallery/Save", JSON.stringify(this.frm.value)).subscribe(res => {
    //     if (this.fileToUpload) {
    //         this.submitForm(res.operationId);
    //       }
    //   this.frm.reset();
    //   this.getProductGalleryList();
    //   this.toastrService.success(res.message);
    // }, err => {
    //   this.toastrService.error(err.message);
    // })
    // }else if(this.formId==1){
    //   this.gSvc.postdata("Common/CmnProductGallery/Save", JSON.stringify(this.frm.value)).subscribe(res => {
    //     this.frm.reset();
    //     this.formId=0;
    //     this.getProductGalleryList();
    //     this.toastrService.success(res.message);
    //   }, err => {

    //     this.toastrService.error(err.message);

    //   })
    // }else{
    //   this.toastrService.error("Please try again");
    // }
    return true;},
    reject: () => {

    }

  })
  return false;
  }

  getProductGalleryList(){
    this.gSvc.postdata("Common/CmnProductGallery/GetAll",{}).subscribe(res => {
      this.productGalleryList=res;

    }, err => {
      this.toastrService.error();
    })
  }

  edit(data:any){
    this.formId=1;
    this.frm.patchValue(data);
  }
  getProducts() {
    this.gSvc.postdata("Inventory/Product/GetTransactionableProducts", {}).subscribe(res => {
  
      this.products = res;
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getProducts)' + err.message);
    })
  }
  getdelete(id:any) {
    this.gSvc.postdata("Common/CmnProductGallery/Delete?Id=" + id + "", {}).subscribe(res => {
      
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getProducts)' + err.message);
    })
  }
  clickOnBtnFile() {
    this._fileInput.nativeElement.value = "";
    this._fileInput.nativeElement.click();
    //$('#attachedSingleFile').click();

  }

  clickOnBtnFile2() {
    
    this._fileInput2.nativeElement.value = "";
    this._fileInput2.nativeElement.click();
    //$('#attachedSingleFile').click();

  }
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

  onFileChange2() {
    
    if (this._fileInput2.nativeElement.files.length > 0) {
     let file = this._fileInput2.nativeElement.files[0];

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
       this.fileSrc2 = this.util.openSanitizedReportByFile(file);
       this.fileToUpload2 = file;
     }
   }
 }

  showModalDialog(id:any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("api/ItemModel/ItemModel/" + id + "", {}).subscribe((res: any) => {
      this.viewInfo = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
}
//Asad Added 
submitForm(productGalleryId: string) {

    const formData: FormData = new FormData();
    formData.append('ImageUrl', this.fileToUpload);
    formData.append('SpecificationUrl', this.fileToUpload2);
    
    formData.append('productGalleryId', productGalleryId.toString());
    //formData.append('imageType', '1');
    return this.gSvc.postdatafile('Common/CmnProductGallery/UploadImageInGallery', formData).subscribe();
  }
  reload(){
    this.formId=0;
    this.router.navigateByUrl('/inventory/itemmodel')
  }
  clear(table: Table) {
    table.clear();
}
  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }
}
