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
  selector: 'app-opening-balance',
  templateUrl: './opening-balance.component.html',
  styleUrls: ['./opening-balance.component.css'],
  providers: [ConfirmationService]
})
export class OpeningBalanceComponent implements OnInit {
  @ViewChild(ReportViewer)
  _rptViewer!: ReportViewer;
  show: boolean = true;
  buttonName: any = 'Map Serial';
  frm!: FormGroup;
  searchFrm!: FormGroup
  // details: any[] = [];
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
  openingBalanceList: any[] = [];
  suppliers: any;
  openingBaStatus:boolean=true;
  constructor(
    private fb: FormBuilder
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService
    , private toastrService: ToastrService
    , private auth: AuthService
    , public util: Utility,
    private exportService: ExportService,
    @Inject(DOCUMENT) private document: any,
  ) {
    ;
  }
  ngOnInit(): void {
    this.search();
  }

  save() {
    if (this.openingBalanceList.length == 0) { this.toastrService.error("No Item found"); return false; }
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        debugger;
        var saveList: any[] = [];
        this.openingBalanceList.forEach(item => {
          var cngModel = this.holdOpeningBalanceList.filter(x => x.id == item.id && x.anFChartOfAccountId == item.anFChartOfAccountId && x.debit == item.debit && x.credit == item.credit)[0];
          if (cngModel == undefined) {
            saveList.push({
              id: item.id,
              cmnCompanyId: this.auth.getCompany(),
              cmnFinancialYearId: 1,
              cmnProjectId: 1,
              anFChartOfAccountId: item.anFChartOfAccountId,
              debit: item.debit,
              credit: item.credit,
              isEditable: item.isEditable,
              createdBy: this.auth.getUserId(),
              createdDate: new Date(),
              modifiedBy: this.auth.getUserId(),
              modifiedDate: new Date()
            });
          }
        });

        if (saveList.length == 0) {
          this.toastrService.warning("No change found to save, please correct and try again!!!!");
          return;
        }

        this.gSvc.postdata("api/OpeningBalance/Save", saveList).subscribe(res => {
          if (res.success) {
            this.search();
            this.toastrService.success("Opening balance saved Successfully");
          } else {
            this.toastrService.error("Opening balance saved Error");
          }
        }, err => {
          this.toastrService.error("Opening balance saved Error");
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }

  isChangedAny: boolean = true;
  setChanged(item: any) {
    this.isChangedAny = true;
    var chngModel = this.holdOpeningBalanceList.filter(x => x.id == item.id && x.anFChartOfAccountId == item.anFChartOfAccountId)[0];
    if (chngModel != undefined) {
      if (chngModel.debit != item.debit || chngModel.credit != item.credit) {
        this.isChangedAny = false;
      }
    }

    this.setTotal();
  }

  holdOpeningBalanceList: any[] = [];
  search() {
    this.openingBaStatus=false;
    var param = { companyId: this.auth.getCompany() };
    this.gSvc.postparam("api/OpeningBalance/GetOpeningBalanceByCompanyId", param).subscribe(res => {
      
      if (res != null && res.length > 0) {
        var opbalList: any[] = res;
        opbalList.forEach(item => {
          item.isChecked = false;
          item.debit = item.debit == null ? 0 : item.debit,
            item.credit = item.credit == null ? 0 : item.credit
        });

        this.openingBalanceList = opbalList;
        this.openingBaStatus=true;
        opbalList.forEach(item => {
          this.holdOpeningBalanceList.push({
            id: item.id,
            name: item.name,
            code: item.code,
            anFChartOfAccountId: item.anFChartOfAccountId,
            debit: item.debit,
            credit: item.credit,
            isEditable: item.isEditable
          });
        });

        this.setTotal();
      }

    }, err => {
      this.openingBaStatus=true;
      this.toastrService.error("Error! list not found");
    })
  }

  ttlDebit: number = 0;
  ttlCredit: number = 0;
  setTotal() {
    this.ttlDebit = 0;
    this.ttlCredit = 0;
    this.openingBalanceList.forEach(item => {
      this.ttlDebit += item.debit;
      this.ttlCredit += item.credit;
    })
  }

  //statusId: number = 0;
  //statusList: any[] = [{ id: 0, name: 'Initial' }, { id: 1, name: 'Pending' }, { id: 2, name: 'Approved' }];

  // selectedRow?: number = undefined;
  // setColor = (indexId: number) => {
  //   debugger;
  //   this.selectedRow = indexId;
  // }

  //rowDetails(res: any) {
  // this.gSvc.postdata("Inventory/SalesReturn/GetDetailsByChallanId/" + res.id + "", {}).subscribe(res => {
  //   debugger;
  //   this.details = res;
  // }, err => {
  //   this.toastrService.error("Error! list not found");
  // })
  //}

  // checkQtySetAmt(entity: any) {
  //   debugger;
  //   entity.total = 0;
  //   if (entity.returnQuantity > entity.deliveredQuantity) {
  //     entity.returnQuantity = entity.deliveredQuantity;
  //   }


  //   if (entity.returnQuantity > 0) {
  //     entity.total = entity.rate * entity.returnQuantity;
  //   }
  // }

  // displayRemarks: boolean = false;
  // clientRemarks: string = '';
  // showRemarks(r: any) {
  //   debugger;
  //   this.clientRemarks = '';
  //   this.clientRemarks = r.clientRemarks;
  //   this.displayRemarks = true;
  // }

  // displayImage: boolean = false;
  // imageSrc: any;
  // showImage(r: any) {
  //   debugger;
  //   this.displayImage = true;
  //   this.imageSrc = undefined;

  //   this.imageSrc = this.util.openSanitizedReportByUrl(environment.baseurl + r.filePath);
  //   //this.imageSrc=environment.baseurl+r.filePath;
  // }

  // totalReturnAmount: number = 0;
  // checkAdjustAmt() {
  //   var adjstamt = this.frm.controls["adjustAmount"].value;
  //   if (this.details.length == 0) {
  //     this.frm.controls["adjustAmount"].setValue(0);
  //   } else {
  //     var ttlamt = 0, ttlretamt = 0, ttlqty = 0, ttlretqty = 0;
  //     this.details.forEach((item) => {
  //       ttlamt += (item.deliveredQuantity * item.rate);
  //       ttlretamt += item.returnQuantity > 0 ? (item.returnQuantity * item.rate) : 0;
  //       ttlqty += item.deliveredQuantity;
  //       ttlretqty += item.returnQuantity;
  //     });

  //     if (ttlretqty == 0) {
  //       this.frm.controls["adjustAmount"].setValue(0);
  //     } else {
  //       if (adjstamt > (ttlamt - ttlretamt)) {
  //         adjstamt = ttlamt - ttlretamt;
  //         this.frm.controls["adjustAmount"].setValue(adjstamt);
  //       }

  //       this.totalReturnAmount = ttlretamt + adjstamt;
  //     }
  //   }
  // }

  // onclick(event: any) {
  //   if (event.target.checked == true) {
  //     this.isDisplayed = true;
  //   }
  //   else {
  //     this.isDisplayed = false;
  //   }
  // }

  // reload() {
  //   this.router.navigateByUrl('/inventory/product-receive')
  // }
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
    debugger;
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
    this.exportService.exportToExcel(this.openingBalanceList, 'subscriber_invoice', columnsToExport);
  }
}