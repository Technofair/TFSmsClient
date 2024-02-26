import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Utility } from 'src/app/services/utility.service';
import { environment } from 'src/environments/environment';
import { balanceService } from 'src/app/global';

@Component({
  selector: 'app-digital-head',
  templateUrl: './balance-recharge.component.html',
  styleUrls: ['./balance-recharge.component.css'],
  providers: [ConfirmationService]
})
export class BalanceRechargeComponent implements OnInit {
  digitalHeadList: any;

  displayModalHistory: boolean = false;
  viewInfo: any = {};
  formId = 0;
  companies: any;
  frm!: FormGroup
  rechargeList: any;
  progressStatus: boolean = true;
  paymentMoode: any[] = [];//[{name:"Cash",id:1},{name:"Bkash",id:2},{name:"Rocket",id:3},{name:"Nagad",id:3}]

  cash: Boolean = false;
  mfs: boolean = true;
  bank: boolean = true;
  balance: number = 0;
  organizationList:any;
  isMso: boolean = this.auth.isMso();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private confirmationService: ConfirmationService,
    private gSvc: GeneralService,
    private toastrService: ToastrService,
    private auth: AuthService,
    public util: Utility
    // , private balService:balanceService
  ) {
  }

  ngOnInit(): void {
    this.transferCreate();
    this.getCompany();
    this.getActivePaymentMode();
    this.getRecharge();
    this.getClientByCompanyId();
  }
  transferCreate() {
    this.frm = this.fb.group({
      id: new FormControl(0),
      date: new FormControl(new Date()),
      refNo: new FormControl("asd"),
      // currentAmount: new FormControl(),
      amount: new FormControl('',[Validators.required,Validators.min(0)]),
      payMode: new FormControl(),
      bank: new FormControl(),
      chequeNo: new FormControl(),
      chequeDate: new FormControl(),
      remarks: new FormControl(),
      walletNo: new FormControl(),
      trxId: new FormControl(),
      docFile: new FormControl(),
      filePath: new FormControl(),
      isActive: new FormControl(true),
      balance: new FormControl(0),
      anFPaymentMethodId: new FormControl('',[Validators.required]),
      cmnCompanyId: new FormControl(),
      createdBy: new FormControl(this.auth.getUserId()),
      createdDate: new FormControl(new Date()),
      modifiedBy: new FormControl(this.auth.getUserId()),
      modifiedDate: new FormControl(new Date()),
    });
  }

  // setBalance(){
  //   this.balService.updateCurrentBalance(this.balance);
  // }
  getClientByCompanyId() {
    this.gSvc.postdata("Common/Company/GetClientByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
      this.organizationList = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  save() {
    if(this.auth.isMso())
        {
         var comId=this.frm.controls['cmnCompanyId'].value;
          if( comId ==null || comId ==='undefined' || comId==0){
            this.toastrService.error("Please select company.");
          return;
          }
        }else{
         
          this.frm.controls['cmnCompanyId'].setValue( this.auth.getCompany());
        }
    debugger;
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        
        // var fVal = this.frm.value;
        // fVal.cmnCompanyId = this.auth.getCompany();
        // fVal.createdBy = this.auth.getUserId();
        // fVal.createdDate = new Date();
        // fVal.modifiedBy = this.auth.getUserId();
        // fVal.modifiedDate = new Date();
        // fVal.date = new Date();
        var objReq={
        //  obj:JSON.stringify(this.frm.value),
          obj:this.frm.value,
          isMso: this.auth.isMso()
        }
        
        this.gSvc.postdata("api/ClientRecharge/Save", JSON.stringify(objReq)).subscribe(res => {
          //this.reset();
          // this.balService.updateCurrentBalance(this.balance);
          if (res.success) {
            this.getRecharge();
            this.toastrService.success("Data Saved Success");
            this.reset();
            if (this.fileToUpload) {
              this.submitForm(res.operationId);

            }
          } else {
            this.toastrService.error("Error! Data Not Saved");
          }
        }, err => {
          this.toastrService.error("Error! Data Not Saved");
        })

      },
      reject: () => {

      }
    })
    return false;
  }

  // viewFile: any;
  // virtualPath: any;
  // fileSrc: any;
  // fileToUpload: any;
  // handleFileInput(event: Event) {
  //   // Access the file from the event object
  //   const target = event.target as HTMLInputElement;
  //   const file: File | null = target.files?.[0] || null;

  //   if (file) {
  //     this.fileSrc = this.util.openSanitizedReportByFile(file);
  //     this.viewFile = this.fileSrc;
  //     this.virtualPath = this.fileSrc.changingThisBreaksApplicationSecurity
  //     this.fileToUpload = file;
  //     // Handle the file
  //     // You can access the file properties like file.name, file.size, etc.
  //   } else {
  //     alert("Error");
  //     // No file selected or an error occurred
  //   }
  // }


  //File Upload
  clickOnBtnFile() {
    debugger;
    this._fileInput.nativeElement.value = "";
    this._fileInput.nativeElement.click();
    //$('#attachedSingleFile').click();
  }

  public fileSrc: any;
  fileToUpload: any;
  // public documentList: any = [];
  @ViewChild('fileInput') _fileInput!: ElementRef;
  onFileChange() {
    debugger;
    //var fileInfo=this._fileInput;
    // this.documentList = [];
    //let reader = new FileReader();
    if (this._fileInput.nativeElement.files.length > 0) {
      let file = this._fileInput.nativeElement.files[0];
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
        // this.imageSrc = this.util.openSanitizedReportByFile(file);
        this.fileSrc = this.util.openSanitizedReportByFile(file);
        // this.viewFile = this.fileSrc;
        // this.virtualPath = this.fileSrc.changingThisBreaksApplicationSecurity
        this.fileToUpload = file;
      }
    }
  }

  public fileTypes: any = ["jpg", "jpeg", "png", "gif"];
  //File Upload


  submitForm(rechargeId: string) {
    const formData: FormData = new FormData();
    //formData.append("cardNumber", "asjalkd")
    formData.append('fileSource', this.fileToUpload);
    formData.append('rechargeId', rechargeId.toString());
    return this.gSvc.postdatafile('api/ClientRecharge/UploadFile', formData).subscribe(() => alert("File uploaded"));
  }

  getCompany() {
    this.gSvc.postdata("Common/Company/GetClientByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
      this.companies = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  getActivePaymentMode() {
    this.gSvc.postdata("api/PaymentMethod/GetActivePaymentMode", {}).subscribe((res: any) => {
      this.paymentMoode = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  getRecharge() {
    this.progressStatus = false;
    var comId=null;
    if(this.auth.isMso())
    {
       comId=this.frm.controls['cmnCompanyId'].value;          
    }else{
      comId=this.auth.getCompany();
    }
    var obj = { cmnCompanyId:  comId}
    this.gSvc.postdata("api/ClientRecharge/GetRechargeHistoryPackageByClientAndDate", JSON.stringify(obj)).subscribe((res: any) => {
      this.rechargeList = res;
      this.progressStatus = true;
    }, err => {
      this.progressStatus = true;
      this.toastrService.error("Error! Data Not Found");
    })
  }

  paymentModeChange() {

    var payMode = this.frm.get('anFPaymentMethodId')?.value;

    if (payMode == 1) {     //Cash
      this.cash = false;
      this.mfs = true;
      this.bank = true;
    }
    else if (payMode == 2) { //MFS
      this.cash = true;
      this.mfs = false;
      this.bank = true;
    }
    else if (payMode == 3) { //MFS
      this.cash = true;
      this.mfs = false;
      this.bank = true;
    }
    else if (payMode == 4) { //MFS
      this.cash = true;
      this.mfs = false;
      this.bank = true;
    }
    else if (payMode == 5) { //Bank
      this.cash = true;
      this.mfs = true;
      this.bank = false;
    }
  }

  edit(res: any) {
    
    this.formId = 1;
    // this.frm.setValue({
    //   id: res.id,
    //   date: res.date,
    //   refNo: res.refNo,
    //   // currentAmount: res.currentAmount,
    //   amount: res.amount,
    //   payMode: res.paymentMethod,
    //   bank: res.bank,
    //   chequeNo: res.chequeNo,
    //   chequeDate: res.chequeDate,
    //   remarks: res.remarks,
    //   walletNo: res.walletNo,
    //   trxId: res.walletNo,
    //   docFile: '',
    //   filePath: res.filePath,
    //   isActive: true,
    //   balance: res.balance,
    //   anFPaymentMethodId: res.anFPaymentMethodId,
    //   cmnCompanyId: this.auth.getCompany(),
    //   createdBy: new FormControl(this.auth.getUserId()),
    //   createdDate: new FormControl(new Date()),
    //   modifiedBy: new FormControl(this.auth.getUserId()),
    //   modifiedDate: new FormControl(new Date()),
    // });
    this.frm.patchValue(res);

    this.fileSrc = this.util.openSanitizedReportByUrl(environment.baseurl + res.filePath);

  }

  approveHistories: any[] = [];
  loadHistory(res: any) {
    debugger;
    this.approveHistories = res.approveHistories;
    this.displayModalHistory = true;
  }

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/account/balance-recharge')
  }
  clear(table: Table) {
    table.clear();
  }
  reset() {
    this.formId = 0;
    // this.frm.setValue({
    //   id: 0,
    //   date: new Date(),
    //   refNo: 'ref',
    //   // currentAmount: res.currentAmount,
    //   amount: 0,
    //   payMode: null,
    //   bank: null,
    //   chequeNo: null,
    //   chequeDate: null,
    //   remarks: null,
    //   walletNo: null,
    //   trxId: null,
    //   docFile: null,
    //   filePath: null,
    //   isActive: true,
    //   balance: null,
    //   anFPaymentMethodId: null,
    //   cmnCompanyId: this.auth.getCompany(),
    //   createdBy: new FormControl(this.auth.getUserId()),
    //   createdDate: new FormControl(new Date()),
    //   modifiedBy: new FormControl(this.auth.getUserId()),
    //   modifiedDate: new FormControl(new Date()),
    // });
    this.transferCreate();
    this.frm.markAsPristine();
  }

}