import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ReportModel } from 'src/app/reportviewer/reportmodel';
import { ReportViewer } from 'src/app/reportviewer/reportviewer';

@Component({
  selector: 'app-item-brand',
  templateUrl: './client-payment.component.html',
  styleUrls: ['./client-payment.component.css'],
  providers: [ConfirmationService]
})
export class ClientPaymentComponent implements OnInit {

  @ViewChild(ReportViewer)
  _rptViewer!: ReportViewer;
  CompanyPayments: any;
  selectedCustomers: any;
  CompanyCustomerlist: any
  clientInvoices:any ;
  viewInfo: any = {};
  formId = 0;
  progressStatus: boolean = true;
  frm!: FormGroup
  ClientPackagelist: any
  isCheck :boolean=true;
  monthList:any = [{
    month: "january",
    clientPackage:"ClientPackagelist",
    quantity:10,
    rate:40,
    discount:50,
    amount:500
}]

  constructor(private fb: FormBuilder,
    private router: Router,
    private confirmationService: ConfirmationService,
    private gSvc: GeneralService,
    private toastrService: ToastrService,
    private auth: AuthService) {
  }

  ngOnInit(): void {
    this.getFrm();
    this.getCompanyPackages();
    this.getCompanyCustomer();
   
  }
  getFrm() {
    this.frm = this.fb.group({
      id: new FormControl(0),
      refNo: new FormControl(""),
      cmnFinancialYearId: new FormControl(Validators.required),
      date: new FormControl(),
      dueDate: new FormControl(),
      cmnCompanyCustomerId: new FormControl(),
      anFClientPackageId: new FormControl(),
      anFPaymentMethodId: new FormControl(),
      paidDate: new FormControl(),
      walletNo: new FormControl(),
      trxID: new FormControl(),
      totalAmount: new FormControl(),
      totalDiscount: new FormControl(),
      anFVoucherId: new FormControl(),
      remarks: new FormControl(),
      isCancelled: new FormControl(),
      cancelledBy: new FormControl(this.auth.getUserId()),
      cancelledDate: new FormControl(),
      cancelReason: new FormControl(),
      isCollected: new FormControl(),
      createdBy: new FormControl(this.auth.getUserId()),
      createdDate: new FormControl(new Date()),
      modifiedBy: new FormControl(this.auth.getUserId()),
      modifiedDate: new FormControl(new Date()),
      isActive: new FormControl(true),
      checkbox: new FormControl()
    });
  }

  save() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

      debugger
        this.gSvc.postdata("api/TFAClientBill/Save", this.clientInvoices).subscribe(res => {
          this.getCompanyPayments();
          this.toastrService.success("Company Payment Saved");
        }, err => {
          this.toastrService.error(err.message);
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }

  getCompanyPayments() {
    this.progressStatus = false;
    this.gSvc.postdata("api/CompanyPayment/GetAll", {}).subscribe(res => {
      this.CompanyPayments = res;
    }, err => {
      this.toastrService.error("Error! Data list Not Found");
    })
    this.progressStatus = true;
  }

  getCompanyCustomer() {
    this.gSvc.postdata("api/TFACompanyCustomer/GetAll", {} ).subscribe(res => {
      this.CompanyCustomerlist = res;
    }, err => {
      this.toastrService.error("Error! Company list not found ");
    })   
  }
  getClientInvoice(TFACompanyCustomerId:any) {
    this.gSvc.postdata("api/TFAClientBill/GetClientInvoice?TFACompanyCustomerId="+TFACompanyCustomerId, {} ).subscribe(res => {
      this.clientInvoices = res;
    }, err => {
      this.toastrService.error("Error! Company list not found ");
    })   
  }
  getCompanyPackages() {
    this.gSvc.postdata("api/CompanyPackage/GetAll", {}).subscribe(res => {
      this.ClientPackagelist = res;
    }, err => {
      this.toastrService.error("Error! Data list Not Found");
    })
  }

  selectAll(){
    if(this.isCheck==true){
      this.isCheck=false;
     this.clientInvoices.forEach((x: { isActive: boolean; }) => (x.isActive = true));
   }else{
     this.isCheck=true;
     this.clientInvoices.forEach((x: { isActive: boolean; }) => (x.isActive = false));
     
   }
  }
  

  edit(res: any) {
    this.formId = 1;
    this.frm.patchValue(res);
  }
  
  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/inventory/itembrand')
  }
  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }
  clear(table: Table) {
    table.clear();
  }
  search(reqType: string,data:any) {
    debugger;
    var frmValue = this.frm.value;
    var objReq = {
      SelectedGroup: frmValue.selectedGroup,
      SelectedSubGroup: [],
      obj: {
        companyId: this.auth.getCompany(),
        cmnFinancialYearId: 1,
        // dateFrom: frmValue.fromDate,
        dateTo: new Date(),
        cmnStoreId: 1,
        prdProductId: 1,
        clientId: 1,
        hrmEmployeeId: null,
        deviceNumber: null
      }
    }

    if (reqType == 'rdlc') {
      this.loadReportIn(objReq);
    }
  }

 // Report Execution
  public displayModal: boolean = false;
  public _getReportUrl: string = 'Inventory/Report/CurrentStockForRDLC';
  loadReportIn(item: any) {
    
    this.displayModal = true;
    var repFile = 'rptCurrentStock.rdlc';
    var rmodel = { reportPath: '/reportfile/report/' + repFile, reportName: 'Current Stock' };
    this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 800, 1);
    var Models = item;
    this._rptViewer.reportInPage(this._getReportUrl, Models);
  }
}
