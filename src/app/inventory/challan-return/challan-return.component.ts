import { Component, OnInit, ViewChild } from '@angular/core';
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
import { AnyARecord } from 'dns';
import { count } from 'console';

declare var $: any;
interface jsonObject {
  id: number;
  name: string;
  checked: boolean;
}

@Component({
  selector: 'app-challan-return',
  templateUrl: './challan-return.component.html',
  styleUrls: ['./challan-return.component.css'],
  providers: [ConfirmationService]
})
export class ChallanReturnComponent implements OnInit {
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
  returnTypes: any;
  ingredient: any;
  quantity: any;
  rate: any;
  total: any;
  fileToUpload: any;
  isDisplayed: boolean = false;
  challanMasterList: any[] = [];
  suppliers: any
  companies: any
  progressStatus: boolean = true;
  chalanReturnStatus: boolean = true;
  challanReturnHistory: any;
  constructor(
    private fb: FormBuilder
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService
    , private toastrService: ToastrService
    , private auth: AuthService
    , private util: Utility,
    private exportService: ExportService
    // @Inject(DOCUMENT) private document: any
  ) {
    ;
  }
  ngOnInit(): void {
    this.getCompany();
    this.frmCreate();
    this.frmSearch();
    this.search();
    this.warrentyList = [{ 'id': 0, "name": 'Not Applicable' }, { 'id': 1, "name": '6 M' }, { 'id': 2, "name": '1 Y' }];
    //this.returnTypes = [{ 'id': 1, 'name': 'Damaged During Shipping' }, { 'id': 2, 'name': 'Defective Product' }];
    setTimeout(() => {
      this.returnTypes = [{ 'id': 1, 'name': 'Damaged During Shipping' }, { 'id': 2, 'name': 'Defective Product' }];
    }, 0);

  }
  frmCreate() {
    this.frm = this.fb.group({
      id: new FormControl(0),
      refNo: new FormControl(""),
      lCNo: new FormControl(),
      cmnCompanyId: new FormControl(this.auth.getCompany()),
      cmnFinancialYearId: new FormControl(0),
      invSupplierId: new FormControl(Validators.required),
      date: new FormControl(new Date(), [Validators.required]),
      totalPrice: new FormControl(0),
      challanNo: new FormControl(),
      transportCharge: new FormControl(),
      otherCharge: new FormControl(),
      deduct: new FormControl(),
      payableAmount: new FormControl(),
      paidAmount: new FormControl(),
      dueAmount: new FormControl(),
      remarks: new FormControl(null, Validators.required),
      adjustAmount: new FormControl(0),
      status: new FormControl(0),
      createdBy: new FormControl(),
      createdDate: new FormControl(new Date()),
      modifiedBy: new FormControl(),
      modifiedDate: new FormControl(),
      rate: new FormControl(),
      quantity: new FormControl(),
      total: new FormControl(),
      filePath: new FormControl(),
      totalAmount: new FormControl(),
      cmnStoreId: new FormControl(Validators.required),
      invReturnTypeId: new FormControl("", Validators.required),
      frmDetail: this.fb.group({
        id: new FormControl(0),
        invPurchaseId: new FormControl(0),
        prdProductId: new FormControl(),
        invUnitId: new FormControl(1),
        // cmnStoreId: new FormControl(),
        prdProductModelId: new FormControl(),
        quantity: new FormControl([Validators.pattern("^[0-9]*$")]),
        rate: new FormControl(),
        expireDate: new FormControl(),
        specification: new FormControl(),
        invWarrantyPeriodId: new FormControl(),
        salesRate: new FormControl(),
        isSequence: new FormControl(),
        startRange: new FormControl(),
        endRange: new FormControl(),
        name: new FormControl(),
        deviceNumber: new FormControl(''),
        productModel: new FormControl(),
        total: new FormControl(),
        filePath: new FormControl()
      }),
    });
  }
  frmSearch() {
    this.searchFrm = this.fb.group({
      refNo: new FormControl(),
      partyId: new FormControl(),
      fromDate: new FormControl(),
      toDate: new FormControl(),
      deviceNumber: new FormControl(), //from deviceId to deviceNumber
      invSupplierId: new FormControl(),
      prdEditionId: new FormControl(),
      cmnCompanyId: new FormControl(),
      cmnFinancialYearId: new FormControl(),
    })
  }

