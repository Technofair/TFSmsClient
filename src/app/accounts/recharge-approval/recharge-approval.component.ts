import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { ReportViewer } from 'src/app/reportviewer/reportviewer';
import { AuthService } from 'src/app/services/auth.service';
import { Utility } from 'src/app/services/utility.service';
import { ExportService } from 'src/app/layout/service/export.service';
import { ReportModel } from 'src/app/reportviewer/reportmodel';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';

declare var $: any;
interface jsonObject {
  id: number;
  name: string;
  checked: boolean;
}

@Component({
  selector: 'app-recharge-approval',
  templateUrl: './recharge-approval.component.html',
  styleUrls: ['./recharge-approval.component.css'],
  providers: [ConfirmationService]
})
export class RechargeApprovalComponent implements OnInit {
  @ViewChild(ReportViewer)
  _rptViewer!: ReportViewer;
  show: boolean = true;
  buttonName: any = 'Map Serial';

  frm!: FormGroup;
  resFrm!:FormGroup;
  searchFrm!: FormGroup
  formId: any;
  supplierList: any[] = [];
  storeList: any[] = [];
  products: any[] = [];
  movies: any[] = [];
  displayItemBulkModal: boolean = false;
  itemCategory: any;
  itemModelList: any;
  brandList: any;
  warrentyList: any;
  ingredient: any;
  quantity: any;
  rate: any;
  total: any;
  fileToUpload: any;
  isDisplayed: boolean = false;
  rechargeList: any[] = [];
  suppliers: any;
  reviceView:boolean=false;
  paymentMoode: any[] = [];
  organizationList: any;
  constructor(
      private fb: FormBuilder
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService
    , private toastrService: ToastrService
    , private auth: AuthService
    , public util: Utility
    , private exportService: ExportService,
    @Inject(DOCUMENT) private document: any,
    
  )
  {
  }

  ngOnInit(): void {
    //new: By Asad
    this.transferCreate();
    this.getCompany();
    this.getActivePaymentMode();
    
    this.search();
    this.reviceFrm()
    this.warrentyList = [{ 'id': 0, "name": 'Not Applicable' }, { 'id': 1, "name": '6 M' }, { 'id': 2, "name": '1 Y' }]
  }
  
  reviceFrm(){
    this.resFrm = this.fb.group({
      scpClientRechargeId: new FormControl(),
      approvalStatus: new FormControl(0),
      comments: new FormControl(),
      amount: new FormControl(),
      date: new FormControl(this.util.Today()),
      doneBy: new FormControl(this.auth.getUserId()),
    });
  }
  transferCreate(){
    this.frm = this.fb.group({
      cmnCompanyId: new FormControl(),
      fromDate: new FormControl(),
       toDate: new FormControl(),
      // fromDate: new FormControl(this.util.Today()),
      // toDate: new FormControl(this.util.Today()),
      paymentMethodId: new FormControl()
    });
   }
  
