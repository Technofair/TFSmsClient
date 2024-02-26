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
  selector: 'app-party-lager',
  templateUrl: './party-lager.component.html',
  styleUrls: ['./party-lager.component.css'],
  providers: [ConfirmationService]
})
export class PartyLagerComponent implements OnInit {

  constructor(private fb: FormBuilder
    , private auth: AuthService
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService
    , private toastrService: ToastrService
    , private _util: Utility,) {

  }

  ngOnInit(): void {
    this.frmSearch();
    this.getCreditHead();
    // this.getCompany();
    // this.getStore();
    // this.getProducts();
  }

  // companies: any[] = [];
  // getCompany() {
  //   this.gSvc.postdata("Common/Company/GetClientByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
  //     this.companies = res;
  //   }, err => {
  //     this.toastrService.error("Error! Data Not Found");
  //   })
  // }

  // storeList: any[] = [];
  // getStore() {
  //   this.gSvc.postdata("Common/Store/GetByCompanyId/" + this.auth.getCompany(), {}).subscribe(res => {
  //     this.storeList = res;
  //     this.searchFrm.controls['cmnStoreId'].setValue(this.storeList[0].id);
  //   }, err => {
  //     this.toastrService.error("Error! Store not found");
  //   })
  // }

  // products: any[] = [];
  // getProducts() {
  //   this.gSvc.postdata("Inventory/Product/GetTransactionableProducts", {}).subscribe(res => {
  //     debugger;
  //     this.products = res;
  //   }, err => {
  //     this.toastrService.error("error");
  //   })
  // }

  reload() {
    this.router.navigateByUrl('/admin/digitalhead')
  }

  clear(table: Table) {
    table.clear();
  }

  reset() {
    this.searchFrm.reset();
    this.searchFrm.controls['id'].setValue(0);
    this.searchFrm.markAsPristine();
  }

  coaHeadList: any[] = [];
  getCreditHead() {
    var param = { companyId: this.auth.getCompany() };
    this.gSvc.postparam("api/ChartofAccount/GetTransactionalHeadByCompanyId", param).subscribe((res: any) => {
      this.coaHeadList = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  voucherTypeList: any[] = [{ id: 1, name: 'Payment' }, { id: 2, name: 'Received' }];

  searchFrm!: FormGroup;
  frmSearch() {
    this.searchFrm = this.fb.group({
      voucherNumber: new FormControl(null),
      reportType: new FormControl(null),
      dateFrom: new FormControl(this._util.Today()),
      dateTo: new FormControl(this._util.Today()),
      cmnBusinessId: new FormControl(1),
      cmnProjectId: new FormControl(1),
      cmnCompanyId: new FormControl(this.auth.getCompany()),//
      cmnFinancialYearId: new FormControl(1),//
      isSummary: new FormControl(false),
      status: new FormControl(true),
      type: new FormControl(1),
      voucherTypeId: new FormControl(1),//
      anFChartOfAccountId: new FormControl()//
    })
  }


  search(reqType: any) {
    var requestBody = this.searchFrm.value;
    if (reqType == 'rdlc') {
      this.loadReportIn(requestBody);
    } else {
      this.searchData(requestBody);
    }
  }

  partyLedgerList: any[] = [];
  searchData(obj: any) {
    this.gSvc.postdata("api/Report/GetPartyWiseLedger", JSON.stringify(obj)).subscribe(res => {
      this.partyLedgerList = res;
      console.log(this.partyLedgerList);
    }, err => {
      this.toastrService.error("Error ! Data is not found . ");
    })
  }

  //Report Execution Start
  @ViewChild(ReportViewer)
  _rptViewer!: ReportViewer;
  public reportModal: boolean = false;
  public _getReportUrl: string = 'api/Report/GetPartyWiseLedgerForRDLC';
  loadReportIn(item: any) {
    debugger;
    this.reportModal = true;
    var repFile = 'rptPartyLedger.rdlc';
    var rmodel = { reportPath: '/reportfile/report/' + repFile, reportName: 'Party Ledger' };
    this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 800, 1);
    var Models = item;
    this._rptViewer.reportInPage(this._getReportUrl, Models);
  }
  //Report Execution Start
}