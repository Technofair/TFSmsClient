import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { read, utils } from "xlsx";
import { Utility } from 'src/app/services/utility.service';
import { ReportModel } from 'src/app/reportviewer/reportmodel';
import { ReportViewer } from 'src/app/reportviewer/reportviewer';
import { ExportService } from 'src/app/layout/service/export.service';
//import { DOCUMENT } from '@angular/common';
declare var $: any;
interface jsonObject {
  id: number;
  name: string;
  checked: boolean;
}
@Component({
  selector: 'app-purchase-order',
  templateUrl: './challan-receive.component.html',
  styleUrls: ['./challan-receive.component.css'],
  providers: [ConfirmationService]
})

export class ChallanReceiveComponent implements OnInit {
  @ViewChild(ReportViewer)
  _rptViewer!: ReportViewer;
  show: boolean = true;
  buttonName: any = 'Map Serial';
  frm!: FormGroup;
  searchFrm!: FormGroup
  details: any[] = [];
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
  challanMasterList: any[] = [];
  suppliers: any
  selectedRow:any;
  challanReceiveStatus:boolean=true;
  progressStatus:boolean=true;
  ChallanReceiveHistory:any;
  constructor(
    private fb: FormBuilder
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService
    , private toastrService: ToastrService
    , private auth: AuthService
    , private util: Utility,
    private exportService: ExportService
  ) {
    this.getStore();
    }
  ngOnInit(): void {
    this.frmCreate();
    this.frmSearch();
    this.search();
    this.warrentyList = [{ 'id': 0, "name": 'Not Applicable' }, { 'id': 1, "name": '6 M' }, { 'id': 2, "name": '1 Y' }]
  }
  frmCreate() {
    this.frm = this.fb.group({
      id: new FormControl(0),
      //refNo: new FormControl(""),
      //lCNo: new FormControl(),
      //cmnCompanyId: new FormControl(this.auth.getCompany()),
      //cmnFinancialYearId: new FormControl(0),
      //invSupplierId: new FormControl(Validators.required),
      //date: new FormControl(new Date(), [Validators.required]),
      //totalPrice: new FormControl(0),
      //challanNo: new FormControl(),
      //transportCharge: new FormControl(),
      //otherCharge: new FormControl(),
      //deduct: new FormControl(),
      //payableAmount: new FormControl(),
      //paidAmount: new FormControl(),
      //dueAmount: new FormControl(),
      remarks: new FormControl(),
      //status: new FormControl(0),
      createdBy: new FormControl(),
      createdDate: new FormControl(new Date()),
      modifiedBy: new FormControl(),
      modifiedDate: new FormControl(),
      //rate: new FormControl(),
      //quantity: new FormControl(),
      //total: new FormControl(),
      //filePath: new FormControl(),
      //totalAmount: new FormControl(),
      cmnStoreId: new FormControl(Validators.required)
      // frmDetail: this.fb.group({
      //   id: new FormControl(0),
      //   invPurchaseId: new FormControl(0),
      //   prdProductId: new FormControl(),
      //   invUnitId: new FormControl(1),

      //   prdProductModelId: new FormControl(),
      //   quantity: new FormControl([Validators.pattern("^[0-9]*$")]),
      //   rate: new FormControl(),
      //   expireDate: new FormControl(),
      //   specification: new FormControl(),
      //   invWarrantyPeriodId: new FormControl(),
      //   salesRate: new FormControl(),
      //   isSequence: new FormControl(),
      //   startRange: new FormControl(),
      //   endRange: new FormControl(),
      //   name: new FormControl(),
      //   deviceNumber: new FormControl(''),
      //   productModel: new FormControl(),
      //   total: new FormControl(),
      //   filePath: new FormControl()
      // }),
    });
  }
  frmSearch() {
    this.searchFrm = this.fb.group({
      refNo: new FormControl(),
      fromDate: new FormControl(),
      toDate: new FormControl(),
      invSupplierId: new FormControl(),
      prdEditionId: new FormControl(),
      cmnCompanyId: new FormControl(),
      cmnFinancialYearId: new FormControl(),
    })
  }