  getCompany() {
    this.gSvc.postdata("Common/Company/GetClientByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
      this.organizationList = res;
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

  search() {
    // console.log(JSON.stringify(this.frm.value));
   
    //this.gSvc.postparam("api/ClientRecharge/GetUnapproveClientRechargeByClient", JSON.stringify(this.frm.value)).subscribe(res => {
      this.gSvc.postdata("api/ClientRecharge/GetUnapproveClientRechargeByClient",  JSON.stringify(this.frm.value)).subscribe(res => {
        var rcrgList: any[];
        this.rechargeList = [];
        if (res != null && res.length > 0) {
            rcrgList = res;
            rcrgList.forEach(item => {
            item.isChecked = false;
        });
        this.rechargeList = rcrgList;
        rcrgList.forEach(item => {
          this.holdRechargeList.push({
            id: item.id,
            approvalStatus: item.approvalStatus
          });
        });
      }
    }, err => {
      this.toastrService.error("Error! list not found");
    })
  }
  reviceBalanceSave(){
    this.gSvc.postdata("api/ClientRechargeApproval/ReviseBalance", JSON.stringify(this.resFrm.value)).subscribe((res: any) => {
      this.toastrService.success("Balance revice success.Success!");
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }
  reviceBalance(data:any){
    this.reviceView=true;
   this.resFrm.controls['scpClientRechargeId'].setValue(data.id);
  }
  save() {

    if (this.rechargeList.length == 0) { this.toastrService.error("No Item found"); return false; }
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
       
        var saveList: any[] = [];
        var checkedList = this.rechargeList.filter(x => x.isChecked);
        if (checkedList.length > 0) {
          checkedList.forEach(item => {
            if (item.approvalStatus > 0) {
              var chkList = this.holdRechargeList.filter(x => x.id == item.id && x.approvalStatus != item.approvalStatus);
              if (chkList.length > 0) {
                saveList.push({
                  id: 0,
                  scpClientRechargeId: item.id,
                  doneBy: this.auth.getUserId(),
                  date: new Date(),
                  comments: item.remarks,
                  approvalStatus: item.approvalStatus
                });
              }
            }
          });
        }

        if (saveList.length == 0) {
          this.toastrService.warning("Input was invalid, please correct and try again!!!!");
          return;
        }
        
        this.gSvc.postdata("api/ClientRechargeApproval/Save", saveList).subscribe(res => {
          if (res.success) {
           // this.search();
            this.toastrService.success("Recharge status changed Successfully");
          } else {
            this.toastrService.error("Recharge status changed Error");
          }
        }, err => {
          this.toastrService.error("Recharge status changed Error");
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }

  clickAllCheck(ev: any) {
    
    this.isAllChecked = ev.currentTarget.checked;
    this.rechargeList.forEach(item => {
      item.isChecked = this.isAllChecked;
    });

    var checkedList = this.rechargeList.filter(x => x.isChecked);
    this.isCheckedAny = checkedList.length > 0 ? false : true;
  }

  isCheckedAny: boolean = true;
  isAllChecked: boolean = false;
  clickSingleCheck(ev: any, item: any) {
    item.isChecked = ev.currentTarget.checked;
    var unCheckedList = this.rechargeList.filter(x => !x.isChecked);
    this.isAllChecked = unCheckedList.length > 0 ? false : true;

    var checkedList = this.rechargeList.filter(x => x.isChecked);
    this.isCheckedAny = checkedList.length > 0 ? false : true;
  }

  holdRechargeList: any[] = [];

  // search() {
   
  //   console.log(JSON.stringify(this.frm.value));
   
  //   this.gSvc.postparam("api/ClientRecharge/GetUnapproveClientRechargeByClient", JSON.stringify(this.frm.value)).subscribe(res => {
     
  //     if (res != null && res.length > 0) {
  //       var rcrgList: any[] = res;
  //       rcrgList.forEach(item => {
  //         item.isChecked = false;
  //       });

  //       this.rechargeList = rcrgList;

  //       rcrgList.forEach(item => {
  //         this.holdRechargeList.push({
  //           id: item.id,
  //           approvalStatus: item.approvalStatus
  //         });
  //       });
  //     }
  //   }, err => {
  //     this.toastrService.error("Error! list not found");
  //   })
  // }

  //statusId: number = 0;
  statusList: any[] = [{ id: 0, name: 'Initial' }, { id: 1, name: 'Pending' }, { id: 2, name: 'Approved' }];


  checkQtySetAmt(entity: any) {
   
    entity.total = 0;
    if (entity.returnQuantity > entity.deliveredQuantity) {
      entity.returnQuantity = entity.deliveredQuantity;
    }


    if (entity.returnQuantity > 0) {
      entity.total = entity.rate * entity.returnQuantity;
    }
  }

  displayRemarks: boolean = false;
  clientRemarks: string = '';
  showRemarks(r: any) {
   
    this.clientRemarks = '';
    this.clientRemarks = r.clientRemarks;
    this.displayRemarks = true;
  }

  displayImage: boolean = false;
  imageSrc: any;
  showImage(r: any) {
   debugger;
    this.displayImage = true;
    this.imageSrc = undefined;

    this.imageSrc = this.util.openSanitizedReportByUrl(environment.baseurl + r.filePath);
    //this.imageSrc=environment.baseurl+r.filePath;
  }

  reset() {
    //this.selectedRow = undefined;
  }

  clear(table: Table) {
    table.clear();
  }

  //Report Execution
  public displayModal: boolean = false;
  public _getReportUrl: string = 'reportviewer/reportviewer/gettestreport';
  loadReportIn(item: any) {
    
    this.displayModal = true;
    var repFile = 'rptTestReport.rdlc';
    var rmodel = { reportPath: '/reportfile/Inventory/' + repFile, reportName: 'Test Report' };
    this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 800);
    var param = { pageNumber: 0, pageSize: 100, IsPaging: true, id: 0, strId: item.cmnCompanyId, strId2: item.cmnStoreId };
    var ModelsArray = [param];
    this._rptViewer.reportInPage(this._getReportUrl, ModelsArray);
  }

  loadReportOut(item: any) {
    var isModal: boolean = false;
    var repFile = 'rptTestReport.rdlc';
    var rmodel = { reportPath: '/reportfile/Inventory/' + repFile, reportName: 'Test Report' };
    this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 800);
    var param = { pageNumber: 0, pageSize: 100, IsPaging: true, id: 0, strId: item.cmnCompanyId, strId2: item.cmnStoreId };
    var ModelsArray = [param];
    this._rptViewer.reportOutPage(this._getReportUrl, ModelsArray, isModal);
  }

  // @ViewChild('reportPurchase') _reportPurchase!: ElementRef;
  // openInNewTab() {
  //   //var document=Document;
  //   var newWindowContent: any = this._reportPurchase.nativeElement.innerHTML;
  //   var newWindow: any = window.open("", "", "width=500,height=400");
  //   newWindow.document.write(newWindowContent);
  // }
  //Report Execution

  exportToExcel(): void {
    const columnsToExport: any[] = ['refNo', 'date', 'supplierName', 'payableAmount'];
    this.exportService.exportToExcel(this.rechargeList, 'subscriber_invoice', columnsToExport);
  }
}





//Old
// import { Component, Inject, OnInit, ViewChild } from '@angular/core';
// import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { ConfirmationService } from 'primeng/api';
// import { Router } from '@angular/router';
// import { Table } from 'primeng/table';
// import { GeneralService } from 'src/app/services/general.service';
// import { ToastrService } from 'ngx-toastr';
// import { ReportViewer } from 'src/app/reportviewer/reportviewer';
// import { AuthService } from 'src/app/services/auth.service';
// import { Utility } from 'src/app/services/utility.service';
// import { ExportService } from 'src/app/layout/service/export.service';
// import { ReportModel } from 'src/app/reportviewer/reportmodel';
// import { DOCUMENT } from '@angular/common';
// import { environment } from 'src/environments/environment';

// declare var $: any;
// interface jsonObject {
//   id: number;
//   name: string;
//   checked: boolean;
// }

// @Component({
//   selector: 'app-recharge-approval',
//   templateUrl: './recharge-approval.component.html',
//   styleUrls: ['./recharge-approval.component.css'],
//   providers: [ConfirmationService]
// })
// export class RechargeApprovalComponent implements OnInit {
//   @ViewChild(ReportViewer)
//   _rptViewer!: ReportViewer;
//   show: boolean = true;
//   buttonName: any = 'Map Serial';

//   frm!: FormGroup;
//   searchFrm!: FormGroup
//   formId: any;
//   supplierList: any[] = [];
//   storeList: any[] = [];
//   products: any[] = [];
//   movies: any[] = [];
//   displayItemBulkModal: boolean = false;
//   itemCategory: any;
//   itemModelList: any;
//   brandList: any;
//   warrentyList: any;
//   ingredient: any;
//   quantity: any;
//   rate: any;
//   total: any;
//   fileToUpload: any;
//   isDisplayed: boolean = false;
//   rechargeList: any[] = [];
//   suppliers: any;

//   paymentMoode: any[] = [];
//   organizationList: any;
//   constructor(
//     private fb: FormBuilder
//     , private router: Router
//     , private confirmationService: ConfirmationService
//     , private gSvc: GeneralService
//     , private toastrService: ToastrService
//     , private auth: AuthService
//     , public util: Utility,
//     private exportService: ExportService,
//     @Inject(DOCUMENT) private document: any,
//   )
//   {
//   }

//   ngOnInit(): void {

//     //new: By Asad
//     this.transferCreate();
//     this.getCompany();
//     this.getActivePaymentMode();
//     this.search();
//     this.warrentyList = [{ 'id': 0, "name": 'Not Applicable' }, { 'id': 1, "name": '6 M' }, { 'id': 2, "name": '1 Y' }]
//   }

//   transferCreate(){
//     this.frm = this.fb.group({
//       cmnCompanyId: new FormControl(),
//       fromDate: new FormControl(null),
//       toDate: new FormControl(null),
//       paymentMethodId: new FormControl()
//     });
//    }

//   getCompany() {
//     this.gSvc.postdata("Common/Company/GetClientByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
//       this.organizationList = res;
//     }, err => {
//       this.toastrService.error("Error! Data Not Found");
//     })
//   }
  
//   getActivePaymentMode() {
//     this.gSvc.postdata("api/PaymentMethod/GetActivePaymentMode", {}).subscribe((res: any) => {
//       this.paymentMoode = res;
//     }, err => {
//       this.toastrService.error("Error! Data Not Found");
//     })
//   }

//   save() {
//     // if (this.frm.invalid) return false;
//     // console.log(this.frm.value);
//     if (this.rechargeList.length == 0) { this.toastrService.error("No Item found"); return false; }
//     this.confirmationService.confirm({
//       message: 'Are you sure that you want to proceed?',
//       header: 'Confirmation',
//       icon: 'pi pi-exclamation-triangle',
//       accept: () => {
       
//         var saveList: any[] = [];
//         var checkedList = this.rechargeList.filter(x => x.isChecked);
//         if (checkedList.length > 0) {
//           checkedList.forEach(item => {
//             if (item.approvalStatus > 0) {
//               var chkList = this.holdRechargeList.filter(x => x.id == item.id && x.approvalStatus != item.approvalStatus);
//               if (chkList.length > 0) {
//                 saveList.push({
//                   id: 0,
//                   scpClientRechargeId: item.id,
//                   doneBy: this.auth.getUserId(),
//                   date: new Date(),
//                   comments: item.remarks,
//                   approvalStatus: item.approvalStatus
//                 });
//               }
//             }
//           });
//         }

//         if (saveList.length == 0) {
//           this.toastrService.warning("Input was invalid, please correct and try again!!!!");
//           return;
//         }
        
//         this.gSvc.postdata("api/ClientRechargeApproval/Save", saveList).subscribe(res => {
//           if (res.success) {
//            // this.search();
//             this.toastrService.success("Recharge status changed Successfully");
//           } else {
//             this.toastrService.error("Recharge status changed Error");
//           }
//         }, err => {
//           this.toastrService.error("Recharge status changed Error");
//         })
//         return true;
//       },
//       reject: () => {
//       }
//     })
//     return false;
//   }

//   clickAllCheck(ev: any) {
    
//     this.isAllChecked = ev.currentTarget.checked;
//     this.rechargeList.forEach(item => {
//       item.isChecked = this.isAllChecked;
//     });

//     var checkedList = this.rechargeList.filter(x => x.isChecked);
//     this.isCheckedAny = checkedList.length > 0 ? false : true;
//   }

//   isCheckedAny: boolean = true;
//   isAllChecked: boolean = false;
//   clickSingleCheck(ev: any, item: any) {
//     item.isChecked = ev.currentTarget.checked;
//     var unCheckedList = this.rechargeList.filter(x => !x.isChecked);
//     this.isAllChecked = unCheckedList.length > 0 ? false : true;

//     var checkedList = this.rechargeList.filter(x => x.isChecked);
//     this.isCheckedAny = checkedList.length > 0 ? false : true;
//   }

//   holdRechargeList: any[] = [];

//   search() {
   
//     console.log(JSON.stringify(this.frm.value));
   
//     this.gSvc.postparam("api/ClientRecharge/GetUnapproveClientRechargeByClient", JSON.stringify(this.frm.value)).subscribe(res => {
     
//       if (res != null && res.length > 0) {
//         var rcrgList: any[] = res;
//         rcrgList.forEach(item => {
//           item.isChecked = false;
//         });

//         this.rechargeList = rcrgList;

//         rcrgList.forEach(item => {
//           this.holdRechargeList.push({
//             id: item.id,
//             approvalStatus: item.approvalStatus
//           });
//         });
//       }
//     }, err => {
//       this.toastrService.error("Error! list not found");
//     })
//   }

//   //statusId: number = 0;
//   statusList: any[] = [{ id: 0, name: 'Initial' }, { id: 1, name: 'Pending' }, { id: 2, name: 'Approved' }];


//   checkQtySetAmt(entity: any) {
   
//     entity.total = 0;
//     if (entity.returnQuantity > entity.deliveredQuantity) {
//       entity.returnQuantity = entity.deliveredQuantity;
//     }


//     if (entity.returnQuantity > 0) {
//       entity.total = entity.rate * entity.returnQuantity;
//     }
//   }

//   displayRemarks: boolean = false;
//   clientRemarks: string = '';
//   showRemarks(r: any) {
   
//     this.clientRemarks = '';
//     this.clientRemarks = r.clientRemarks;
//     this.displayRemarks = true;
//   }

//   displayImage: boolean = false;
//   imageSrc: any;
//   showImage(r: any) {
   
//     this.displayImage = true;
//     this.imageSrc = undefined;

//     this.imageSrc = this.util.openSanitizedReportByUrl(environment.baseurl + r.filePath);
//     //this.imageSrc=environment.baseurl+r.filePath;
//   }

//   reset() {
//     //this.selectedRow = undefined;
//   }

//   clear(table: Table) {
//     table.clear();
//   }

//   //Report Execution
//   public displayModal: boolean = false;
//   public _getReportUrl: string = 'reportviewer/reportviewer/gettestreport';
//   loadReportIn(item: any) {
    
//     this.displayModal = true;
//     var repFile = 'rptTestReport.rdlc';
//     var rmodel = { reportPath: '/reportfile/Inventory/' + repFile, reportName: 'Test Report' };
//     this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 800);
//     var param = { pageNumber: 0, pageSize: 100, IsPaging: true, id: 0, strId: item.cmnCompanyId, strId2: item.cmnStoreId };
//     var ModelsArray = [param];
//     this._rptViewer.reportInPage(this._getReportUrl, ModelsArray);
//   }

//   loadReportOut(item: any) {
//     var isModal: boolean = false;
//     var repFile = 'rptTestReport.rdlc';
//     var rmodel = { reportPath: '/reportfile/Inventory/' + repFile, reportName: 'Test Report' };
//     this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 800);
//     var param = { pageNumber: 0, pageSize: 100, IsPaging: true, id: 0, strId: item.cmnCompanyId, strId2: item.cmnStoreId };
//     var ModelsArray = [param];
//     this._rptViewer.reportOutPage(this._getReportUrl, ModelsArray, isModal);
//   }

//   // @ViewChild('reportPurchase') _reportPurchase!: ElementRef;
//   // openInNewTab() {
//   //   //var document=Document;
//   //   var newWindowContent: any = this._reportPurchase.nativeElement.innerHTML;
//   //   var newWindow: any = window.open("", "", "width=500,height=400");
//   //   newWindow.document.write(newWindowContent);
//   // }
//   //Report Execution

//   exportToExcel(): void {
//     const columnsToExport: any[] = ['refNo', 'date', 'supplierName', 'payableAmount'];
//     this.exportService.exportToExcel(this.rechargeList, 'subscriber_invoice', columnsToExport);
//   }
// }