import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ExportService } from 'src/app/layout/service/export.service';
import { ReportViewer } from 'src/app/reportviewer/reportviewer';
import { ReportModel } from 'src/app/reportviewer/reportmodel';
import { Utility } from 'src/app/services/utility.service';

@Component({
  selector: 'app-challan-statement',
  templateUrl: './client-ledger.component.html',
  styleUrls: ['./client-ledger.component.css'],
  providers: [ConfirmationService]
})
export class ClientLedgerComponent implements OnInit {

  //displayModal: boolean = false;
  displayPackageModal: boolean = false;
  displaySTBModal: boolean = false
  viewInfo: any = {};
  challanStatementList: any[] = [];
  apiurl: any;
  casTypeList: any;
  networkList: any;
  stbList: any;
  packageList: any;
  numberOfMonth: any;
  frmstb!: FormGroup;
  devices: any;


  id: any;
  cardNumberList: any;
  organizations: any;
  frmsrc!: FormGroup
  districtList: any
  thanaList: any
  unionList: any;
  companies: any;
  tableData: any;
  searchQuery: string = '';
  searchResults: any[] = [];
  deviceCount: any;
  lsoWiseProductList:any;
  products:any;
  brands:any;
  constructor(
    private fb: FormBuilder
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService
    , private toastrService: ToastrService
    , private route: ActivatedRoute
    , private auth: AuthService
    , private exportService: ExportService
    , private util: Utility) {

  }


  ngOnInit(): void {
    this.getCompany();
    this.getProduct();
    this.getBrand();
    this.frmsearch();
  }
  getProduct() {
    this.gSvc.postdata("Common/Company/GetClientByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
      this.companies = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }
  getBrand() {
    this.gSvc.postdata("Common/Company/GetClientByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
      this.companies = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }
  getCompany() {
    this.gSvc.postdata("Common/Company/GetClientByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
      this.companies = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  clear(table: Table) {
    table.clear();
  }

  reset() {
    this.frmsrc.reset();
    this.frmsrc.controls['id'].setValue(0);
    this.frmsrc.markAsPristine();
  }
  searchReset() {
    this.frmsrc.reset();
    this.frmsrc.markAsPristine();
  }
   exportTExcel() {
     const columnsToExport: any[] = ['productName', 'deviceNumber', 'clientName', 'subscriberName'];
     this.exportService.exportToExcel(this.lsoWiseProductList, 'lso_wise_product_list', columnsToExport);
   }

  frmsearch() {
    this.frmsrc = this.fb.group({
      clientId: new FormControl(),
      cmnCompanyId: new FormControl(this.auth.getCompany()),
      productId: new FormControl(),
      productModelId: new FormControl(),
     
    })
  }

  search(reqType: any) {
    var requestBody = this.frmsrc.value;
    if (reqType == 'rdlc') {
      this.loadReportIn(requestBody);
    } else {
      this.searchData(requestBody);
    }
  }

  searchData(obj: any) {
    this.gSvc.postdata("api/Report/GetDeviceInfoByClientId", JSON.stringify(obj)).subscribe(res => {
    
      this.lsoWiseProductList = res;
    }, err => {
      this.toastrService.error("Error ! Data is not found . ");
    })
  }

  //Report Execution
  @ViewChild(ReportViewer)
  _rptViewer!: ReportViewer;
  public reportModal: boolean = false;
  public _getReportUrl: string = 'api/Report/GetPrdDeviceInfoRdlcByClientId';
  loadReportIn(item: any) {
    
    this.reportModal = true;
    var repFile = 'LSOWiseProductList.rdlc';
    var rmodel = { reportPath: '/reportfile/report/' + repFile, reportName: 'Device List' };
    this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 800, 1);
    var Models = item;
    this._rptViewer.reportInPage(this._getReportUrl, Models);
  }
}