  getCompany() {
    this.gSvc.postdata("Common/Company/GetClientByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
      this.companies = res;
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getCompany)' + err.message);
    })
  }

  totalSum(rowData: any, index: number) {
    debugger;
    //this.details[index].total.setValue(rowData.rate * rowData.quantity);

  }
  getprogressStatus() {
    this.progressStatus = true;
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

  save() {

    if (this.details.length == 0) {
      this.toastrService.error("No Item found");
      return false;
    }

    var counter = 0;
    this.details.forEach((item) => {
      if (item.deviceNumber == '' && item.hasDeviceID == true) {
        counter = counter + 1;
      }
    });

    if (counter > 0) {
      this.toastrService.error("Please Enter Device");
      return false;
    }

    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        debugger;
        var objModel = this.setChallanMasterDetail();
        let requestBody = { obj: objModel.master, list: objModel.detail };

        this.gSvc.postdata("Inventory/SalesReturn/Save", requestBody).subscribe(res => {
          this.search();
          if (res.success) {

            this.search();
            //this.frm.reset();
            this.details = [];
            this.toastrService.success("Challan return done Successfully");
          } else {
            this.toastrService.error("Challan return Error");
          }
        }, err => {
          this.toastrService.error("Challan return Error");
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
    var adjstAmt = this.frm.controls["adjustAmount"].value;
    var returnMaster = {
      id: 0,
      cmnFinancialYearId: chlnMaster.cmnFinancialYearId,
      cmnCompanyId: this.auth.getCompany(),
      refNo: 'ref',
      date: this.util.Today(),
      slsChallanId: chlnMaster.id,
      totalAmount: this.totalReturnAmount,
      remarks: this.frm.controls["remarks"].value,
      adjustAmount: adjstAmt,
      createdBy: this.auth.getUserId(),
      createdDate: this.util.Today()
    };

    var returnDetail: any = [];
    this.details.forEach((item) => {
      returnDetail.push({
        id: item.id,
        slsReturnId: item.slsReturnId,
        prdProductId: item.prdProductId,
        prdProductModelId: item.prdProductModelId,
        cmnStoreId: item.cmnStoreId,
        deviceNumber: item.deviceNumber,
        quantity: item.quantity,
        rate: item.rate,
        reason: 'ok',
        invReturnTypeId: this.frm.controls["invReturnTypeId"].value
      });
    });

    chlnModel.master = returnMaster;
    chlnModel.detail = returnDetail;

    return chlnModel;
  }

  challanDeviceNumber: string = '';
  returnedDeviceNumber: string = '';
  remainingDeviceNumber: string = '';
  assignedDeviceNumber: string = '';
  loadDeviceIds(res: any) {
    debugger;
    if (res != null) {
      this.displayModal = true
      this.challanDeviceNumber = res.displayDeviceNumber;
      this.returnedDeviceNumber = res.returnDeviceNumber;
      this.remainingDeviceNumber = res.remainDeviceNumber;
      this.assignedDeviceNumber = res.assignedDeviceNumber;
    } else {
      this.challanDeviceNumber = '';
      this.returnedDeviceNumber = '';
      this.remainingDeviceNumber = '';
      this.assignedDeviceNumber = '';
    }
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
      this.toastrService.error("error");
    })
  }

  search() {
    var obj = this.searchFrm.value;
    obj.cmnCompanyId = this.auth.getCompany();
    this.progressStatus = false;
    this.gSvc.postdata("Inventory/Challan/GetReturnableChallan", JSON.stringify(obj)).subscribe(res => {
      this.challanMasterList = res;
      this.getprogressStatus();

    }, err => {
      this.getprogressStatus();
      this.toastrService.error("Error! list not found");
    })
  }
  selectedRow: any;
  rowDetails(ress: any) {
    debugger
    this.selectedRow = ress.id;
    this.gSvc.postdata("Inventory/SalesReturn/GetDetailsByChallanId/" + ress.id + "", {}).subscribe(res => {

      if (res != null && res.length > 0) {
        var dtlList: any[] = res;
        dtlList.forEach(item => {
          item.deviceNumber = '';
        });

        this.details = dtlList;
      } else {
        this.details = [];
      }


      this.progressStatus = true;
    }, err => {
      this.toastrService.error("Error! list not found");
    })
  }

  checkByDevice(entity: any) {

    var dvcList: any[] = [];
    var assignDevice: any[] = [];
    if (entity.deviceNumber != '') {
      var inDvcList: any[] = entity.deviceNumber.split(',');
      var exDvcList: any[] = entity.remainDeviceNumber.split(',');

      inDvcList.forEach(item => {
        var isEx: boolean = exDvcList.includes(item);
        if (isEx) {
          dvcList.push(item);
        } else {
          assignDevice.push(item);
        }
      });

      entity.deviceNumber = dvcList.join(',');
      if (assignDevice.length > 0) {
        this.toastrService.error("Error! " + assignDevice.join(',') + " Device Is assigned to the subscriber please please remove first then return.");
      }
    }

    if (dvcList.length > 0) {
      entity.quantity = dvcList.length;
      //if (entity.quantity > 0) {
      entity.total = entity.rate * entity.quantity;
      //}
    } else {
      entity.quantity = 0;
      entity.total = 0;
    }
  }

  // checkByDevice(entity: any) {
  //   debugger;
  //   if (entity.deviceNumber != '') {
  //     var dvcList = entity.deviceNumber.split(',');
  //     if (dvcList.length > entity.remainDeviceNumber) {
  //       var dvcNo = entity.deviceNumber.replace(/,\s*$/, "");
  //       entity.deviceNumber = dvcNo;
  //       var dvcLists = entity.deviceNumber.split(',');
  //       entity.quantity = dvcLists.length;
  //     } else {
  //       var dvcLists = entity.deviceNumber.split(',');
  //       if (dvcLists[dvcLists.length - 1] == '') {
  //         entity.quantity = dvcLists.length - 1;
  //       } else {
  //         entity.quantity = dvcLists.length;
  //       }
  //     }
  //   }

  //   if (entity.quantity > 0) {
  //     entity.total = entity.rate * entity.quantity;
  //   }
  // }

  // checkByDevice(entity: any) {
  //   debugger;
  //   if (entity.remainDeviceNumber != '') {
  //     var dvcList = entity.remainDeviceNumber.split(',');
  //     if (dvcList.length > entity.deliveredQuantity) {
  //       var dvcNo = entity.remainDeviceNumber.replace(/,\s*$/, "");
  //       entity.remainDeviceNumber = dvcNo;
  //       var dvcLists = entity.remainDeviceNumber.split(',');
  //       entity.quantity = dvcLists.length;
  //     } else {
  //       var dvcLists = entity.remainDeviceNumber.split(',');
  //       if (dvcLists[dvcLists.length - 1] == '') {
  //         entity.quantity = dvcLists.length - 1;
  //       } else {
  //         entity.quantity = dvcLists.length;
  //       }
  //     }
  //   }

  //   if (entity.quantity > 0) {
  //     entity.total = entity.rate * entity.quantity;
  //   }
  // }

  checkQtySetAmt(entity: any) {
    entity.total = 0;
    var ttlQuantity = entity.returnQuantity + entity.quantity;
    var restQuantity = entity.deliveredQuantity - entity.quantity;
    if (ttlQuantity > entity.deliveredQuantity) {
      entity.quantity = restQuantity;
    }

    if (entity.quantity > 0) {
      entity.total = entity.rate * entity.quantity;
    }
  }

  totalReturnAmount: number = 0;
  checkAdjustAmt() {
    var adjstamt = this.frm.controls["adjustAmount"].value;
    if (this.details.length == 0) {
      this.frm.controls["adjustAmount"].setValue(0);
    } else {
      var ttlamt = 0, ttlretamt = 0, ttlqty = 0, ttlretqty = 0;
      this.details.forEach((item) => {
        ttlamt += (item.deliveredQuantity * item.rate);
        ttlretamt += item.quantity > 0 ? (item.quantity * item.rate) : 0;
        ttlqty += item.deliveredQuantity;
        ttlretqty += item.quantity;
      });

      if (ttlretqty == 0) {
        this.frm.controls["adjustAmount"].setValue(0);
      } else {
        if (adjstamt > (ttlamt - ttlretamt)) {
          adjstamt = ttlamt - ttlretamt;
          this.frm.controls["adjustAmount"].setValue(adjstamt);
        }

        this.totalReturnAmount = ttlretamt + adjstamt;
      }
    }
  }
  getchallanReturnHistory() {
    var obj = this.searchFrm.value;
    obj.cmnCompanyId = this.auth.getCompany();
    this.chalanReturnStatus = false;
    this.gSvc.postdata("Inventory/Challan/GetReturnableChallan", JSON.stringify(obj)).subscribe(res => {
      this.challanReturnHistory = res;
      this.chalanReturnStatus = true;
    }, err => {
      this.chalanReturnStatus = true;
      this.toastrService.error("Error! list not found");
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