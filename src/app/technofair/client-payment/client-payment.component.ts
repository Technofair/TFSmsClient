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
  ClientPackagelist: any;
  companyPackageTypes: any;
  isCheck :boolean=true;
//   monthList:any = [{
//     month: "january",
//     clientPackage:"ClientPackagelist",
//     quantity:10,
//     rate:40,
//     discount:50,
//     amount:500
// }]

  constructor(private fb: FormBuilder,
    private router: Router,
    private confirmationService: ConfirmationService,
    private gSvc: GeneralService,
    private toastrService: ToastrService,
    private auth: AuthService) {
  }

  ngOnInit(): void {
    this.getFrm();
    this.getCompanyCustomer();
  }
  getFrm() {
    this.frm = this.fb.group({
      id: new FormControl(),
      cmnCompanyCustomerId: new FormControl(null,Validators.required),
      createdBy: new FormControl(this.auth.getUserId()),
      createdDate: new FormControl(new Date()),
      modifiedBy: new FormControl(this.auth.getUserId()),
      modifiedDate: new FormControl(new Date()),
      isActive: new FormControl(true),
    });
  }
  save() {
    const transformedList = this.clientInvoices.map((item: {
      id: any;
      totalAmount: any;
      amount: any;
      quantity: any;
      packageName: any;
      packageType: any; 
      monthOfBill: any;
      expireDate:any;
      isCollected: any; 
}) => ({
      id: item.id,
      monthOfBill: item.monthOfBill,
      packageType: item.packageType,
      packageName: item.packageName,
      quantity:item.quantity,
      amount: item.amount,
      totalAmount:item.totalAmount,
      expireDate:item.expireDate,
      isCollected: item.isCollected, 
      
    }));
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let reqestbody = {
          paidBy:this.auth.getUserId(),
          cmnCompanyCustomerId: this.frm.get("cmnCompanyCustomerId")?.value,
          list: transformedList,
        }
        debugger;
        console.log(JSON.stringify(reqestbody));
        this.gSvc.postdata("api/TFAClientBill/Save",  JSON.stringify(reqestbody)).subscribe(res => {
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

  getCompanyPackageTypes() {
    this.progressStatus=false;
    this.gSvc.postdata("api/TFACompanyPackageType/GetAll", {}).subscribe(res => {
      this.companyPackageTypes = res;
    }, err => {
      this.toastrService.error("Error! Data list Not Found");
    })
    this.progressStatus=true;
  }

  selectAll(){
    if(this.isCheck==true){
      this.isCheck=false;
     this.clientInvoices.forEach((x: { isCollected: boolean; }) => (x.isCollected = true));
   }else{
     this.isCheck=true;
     this.clientInvoices.forEach((x: { isCollected: boolean; }) => (x.isCollected = false));
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
  getReportIn(tfaCompanyCustomerId:any,invoiceId:any) {
   
    var frmValue = this.frm.value;
    var objReq = {
      SelectedGroup: frmValue.selectedGroup,
      SelectedSubGroup: [],
      obj: {
        tfaCompanyCustomerId: tfaCompanyCustomerId,
        invoiceId: invoiceId,
      }
    }

      this.loadReportIn(objReq);
    
  }

 // Report Execution
  public displayModal: boolean = false;
  public _getReportUrl: string = 'api/TFAClientPayment/GetClientPaymentInvoice';
  loadReportIn(item:any) {
    
    // this.displayModal = true;
    // var repFile = 'TFAClientPaymentInvoice.rdlc';
    // var rmodel = { reportPath: '/reportfile/TFAClientPaymentInvoice/' + repFile, reportName: 'Client Payment Invoice' };
    // this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 800, 1);
    // var Models=list;
    // this._rptViewer.reportInPage(this._getReportUrl, Models);
    // debugger;
    this.displayModal = true;
    var repFile = 'TFAClientPaymentInvoice.rdlc';
    var rmodel = { reportPath: '/reportfile/TFAdmin/' + repFile, reportName: 'Current Stock' };
    this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 800, 1);
    var Models = item;
    this._rptViewer.reportInPage(this._getReportUrl, Models);
  }
}
