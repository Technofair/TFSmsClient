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
  selector: 'app-challan',
  templateUrl: './challan.component.html',
  styleUrls: ['./challan.component.css'],
  providers: [ConfirmationService]
})

export class ChallanComponent implements OnInit {
  @ViewChild(ReportViewer)
  _rptViewer!: ReportViewer;
  show: boolean = true;
  buttonName: any = 'Map Serial';
  frm!: FormGroup;
  searchFrm!: FormGroup
  details: any[] = [];
  formId: any;
  clientList: any[] = [];
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
  challanList: any[] = [];
  clients: any;
  isUploadExcel: boolean = false;
  isFromList: boolean = false;
  isSequence: boolean = false;
  progressStatus: boolean = false;
  stbCounter: any = 0;
  constructor(
    private fb: FormBuilder
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService
    , private toastrService: ToastrService
    , private auth: AuthService
    , private _util: Utility,
    private exportService: ExportService
    // @Inject(DOCUMENT) private document: any
  ) {
    this.getCompany();
    this.getStore();
    this.getProducts();
    //this.getStockDevice();
    //this.calculateSum();
    // this.getBrandList();
    // this.getItemCategory();
    // this.getItemModelList();
  }

  ngOnInit(): void {
    this.frmCreate();
    this.frmSearch();
    this.search();
    this.getWarranty();
    // this.warrentyList = [{ 'id': 0, "name": 'Not Applicable' }, { 'id': 1, "name": '6 M' }, { 'id': 2, "name": '1 Y' }]
  }
  frmCreate() {
    this.frm = this.fb.group({
      id: new FormControl(0),
      refNo: new FormControl("ref"),
      cmnCompanyId: new FormControl(this.auth.getCompany()),
      cmnFinancialYearId: new FormControl(0),
      slsCustomerId: new FormControl(Validators.required),
      date: new FormControl(this._util.Today(), [Validators.required]),
      memoDate: new FormControl(new Date(), [Validators.required]),
      memoNo: new FormControl(),
      gatePassNo: new FormControl(),
      slsSalesOrderId: new FormControl(),
      totalPrice: new FormControl(0),
      challanNo: new FormControl(),
      transportCharge: new FormControl(),
      otherCharge: new FormControl(),
      deduct: new FormControl(),
      payableAmount: new FormControl(),
      paidAmount: new FormControl(),
      dueAmount: new FormControl(),
      remarks: new FormControl('ok'),
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
      receiveStatus: new FormControl(),
      slsDeliveryVehicleInformationId: new FormControl(),
      challanPrintStatus: new FormControl(),
      gatePassStatus: new FormControl(),
      anFVoucherId: new FormControl(),
      returnStatus: new FormControl(),
      totalDiscount: new FormControl(),
      netTotal: new FormControl(),
      frmDetail: this.fb.group({
        id: new FormControl(0),
        slsChallanId: new FormControl(0),
        invChallanId: new FormControl(0),
        prdProductId: new FormControl(),
        invUnitId: new FormControl(1),
        cmnStoreId: new FormControl(),
         prdProductModelId: new FormControl("", Validators.required),
        productName: new FormControl("", Validators.required),
        quantity: new FormControl([Validators.pattern("^[0-9]*$")]),
        stockQuantity: new FormControl(),
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
        filePath: new FormControl(),
        batchNo: new FormControl(),
        code: new FormControl(),
        unit: new FormControl(),
        slsSalesOrderId: new FormControl(),
        orderQuantity: new FormControl(),
        deliveredQuantity: new FormControl(),
        dueQuantity: new FormControl(),
        value: new FormControl(),
        currentStock: new FormControl(0),
        totalAmount: new FormControl(0),
        discount: new FormControl(0)
      }),

    });
  }
  frmSearch() {
    this.searchFrm = this.fb.group({
      refNo: new FormControl(),
      fromDate: new FormControl(),
      toDate: new FormControl(),
      // slsCustomerId: new FormControl(),
      // prdEditionId: new FormControl(),
      cmnCompanyId: new FormControl(),
      // cmnFinancialYearId: new FormControl(),
      cmnStoreId: new FormControl(),
      partyId: new FormControl(),
      hrmEmployeeId: new FormControl()
    })
  }
  getClients() {
    this.gSvc.postdata("Inventory/Client/GetAll", {}).subscribe(res => {
      this.clients = res
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getClients)' + err.message);
    })
  }

  calculateSum() {
    var obj = this.frm.value;
    var objCal = obj.frm;
    const rate = objCal.get('rate').value;
    const quantity = objCal.get('quantity').value;
    objCal.get('total').setValue(rate * quantity);

  }

  totalSum(rowData: any, index: number) {
    this.details[index].total = rowData.rate * rowData.quantity;
    this.totalCal(rowData, index);
  }
  totalCal(rowData: any, index: number) {
    this.details[index].totalAmount = rowData.total - rowData.discount;
    var ttlAmt = 0, ttlDscnt = 0;
    if (this.details.length > 0) {
      this.details.forEach((item) => {
        ttlAmt += item.totalAmount;
        ttlDscnt += item.discount;
      });
      this.frm.controls['netTotal'].setValue(ttlAmt);
      this.frm.controls['totalAmount'].setValue(ttlAmt);
      this.frm.controls['totalDiscount'].setValue(ttlDscnt);
    }
  }
  grandTotalCalc() {
    var ntotal = this.frm.controls['netTotal'].value;
    var ndiscount = this.frm.controls['totalDiscount'].value;
    this.frm.controls['totalAmount'].setValue(ntotal - ndiscount);
  }
  addCheckedItem(): void {
    var deviceList = this.unassignedStockDeviceList.filter(x => x.isActive);



    if (deviceList.length > 0) {
      var devices = '';
      var obj = this.frm.value;
      var objDetail = obj.frmDetail;
      objDetail.deviceNumber = '';
      var dvlist: any = [];
      deviceList.forEach((item) => {
        dvlist.push(item.deviceDisplayNumber.trim());
      });

      devices = dvlist.join(',');

      objDetail.deviceNumber = devices;
      objDetail.quantity = deviceList.length; //Asad Added
      this.frm.controls['frmDetail'].setValue(objDetail);
    } else {
      var obj = this.frm.value;
      var objDetail = obj.frmDetail;
      objDetail.deviceNumber = '';
      objDetail.quantity = 0;
      this.frm.controls['frmDetail'].setValue(objDetail);
    }




  };
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

    objDetail.deviceNumber = devices.trim();
    objDetail.startRange = '';
    objDetail.endRange = '';
    this.frm.controls['frmDetail'].setValue(objDetail);

  };

  deviceNumberWrong: string = '';
  wrngDvcList: any[] = [];
  checkIfExist() {

    var frmMst = this.frm.value;
    var frmDtl = frmMst.frmDetail;
    if (frmDtl.deviceNumber != '') {
      var dvcl = this._util.removeSpace(frmDtl.deviceNumber);
      var dvcList: any[] = dvcl.split(',');
      if (dvcList.length > 0) {
        this.wrngDvcList = [];
        dvcList.forEach(item => {
          var chkDvc = this.unassignedStockDeviceList.filter(x => x.deviceDisplayNumber == item)[0];
          if (chkDvc == undefined) {
            this.wrngDvcList.push(item);
          }
        });

        this.deviceNumberWrong = this.wrngDvcList.join(',');
      }
    }
  }

  deviceNumberDuplicate:string='';
  addRow(): void {
    //const objDetail = this.frm.get('frmDetail')?.value;
    //let userName = this.frm.controls['frmOrdDetails'].value.prdProductId;
    //console.log(userName);

    var obj = this.frm.value;
    var objDetail = obj.frmDetail;

    var prodModel = this.products.filter(x => x.id == objDetail.prdProductId)[0];
    if ((prodModel.hasDeviceID != null && prodModel.hasDeviceID == true) && (objDetail.deviceNumber == '' || objDetail.deviceNumber == null || objDetail.deviceNumber == undefined)) {
      this.toastrService.warning("Please input device id, Device ID is requeired!");
      return;
    }

    debugger;

    if (objDetail.id > 0) {
      var dtlModel = this.details.filter(x => x.id == objDetail.id && x.slsChallanId == objDetail.slsChallanId)[0];
      dtlModel.prdProductId = objDetail.prdProductId;
      dtlModel.quantity = objDetail.quantity;
      dtlModel.rate = objDetail.rate;
      dtlModel.invWarrantyPeriodId = objDetail.invWarrantyPeriodId;
      dtlModel.deviceNumber = objDetail.deviceNumber;

      var dvcNo = this._util.removeSpace(objDetail.deviceNumber);

      if (dvcNo != '' && dvcNo != null && dvcNo != undefined) {
        var dvcList: any[] = dvcNo.split(',');
        debugger;
        var duplist=this.getDuplicate(dvcList);
        this.deviceNumberDuplicate=duplist.join(',');

        var uniqueDvc=this.getUnique(dvcList);

        objDetail.deviceNumber = uniqueDvc.join(',');
        objDetail.quantity = uniqueDvc.length;
        //objDetail.quantity = dvcNo.split(',').length;
        // this.frm.controls['frmDetail'].setValue(objDetail);
      }

      dtlModel.quantity = objDetail.quantity;
      objDetail.id = 0;
      objDetail.slsChallanId = 0;
      this.frm.controls['frmDetail'].setValue(objDetail);
    } else {
      debugger;
      var dvcNo = this._util.removeSpace(objDetail.deviceNumber);
      if (dvcNo != '' && dvcNo != null && dvcNo != undefined) {
        var dvcList: any[] = dvcNo.split(',');
        debugger;
        var duplist=this.getDuplicate(dvcList);
        this.deviceNumberDuplicate=duplist.join(',');

        var uniqueDvc=this.getUnique(dvcList);

        objDetail.deviceNumber = uniqueDvc.join(',');
        objDetail.quantity = uniqueDvc.length;
        // objDetail.quantity = dvcNo.split(',').length;
        this.frm.controls['frmDetail'].setValue(objDetail);
      }

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
        objDetail.totalAmount = totalAmt;
        // this.frm.controls['payableAmount'].setValue(totalAmt);
        // this.frm.controls['totalAmount'].setValue(totalAmt);
        this.details.push(objDetail);
        var ttlAmt = 0, ttldscnt = 0;
        if (this.details.length > 0) {
          this.details.forEach((item) => {
            ttlAmt += item.totalAmount;
            ttldscnt += item.discount;
          });
          this.frm.controls['netTotal'].setValue(ttlAmt);
          this.frm.controls['totalAmount'].setValue(ttlAmt);
          this.frm.controls['totalDiscount'].setValue(ttldscnt);
        }
      }
    }
  }

  getDuplicate(arry:any[]) {
    //const arry = [1, 2, 1, 3, 4, 3, 5];
    const toFindDuplicates = (arry: any[]) => arry.filter((item, index) => arry.indexOf(item) !== index)
    const duplicateElementa = toFindDuplicates(arry);
    return duplicateElementa;
  }

  getUnique(arry:any[]){
    var uniqueDvc: any[] = [...new Map(arry.map(item => [item, item])).values()];
    return uniqueDvc;
  }

  removeRow(index: number): void {
    this.details.splice(index, 1); // 'index' is the index of the row you want to remove
  }

  editDtl = (item: any) => {

    var frmDetail = this.frm.controls['frmDetail'].value;
    frmDetail.id = item.id;
    frmDetail.prdProductId = item.prdProductId;
    frmDetail.quantity = item.quantity;
    frmDetail.rate = item.rate;
    frmDetail.invWarrantyPeriodId = item.invWarrantyPeriodId;
    frmDetail.deviceNumber = item.deviceNumber;
    frmDetail.slsChallanId = item.slsChallanId;

    this.frm.controls['frmDetail'].setValue(frmDetail);

    this.setProductModel();
  }

  toggle() {
    this.show = !this.show;

    // Change the name of the button.
    if (this.show)
      this.buttonName = "Add More Serial";
    else
      this.buttonName = "Map Serial";
  }

  intNumber(event: any) {
    const reg = /^(?:[1-9]\d*|\d)$/;///^\d*(\.\d+)?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  decimalNumber(event: any) {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  setProductModel() {

    var obj = this.frm.value;
    var objDetail = obj.frmDetail;

    this.progressStatus = false;
     //old shariful
    //let objProduct = this.products.find(w => w.prdProductModelId === objDetail.prdProductModelId);

    //new: 27012024
    //objDetail.productName=this.frm.controls['productName'].value;

    let objProduct = this.products.find(w => w.name === objDetail.productName);

    objDetail.name = objProduct.name;
    objDetail.prdProductId = objProduct.id;
    objDetail.prdProductModelId = objProduct.prdProductModelId;
    this.frm.controls['frmDetail'].setValue(objDetail);
    this.getProdStock(obj);
    this.getStockDevice();
    this.changeDeviceInput('isFromList');
  }

  saveChallan() {

    if (this.details.length == 0) {
      this.toastrService.error("No Item found"); return false;
    }

    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        // var deviceNumber= this.frm.controls['deviceNumber'].value;
        // this.frm.controls['deviceNumber'].setValue(deviceNumber);

        var obj = this.frm.value;
        if (obj.id > 0) {
          obj.modifiedBy = this.auth.getUserId()
        } else {
          obj.createdBy = this.auth.getUserId()
          obj.createdDate = new Date();
        }

        let requestBody = { obj: obj, list: this.details };
        this.gSvc.postdata("Inventory/Challan/SaveChallan", requestBody).subscribe(res => {
          this.search();
          if (res.success) {

            //Asad Commented On 10.01.2023
            //this.resetCheck();

            //Asad added On 10.01.2023
            this.unassignedStockDeviceList = [];
            var obj = this.frm.value;
            this.frm.controls['slsCustomerId'].setValue('');
            var objDetail = obj.frmDetail;
            objDetail.stockQuantity = '';
            objDetail.salesRate = '';
            objDetail.quantity = '';
            objDetail.rate = '';
            objDetail.deviceNumber = '';
            this.frm.controls['frmDetail'].setValue(objDetail);
            this.setProductModel();
            //End


            //Asad Commented On 10.01.2024
            //this.frm.reset();

            this.details = [];
            this.toastrService.success("Successfull Challan");
            // this.reload();
          } else {
            this.toastrService.error(res.message);
          }
        }, err => {
          this.toastrService.error(err.message);
          console.log('Exception: (save)' + err.message);
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }

  edit(item: any) {

    //this.frm.patchValue(id);
    //this.details=[];
    this.gSvc.postdata("Inventory/Challan/GetChallanDetailByChallanId/" + item.id + "", {}).subscribe((res: any) => {
      if (res.length > 0) {
        var dtl: any[] = [];
        dtl = res;
        var ttlamt = 0;
        dtl.forEach(items => {
          items.total = items.quantity * items.rate;
          items.totalAmount = items.total - (items.discount == null ? 0 : items.discount);
          ttlamt += items.totalAmount;
        });
        this.details = res;
        var model = res[0];
        this.frm.controls['id'].setValue(item.id);
        this.frm.controls['refNo'].setValue(item.refNo);
        this.frm.controls['cmnStoreId'].setValue(model.cmnStoreId);
        this.frm.controls['slsCustomerId'].setValue(item.slsCustomerId);
        this.frm.controls['cmnCompanyId'].setValue(this.auth.getCompany());
        this.frm.controls['cmnFinancialYearId'].setValue(item.cmnFinancialYearId);
        this.frm.controls['createdBy'].setValue(this.auth.getUserId());
        this.frm.controls['createdDate'].setValue(new Date());
        //this.frm.controls['paidStatus'].setValue(item.paidStatus); 
        this.frm.controls['date'].setValue(this._util.DateConvert(item.date));
        this.frm.controls['totalAmount'].setValue(item.totalAmount);
        this.frm.controls['totalDiscount'].setValue(item.totalDiscount);
        this.frm.controls['remarks'].setValue(item.remarks);
        this.frm.controls['netTotal'].setValue(ttlamt);
      } else {
        this.reset();
      }
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (edit)' + err.message);
    })
  }
  prodStock: number = 0;
  getProdStock(prod: any) {
    var objDetail = prod.frmDetail;
    var obj = {
      //cmnCompanyId: this.auth.getCompany(),
      companyId: this.auth.getCompany(),
      cmnFinancialYearId: 1,
      cmnStoreId: prod.cmnStoreId,
      prdProductId: objDetail.prdProductId,
      productModelId: objDetail.prdProductModelId
    };
    this.gSvc.postdata("Inventory/Challan/GetCurrentStockByParam", JSON.stringify(obj)).subscribe((res: any) => {

      objDetail.stockQuantity = res.currentStock;
      objDetail.salesRate = res.salesRate;
      objDetail.rate = res.salesRate;
      this.frm.controls['frmDetail'].setValue(objDetail);
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getProdStock)' + err.message);
    })
  }

  searchDevice: string = '';

  unassignedStockDeviceList: any[] = [];

  getStockDevice() {
    var prd = this.frm.controls['frmDetail'].value;
    var param = {
      cmnCompanyId: this.auth.getCompany(),
      productId: prd.prdProductId,
      productModelId: prd.prdProductModelId
    };
    this.gSvc.postparam("Inventory/Purchase/GetCurrentStockDeviceByCompanyId", param).subscribe((res: any) => {
      this.unassignedStockDeviceList = res;
      this.progressStatus = true;
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getStockDevice)' + err.message);
    })
  }

  companies: any[] = [];
  getCompany() {
    this.gSvc.postdata("Common/Company/GetClientByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
      this.companies = res;
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getCompany)' + err.message);
    })
  }
  // challanSearchList(obj: any) {
  //   this.gSvc.postdata("Inventory/Challan/ChallanSearch", { obj }).subscribe(res => {
  //     this.challanList = res;
  //   }, err => {
  //     this.toastrService.error(err.message);
  //     console.log('Exception: (challanSearchList)' + err.message);
  //   })
  // }
  getStore() {
    this.gSvc.postdata("Common/Store/GetByCompanyId/" + this.auth.getCompany(), {}).subscribe(res => {
      this.storeList = res;
      this.frm.controls['cmnStoreId'].setValue(this.storeList[0].id);
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getStore)' + err.message);
    })
  }

  getProducts() {
    this.gSvc.postdata("Inventory/Product/GetTransactionableProducts", {}).subscribe(res => {

      this.products = res;

      console.log('products: ' + JSON.stringify(res));

    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getProducts)' + err.message);
    })
  }
  search() {

    var obj = this.searchFrm.value;
    obj.cmnCompanyId = this.auth.getCompany();
    this.gSvc.postdata("Inventory/Challan/SearchChallan", JSON.stringify(obj)).subscribe(res => {

      this.challanList = res;
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (search)' + err.message);
    })
  }


  // getItemCategory() {
  //   this.gSvc.getdata("api/GeneralServices/ItemCategory").subscribe(res => {
  //     this.itemCategory = res;

  //   }, err => {
  //     this.toastrService.error("error");
  //   })
  // }

  // getItemModelList() {
  //   this.gSvc.postdata("api/ItemModel/ItemModels", {}).subscribe(res => {
  //     this.itemModelList = res;

  //   }, err => {
  //     this.toastrService.error("Item Model List Not Found");
  //   })
  // }

  // getBrandList() {
  //   this.gSvc.postdata("api/ItemBrand/ItemBrands", {}).subscribe(res => {
  //     this.brandList = res;

  //   }, err => {
  //     this.toastrService.error("Item Brand List Not Found");
  //   })

  // }

  getWarranty() {
    this.gSvc.postdata("Inventory/WarrantyPeriod/GetAll", {}).subscribe(res => {
      this.warrentyList = res;

    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getWarranty)' + err.message);
    })
  }

  //   itemBulkUpload() {
  //     this.displayItemBulkModal = true;
  //     //this.reset();
  // /*    this.gSvc.postdata("api/Item/Item/" + id + "", {}).subscribe((res: any) => {
  //       this.viewInfo = res;
  //     }, err => {
  //       this.toastrService.error("Error! Data Not Found");
  //     })*/
  // }

  importProducts($event: any) {

    var unassignDeviceCount = this.unassignedStockDeviceList.length;
    if (unassignDeviceCount == 0) {
      this.toastrService.warning('Purchased devices are not available.');
      return;
    }
    this.unassignedStockDeviceList.forEach((item) => {
      item.isActive = false;
    });

    const files = $event.target.files;
    var devices = '';

    if (files.length) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (event: any) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;

        if (sheets.length) {

          this.isUploadExcel = false;

          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          if (rows != undefined && rows.length) {
            //var devices = '';
            var qty = 0;
            for (var i = 0; i < rows.length; i++) {
              var obj: any = { productName: '', deviceNumber: '' };

              obj = rows[i];

              if (obj.DeviceNumber != undefined) {
                qty++;
                if (devices != '') {
                  devices += ',' + obj.DeviceNumber;
                } else {
                  devices = obj.DeviceNumber;
                }
              }
            }

            var obj2 = this.frm.value;
            var objDetail = obj2.frmDetail;
            objDetail.deviceNumber = devices;
            objDetail.quantity = qty;

            //new:start
            var dvcList: any[] = devices.split(',');
            this.unassignedStockDeviceList.forEach((item) => {
              for (let i = 0; i < dvcList.length; i++) {
                if (dvcList[i] == item.deviceDisplayNumber) {
                  item.isActive = true;
                  this.stbCounter = this.stbCounter + 1;
                }
              }
            });
            this.unassignedStockDeviceList = this.unassignedStockDeviceList.sort((b, a) => a.isActive - b.isActive);
            this.checkIfExist();
            //end
            this.frm.controls['frmDetail'].setValue(objDetail);

          }
        }
      }
      reader.readAsArrayBuffer(file);

    }
  }



  // submitForm() {    
  //   const formData: FormData = new FormData();
  //   //formData.append("cardNumber", "asjalkd")
  //   formData.append('fileSource', this.fileToUpload);
  //   //return this.gSvc.postdatafile('Inventory/Challan/UploadFile', formData).subscribe(() => alert("File uploaded"));
  //   this.gSvc.postdatafile('Inventory/Challan/UploadFile', formData).subscribe(res => {
  //     var obj = this.frm.value;
  //     var objDetail=obj.frmDetail;
  //     objDetail.deviceNumber=res.message;
  //     this.frm.controls['frmDetail'].setValue(objDetail);
  //   }, err => {
  //     this.toastrService.error("There is problem");
  //   })
  // }

  // handleFileInput(event: Event) {
  //   // Access the file from the event object
  //   const target = event.target as HTMLInputElement;
  //   const file: File | null = target.files?.[0] || null;

  //   if (file) {
  //     this.fileToUpload = file;
  //     // Handle the file
  //     // You can access the file properties like file.name, file.size, etc.
  //     this.submitForm();
  //   } else {
  //     alert("Error");
  //     // No file selected or an error occurred
  //   }
  // }



  // itemTypeImportSave () {
  //   console.log('ok');
  // }

  // onclick(event: any) {
  //   if (event.target.checked == true) {
  //     this.isDisplayed = true;
  //   }
  //   else {
  //     this.isDisplayed = false;
  //   }
  // }

  reload() {
    location.reload();
  }
  reset() {

  }

  resetCheck() {
    this.unassignedStockDeviceList.forEach((item) => {
      item.isActive = false
    });
  }

  clear(table: Table) {
    table.clear();
  }

  changeDeviceInput = (frmString: string) => {
    if (frmString == 'isUploadExcel') {
      this.isUploadExcel = true;
      this.isSequence = false;
      this.isFromList = false;
    }
    else if (frmString == 'isSequence') {
      this.isUploadExcel = false;
      this.isSequence = true;
      this.isFromList = false;
    }
    else if (frmString == 'isFromList') {
      this.isUploadExcel = false;
      this.isSequence = false;
      this.isFromList = true;
    }

  }

  //Collection Modal
  challanModel: any;
  collectionId: number = 0;
  collectionRemarks: string = '';
  isCollectionModal: boolean = false;
  collectionList: any[] = [];
  collectionHistoryList: any[] = [];

  selectedRow:any;
  //Newly Added By Asad 30.11.2023
  loadCollectionModal(id: any) {
    this.selectedRow=id;
    var param = {
      challanId: id
    };

    this.gSvc.postparam("api/DueCollection/GetChallanForCollectionByChallanId", param).subscribe(res => {

      this.isCollectionEnable = true;
      this.collectionEntity = undefined;
      this.collectionId = 0;
      this.collectionRemarks = '';
      this.challanModel = res;
      this.loadCollection(res);
      this.loadCollectionHistory(res);
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getChallanDetail)' + err.message);
    });
  }



  // Old
  // loadCollectionModal(item: any) {
  //   this.isCollectionEnable = true;
  //   this.collectionEntity = undefined;
  //   this.collectionId = 0;
  //   this.collectionRemarks = '';
  //   this.loadCollection(item);
  //   this.loadCollectionHistory(item);
  // }

  loadCollection(item: any) {
    this.challanModel = item;
    var param = {
      companyId: this.auth.getCompany(),
      collectionId: this.collectionId == 0 ? null : this.collectionId
    };


    console.log(JSON.stringify(param));

    this.gSvc.postparam("api/DueCollection/GetCollectionDetailByCompanyAndCollectionId", param).subscribe(res => {

      this.collectionList = res;

      this.isCollectionModal = true;
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (loadCollection)' + err.message);
    });
  }

  loadCollectionHistory(item: any) {
    var obj = {
      cmnCompanyId: this.auth.getCompany(),
      partyId: item.slsCustomerId
    };
    this.gSvc.postdata("api/DueCollection/SearchCollection", obj).subscribe(res => {

      this.collectionHistoryList = res;
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (loadCollectionHistory)' + err.message);
    })
    //this.isCollectionModal = true;

  }

  isCollectionEnable: boolean = true;
  checkAmount(item: any) {

    // var rcvd=this.challanModel.receiveAmount;
    if (this.collectionId == 0) {
      if (item.amount > this.challanModel.dueAmount) {
        item.amount = this.challanModel.dueAmount;
      }
    } else {
      var rcvbl = this.challanModel.dueAmount + this.collectionEntity.totalAmount;
      if (item.amount > rcvbl) {
        item.amount = rcvbl;
      }
    }

    this.isCollectionEnable = this.collectionList.filter(x => x.amount > 0).length > 0 ? false : true;
  }

  saveCollection() {
    var gCollectionList = this.collectionList.filter(x => x.amount > 0);
    if (gCollectionList.length == 0) { this.toastrService.error("No Item found"); return false; }
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var ttlAmnt = 0;
        gCollectionList.forEach((mdl) => {
          ttlAmnt += mdl.amount;
        });
        var mstr = {
          id: this.collectionId,
          slsChallanId: this.challanModel.id,
          memoNo: this.collectionId == 0 ? 'memo' : this.collectionEntity.memoNo,
          date: new Date(),
          totalAmount: ttlAmnt,
          remarks: this.collectionRemarks,
          createdBy: this.auth.getUserId(),
          createdDate: new Date(),
          modifiedBy: this.auth.getUserId()
        };

        var listCollection: any = [];
        this.collectionList.forEach((item) => {
          listCollection.push({
            id: 0,
            slsDueCollectionId: item.slsDueCollectionId,
            anFChartOfAccountId: item.anFChartOfAccountId,
            amount: item.amount
          });
        });
        let requestBody = { obj: mstr, list: this.collectionList };
        this.gSvc.postdata("api/DueCollection/Save", requestBody).subscribe(res => {

          if (res.success) {
            this.collectionList = [];
            this.collectionRemarks = '';

            //this.challanModel.dueAmount -= this.collectionEntity.totalAmount; //Asad Commented

            this.collectionEntity = undefined;
            this.search();

            this.collectionId = 0;
            this.loadCollectionModal(requestBody.obj.slsChallanId); //Asad added on 30.11.2023


            this.toastrService.success("Collection Successfully");
          } else {
            this.toastrService.error(res.message);
            console.log('Exception: (saveCollection)' + res.message);
          }
        }, err => {
          this.toastrService.error(err.message);
          console.log('Exception: (saveCollection)' + err.message);
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }
  collectionEntity: any;
  editCollectionHistory(entity: any) {

    this.challanModel = this.challanList.filter(x => x.id == entity.slsChallanId)[0];
    this.collectionRemarks = entity.remarks;
    this.collectionId = entity.id;
    this.collectionEntity = entity;
    this.loadCollection(this.challanModel);
  }
  //Collection Modal

  //Challan Life Cycle
  isChallanLifeCycleModal: boolean = false;
  challanLifeCycleList: any[] = [];
  loadChallanLifeCycle(item: any) {
    this.selectedRow=item.id;
    this.challanModel = item;
    var param = {
      challanId: this.challanModel.id
    };
    this.gSvc.postparam("Inventory/Challan/GetChallanReturnReceiveHistory", param).subscribe(res => {

      this.challanLifeCycleList = res;

      this.isChallanLifeCycleModal = true;
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (loadCollection)' + err.message);
    });
  }
  //Challan Life Cycle

  //Report Execution
  public displayModal: boolean = false;
  public _getReportUrl: string = 'reportviewer/reportviewer/gettestreport';
  loadReportIn(item: any) {
    this.selectedRow=item.id;
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

  // @ViewChild('reportChallan') _reportChallan!: ElementRef;
  // openInNewTab() {
  //   //var document=Document;
  //   var newWindowContent: any = this._reportChallan.nativeElement.innerHTML;
  //   var newWindow: any = window.open("", "", "width=500,height=400");
  //   newWindow.document.write(newWindowContent);
  // }
  //Report Execution

  exportToExcel(): void {
    const columnsToExport: any[] = ['refNo', 'date', 'clientName', 'payableAmount'];
    this.exportService.exportToExcel(this.challanList, 'subscriber_invoice', columnsToExport);
  }
}