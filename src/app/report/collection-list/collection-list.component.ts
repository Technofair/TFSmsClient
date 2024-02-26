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

@Component({
  selector: 'app-add-subscriber',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.css'],
  providers: [ConfirmationService]
})
export class CollectionListComponent implements OnInit {

  displayModal: boolean = false;
  displayPackageModal: boolean = false;
  displaySTBModal: boolean = false
  viewInfo: any = {};
  subscriberList: any[] = [];
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

  companies: any;
  tableData: any;
  searchQuery: string = '';
  searchResults: any[] = [];
  deviceCount: any;
  progressStatus:boolean=true
  constructor(
    private fb: FormBuilder
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService
    , private toastrService: ToastrService
    , private route: ActivatedRoute
    , private auth: AuthService
    , private exportService: ExportService) {

  }

  ngOnInit(): void {

    this.getCompany();
 
    this.frmsearch();
    //this.search();
  }

  
  frmsearch() {
   
    this.frmsrc = this.fb.group({
      companyId: new FormControl(),
      clientId: new FormControl(),
      customerNumber: new FormControl(''),
      contactNumber: new FormControl(''),
      deviceNumber: new FormControl(''),
      name: new FormControl(''),
      cmnDistrictId: new FormControl(),
      cmnUpazillaId: new FormControl(),
      cmnUnionId: new FormControl()
    })

  }

  


  edit(id: any) {
    //console.log(id);
    this.router.navigate(['home/subscription/addSubscriber/' + id]);
  }
  clear(table: Table) {
    table.clear();
  }
  reset() {
    this.frmsrc.reset();
  }



  

  join(res: any) {
    var list = res;
    //var name =this.subsType.find((item: { id: number; })=> item.id==1).name;
    var transformedList = list.map((item: {
      autoDeactive: any;
      lastName: any;
      firstName: any;
      address: any;
      email: any;
      contactNumber: any;
      subscriberType: any;
      id: any;
    }) => ({
      id: 0,
      firstName: item.firstName,
      lastName: item.lastName,
    //  typeName: this.subsType.find((type: { id: number; }) => type.id == item.subscriberType).name,
      contactNumber: item.contactNumber,
      email: item.email,
      subscriberType: item.subscriberType,
      autoDeactive: item.autoDeactive,
      address: item.address,
    }));
    this.subscriberList = transformedList;
  }
  search() {
    var requestBody = this.frmsrc.value;
    requestBody.companyId = this.auth.getCompany();
    this.progressStatus=false;
    this.gSvc.postdata("api/Subscriber/GetSubscriberWithDeviceByParameter", JSON.stringify(requestBody)).subscribe(res => {
      this.subscriberList = res;
      this.progressStatus=true;
    }, err => {
      this.progressStatus=true;
      this.toastrService.error("Error ! Data is not found . ");
    })

  }


  showModalDialog(res: any) {
    this.displayModal = true;
    this.viewInfo = res;
    var id = res.id;

    this.gSvc.postdata("api/SubscriberPackage/GetSubscriberLatestDevicePackageInfoBySubscriberId?subscriberId=" + id, {}).subscribe((res: any) => {
      this.tableData = res;
    }, err => {
      this.toastrService.error("Error");
    })
  }



  getCompany() {
    this.gSvc.postdata("Common/Company/GetClientByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
      this.companies = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }


  searchReset() {
    this.frmsrc.reset();
    this.frmsrc.markAsPristine();
  }

  exportTExcel() {
    const columnsToExport: any[] = ['customerNumber', 'firstName', 'contactNumber', 'email', 'address', 'packageName', 'devices'];
    this.exportService.exportToExcel(this.subscriberList, 'subscriber_report', columnsToExport);
  }

  //Report Execution
  @ViewChild(ReportViewer)
  _rptViewer!: ReportViewer;
  public reportModal: boolean = false;
  public _getReportUrl: string = 'api/Subscriber/GetReportSubscriberWithDeviceByParameter';
  loadReportIn() {
    debugger;
    var requestBody = this.frmsrc.value;
    requestBody.companyId = this.auth.getCompany();
    this.reportModal = true;
    var repFile = 'rptSubscriver.rdlc';
    var rmodel = { reportPath: '/reportfile/Subscription/' + repFile, reportName: 'Subscriber List' };
    this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 800);
    var param = { pageNumber: 0, pageSize: 100, IsPaging: true, id: 0, strId: this.auth.getCompany() };
    var ModelsArray = [requestBody, param];
    this._rptViewer.reportInPage(this._getReportUrl, ModelsArray);
  }
}
