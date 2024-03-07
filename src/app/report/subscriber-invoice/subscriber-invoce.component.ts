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
  templateUrl: './subscriber-invoce.component.html',
  styleUrls: ['./subscriber-invoce.component.css'],
  providers: [ConfirmationService]
})
export class SubscriberInvoceComponent implements OnInit {

  displayModal: boolean = false;
  displayPackageModal: boolean = false;
  displaySTBModal: boolean = false
  viewInfo: any = {};
  subscriberInvoiceList: any;
  apiurl: any;
  packageList: any;
  numberOfMonth: any;
  frmstb!: FormGroup;
  devices: any;



  frmsrc!: FormGroup

  companies: any;

  deviceCount: any;
  progressStatus:boolean=true;
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService, private route: ActivatedRoute, private auth: AuthService, private exportService: ExportService) {

  }



  ngOnInit(): void {
    this.getCompany();
    this.frmsearch();
  }

  assignStbFrm() {
    this.frmstb = this.fb.group({
      id: new FormGroup(0),
      scpSubscriberId: new FormControl(),
      prdDeviceNumberId: new FormControl(),
      amount: new FormControl(),
    });
  }
  frmsearch() {
    this.frmsrc = this.fb.group({
      companyId: new FormControl(),
      clientId: new FormControl(),
      customerNumber: new FormControl(''),
      contactNumber: new FormControl(''),
      deviceNumber:new FormControl(),
      name: new FormControl(''),
      fromDate: new FormControl(),
      toDate: new FormControl(),
    })
  }

  exportToExcel(): void {
    const columnsToExport: any[] = ['refNo', 'date', 'subscriberName', 'deviceNumber', 'packageName', 'amount',  'packageTypeString', 'endDate', 'trxID', 'paymentMode'];
    this.exportService.exportToExcel(this.subscriberInvoiceList, 'Payment_Status', columnsToExport);
  }

  edit(id: any) {
    console.log(id)
    this.router.navigate(['home/subscription/addSubscriber/' + id]);
  }
  clear(table: Table) {
    table.clear();
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
      //typeName:this.subsType.find((type: { id: number; }) => type.id == item.subscriberType).name,
      contactNumber: item.contactNumber,
      email: item.email,
      subscriberType: item.subscriberType,
      autoDeactive: item.autoDeactive,
      address: item.address,
    }));
    // this.subscriberInvoiceList=transformedList;
  }
  search() {
    var requestBody = this.frmsrc.value;
    this.progressStatus=false;
    requestBody.companyId = this.auth.getCompany();
    this.gSvc.postdata("api/SubscriberInvoice/GetSubscriberInvoicePaymentByDate", JSON.stringify(requestBody)).subscribe(res => {
      this.subscriberInvoiceList = res;
      this.progressStatus=true;
    }, err => {
      this.progressStatus=true;
      this.toastrService.error("Error ! Data is not found . ");
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

  //Report Execution
  @ViewChild(ReportViewer)
  _rptViewer!: ReportViewer;
  public reportModal: boolean = false;
  public _getReportUrl: string = 'api/SubscriberInvoice/GetSubscriberInvoicePaymentByInvoiceIdRdlc';
  loadReportIn(data: any, isPos:boolean) {
    debugger;
    
    var frm = { InvoiceId: data.id, companyId: this.auth.getCompany() };
    this.reportModal = true;
    var repFile = isPos?'SubscriberBillPos.rdlc':'SubscriberBill.rdlc';
    var rmodel = { reportPath: '/reportfile/report/' + repFile, reportName: 'Subscriber Bill' };
    this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 800, 1);
    var Models = JSON.stringify(frm);
    this._rptViewer.reportInPage(this._getReportUrl, Models);
  }
  //Report Execution
}
