import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Utility } from 'src/app/services/utility.service';
import { ReportViewer } from 'src/app/reportviewer/reportviewer';
import { ReportModel } from 'src/app/reportviewer/reportmodel';

@Component({
  selector: 'app-current-stock-summary',
  templateUrl: './current-stock-summary.component.html',
  styleUrls: ['./current-stock-summary.component.css'],
  providers: [ConfirmationService]
})
export class CurrentStockSummaryComponent implements OnInit {

  @ViewChild(ReportViewer)
  _rptViewer!: ReportViewer;

  digitalHeadList: any;
  //displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  organizationList: any;
  balanceTransferList: any;
  selectedRow: any;
  frm!: FormGroup;
  isMobile:boolean=false;
  progressStatus:boolean=true;
  constructor(private fb: FormBuilder
    , private auth: AuthService
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService
    , private toastrService: ToastrService
    , private _util: Utility,) {
      this.isMobile=this.auth.getView();
  }
  ngOnInit(): void {
    this.reportFrmCreate();
    this.getCompany();
    this.getStore();
    this.getProducts();
  }
  reportFrmCreate() {
    this.frm = this.fb.group({
      id: new FormControl(0),
      slsCustomerId: new FormControl(),
      cmnStoreId: new FormControl(),
      prdProductId: new FormControl(),
      selectedGroup: new FormControl(),
      fromDate: new FormControl(this._util.Today()),
      toDate: new FormControl(this._util.Today(), [Validators.required]),
    });
  }
  companies: any[] = [];
  getCompany() {
    this.gSvc.postdata("Common/Company/GetClientByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
      this.companies = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  storeList: any[] = [];
  getStore() {
    this.gSvc.postdata("Common/Store/GetByCompanyId/" + this.auth.getCompany(), {}).subscribe(res => {
      this.storeList = res;
      this.frm.controls['cmnStoreId'].setValue(this.storeList[0].id);
    }, err => {
      this.toastrService.error("Error! Store not found");
    })
  }

  products: any[] = [];
  getProducts() {
    this.gSvc.postdata("Inventory/Product/GetTransactionableProducts", {}).subscribe(res => {
      this.products = res;
    }, err => {
      this.toastrService.error("error");
    })
  }

  search(reqType: string) {
    var frmValue = this.frm.value;
    var objReq = {
      SelectedGroup: frmValue.selectedGroup,
      SelectedSubGroup: [],
      obj: {
        companyId: this.auth.getCompany(),
        cmnFinancialYearId: 1,
        dateFrom: frmValue.fromDate,
        dateTo: frmValue.toDate,
        cmnStoreId: frmValue.cmnStoreId,
        prdProductId: frmValue.prdProductId,
        clientId: frmValue.slsCustomerId,
        hrmEmployeeId: null,
        deviceNumber: null
      }
    }

    if (reqType == 'rdlc') {
      this.loadReportIn(objReq);
    } else {
      this.searchData(objReq);
    }
  }

  currentStockSummaryList: any[] = [];
  searchData(obj: any) {
    this.progressStatus=false;
    this.gSvc.postdata("Inventory/Report/StoreStockSummary", obj).subscribe(res => {
      this.currentStockSummaryList = res;
      this.progressStatus=true;
    }, err => {
      this.progressStatus=true;
      this.toastrService.error("Error! Current stock summary list not found");
    })
  }

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/admin/digitalhead')
  }

  clear(table: Table) {
    table.clear();
  }
  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }

  //Report Execution
  public displayModal: boolean = false;
  public _getReportUrl: string = 'Inventory/Report/StoreStockSummaryForRDLC';
  loadReportIn(item: any) {
    debugger;
    this.displayModal = true;
    var repFile = 'rptCurrentStockSummary.rdlc';
    var rmodel = { reportPath: '/reportfile/report/' + repFile, reportName: 'Current Stock' };
    this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 800, 1);
    var Models = item;
    this._rptViewer.reportInPage(this._getReportUrl, Models);
  }
}