  getStore() {
    this.gSvc.postdata("Common/Store/GetByCompanyId/" + this.auth.getCompany(), {}).subscribe(res => {
      this.storeList = res;
      this.frm.controls['cmnStoreId'].setValue(this.storeList[0].id);
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getStore)' + err.message);
    })
  }

  totalSum(rowData: any, index: number) {
    debugger;
    //this.details[index].total.setValue(rowData.rate * rowData.quantity);

  }

  addSerial(): void {
    var devices = '';
    var obj = this.frm.value;
    var objDetail = obj.frmDetail;
    var deviceID = objDetail.deviceNumber;
    var startRange = objDetail.startRange;
    var endRange = objDetail.endRange;
    for (var i = startRange; i <= endRange; i++) {

      if (devices != '') {
        devices += "," + deviceID + i;
      } else {
        devices = deviceID + i;
      }
    }

    objDetail.deviceNumber = devices;
    objDetail.startRange = '';
    objDetail.endRange = '';
    this.frm.controls['frmDetail'].setValue(objDetail);

  };

  addRow(): void {
    //const objDetail = this.frm.get('frmDetail')?.value;
    //let userName = this.frm.controls['frmOrdDetails'].value.prdProductId;
    //console.log(userName);

    var obj = this.frm.value;
    var objDetail = obj.frmDetail;
    objDetail.cmnStoreId = this.frm.get('cmnStoreId')?.value;
    objDetail.total = (objDetail.rate * objDetail.quantity);

    const results = this.details.filter((element: any) => {
      if (element.prdProductId === objDetail.prdProductId) {
        return true;
      }
      return false;
    });
    if (results.length > 0) {
      this.toastrService.info("Please input complete data!");
      // alert(results);
    } else {
      var totalAmt = obj.payableAmount == undefined ? 0 : obj.payableAmount;
      totalAmt += objDetail.total;
      this.frm.controls['payableAmount'].setValue(totalAmt);
      this.details.push(objDetail);
    }
  }
  removeRow(index: number): void {
    this.details.splice(index, 1); // 'index' is the index of the row you want to remove
  }
  toggle() {
    this.show = !this.show;

    // Change the name of the button.
    if (this.show)
      this.buttonName = "Add More Serial";
    else
      this.buttonName = "Map Serial";
  }

  saveChallanReceive() {
    // if (this.frm.invalid) return false;
    // console.log(this.frm.value);
    if (this.details.length == 0) { this.toastrService.error("No Item found"); return false; }
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        
        var storeId = this.frm.get('cmnStoreId')?.value;
        if(storeId == null || storeId == 'undefined'){
          this.toastrService.warning('Please Select Store');
          return;
        }

        var objModel = this.setChallanMasterDetail();
        let requestBody = { obj: objModel.master, list: objModel.detail };
        this.gSvc.postdata("Inventory/MRR/SaveChallanReceive", requestBody).subscribe(res => {
          this.search();
          if (res.success) {
            this.frm.reset();
            this.details = [];
            this.toastrService.success("Product received done Successfully");
          } else {
            this.toastrService.error(res.message);
              console.log('Exception: (saveChallanReceive)' +  res.message);
          }
        }, err => {
          this.toastrService.error(err.message);
              console.log('Exception: (saveChallanReceive)' +  err.message);
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }

  setChallanMasterDetail() {
    var chlnModel = {
      master: {},
      detail: []
    }
    var chlnId = this.details[0].slsChallanId;
    var chlnMaster = this.challanMasterList.filter(x => x.id == chlnId)[0];

    var challanMaster = {
      id: 0,
      cmnFinancialYearId: chlnMaster.cmnFinancialYearId,
      cmnCompanyId: this.auth.getCompany(),
      refNo: 'ref',
      date: this.util.Today(),
      slsChallanId: chlnMaster.id,
      receivedBy: this.auth.getUserId(),
      remarks: this.frm.controls["remarks"].value,
      createdBy: this.auth.getUserId()
    };

    var challanDetail: any = [];
    this.details.forEach((item) => {
      challanDetail.push({
        id: 0,
        invMRRId: 0,
        prdProductId: item.prdProductId,
        prdProductModelId: item.prdProductModelId,
        cmnStoreId: this.frm.controls["cmnStoreId"].value, // item.cmnStoreId,
        quantity: item.deliveredQuantity,
        rate: item.rate
      });
    });

    chlnModel.master = challanMaster;
    chlnModel.detail = challanDetail;

    return chlnModel;
  }

  edit(item: any) {
    //this.frm.patchValue(id);
    //this.details=[];
    this.gSvc.postdata("Inventory/Purchase/GetPurchaseDetailsByPurchaseId/" + item.id + "", {}).subscribe((res: any) => {
      if (res.length > 0) {
        this.details = res;
        var model = res[0];
        this.frm.controls['id'].setValue(item.id);
        this.frm.controls['refNo'].setValue(item.refNo);
        this.frm.controls['cmnStoreId'].setValue(model.cmnStoreId);
        this.frm.controls['invSupplierId'].setValue(item.invSupplierId);
        this.frm.controls['cmnFinancialYearId'].setValue(item.cmnFinancialYearId);
        //this.frm.controls['paidStatus'].setValue(item.paidStatus); 
        this.frm.controls['date'].setValue(this.util.DateConvert(item.date));
        this.frm.controls['payableAmount'].setValue(item.payableAmount);
        this.frm.controls['remarks'].setValue(item.remarks);
      } else {
        this.reset();
      }
    }, err => {
      this.toastrService.error(err.message);
              console.log('Exception: (edit)' +  err.message);
    })
  }

  search() {
    var obj = this.searchFrm.value;
    obj.cmnCompanyId = this.auth.getCompany();
    this.progressStatus=false;
    this.gSvc.postdata("Inventory/Challan/GetProductReceiveableChallan", JSON.stringify(obj)).subscribe(res => {
      this.challanMasterList = res;
      this.progressStatus=true;
    }, err => {
      this.progressStatus=true;
      this.toastrService.error(err.message);
      
    })
  }
  rowDetails(res: any) {
    this.selectedRow=res.id;
    this.gSvc.postdata("Inventory/Challan/GetChallanDetailByChallanId/" + res.id + "", {}).subscribe(res => {
      this.details = res;

      console.log(JSON.stringify(res));

    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (rowDetails)' +  err.message);
    })
  }
  onclick(event: any) {
    if (event.target.checked == true) {
      this.isDisplayed = true;
    }
    else {
      this.isDisplayed = false;
    }
  }

  reload() {
    this.router.navigateByUrl('/inventory/product-receive')
  }
  reset() {

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
    this.exportService.exportToExcel(this.challanMasterList, 'subscriber_invoice', columnsToExport);
  }
}