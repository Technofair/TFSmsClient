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
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css'],
  providers: [ConfirmationService]
})

export class PurchaseComponent implements OnInit {
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
  purchaseList: any;
  suppliers: any
  hasDeviceID:any;

  @ViewChild('fileInput', { static: false })
  myFileInput!: ElementRef;


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
    
  }

  ngOnInit(): void {

    this.getSupplier();
    this.getStore();
    this.getProducts();
    this.getWarrantyPeriods();

    this.frmCreate();
    this.frmSearch();
    this.search();
    //this.warrentyList = [{ 'id': 1, "name": 'Not Applicable' }, { 'id': 1, "name": '6 M' }, { 'id': 2, "name": '1 Y' }]
  }
 /* frmCreate() {
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
      remarks: new FormControl('',Validators.maxLength(100)),
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
  }*/
  frmCreate() {
    this.frm = this.fb.group({
      id: new FormControl(0),
      refNo: new FormControl(""),
      lCNo: new FormControl(),
      cmnCompanyId: new FormControl(this.auth.getCompany()),
      cmnFinancialYearId: new FormControl(0),
      invSupplierId: new FormControl("", Validators.required),
      date: new FormControl(new Date(), [Validators.required]),
      totalPrice: new FormControl(0),
      challanNo: new FormControl(),
      transportCharge: new FormControl(),
      otherCharge: new FormControl(),
      deduct: new FormControl(),
      payableAmount: new FormControl(),
      paidAmount: new FormControl(),
      dueAmount: new FormControl(),
      remarks: new FormControl(),
      status: new FormControl(0),
      createdBy: new FormControl(),
      createdDate: new FormControl(new Date()),
      modifiedBy: new FormControl(),
      modifiedDate: new FormControl(),
      rate: new FormControl(),
      quantity: new FormControl(''),
      total: new FormControl(),
      filePath: new FormControl(),
      totalAmount: new FormControl(),
      cmnStoreId: new FormControl(Validators.required),
      frmDetail: this.fb.group({
        id: new FormControl(0),
        invPurchaseId: new FormControl(0),
        prdProductId: new FormControl(),
        invUnitId: new FormControl(1),
        // cmnStoreId: new FormControl(),
        prdProductModelId: new FormControl("", Validators.required),
        quantity: new FormControl([Validators.required, Validators.pattern("^[0-9]*$")]),
        rate: new FormControl("", Validators.required),
        expireDate: new FormControl(),
        specification: new FormControl(),
        invWarrantyPeriodId: new FormControl("", Validators.required),
        salesRate: new FormControl("", Validators.required),
        isSequence: new FormControl(),
        startRange: new FormControl(),
        endRange: new FormControl(),
        name: new FormControl(),
        deviceNumber: new FormControl(''),
        productModel: new FormControl(),
        productName: new FormControl(),
        total: new FormControl(),
        filePath: new FormControl()
      }),

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
  getSuppliers() {
    this.gSvc.postdata("Inventory/Supplier/GetAll", {}).subscribe(res => {
      this.suppliers = res
    }, err => {
      this.toastrService.error("Error! Data list Not Found");
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
    this.details[index].total.setValue(rowData.rate * rowData.quantity);
    // var totalAmt=obj.totalAmount==undefined?0:obj.totalAmount;
    // totalAmt +=objDetail.total;
    // this.frm.controls['totalAmount'].setValue(totalAmt);

    //var obj = this.frm.value;
    //var objCal = obj.frm;
    // const rate = objCal.get('rate').value;
    // const quantity = objCal.get('quantity').value;
    //objCal.get('total').setValue(rowData.rate * rowData.quantity);
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

    objDetail.deviceNumber = devices.trim();
    objDetail.startRange = '';
    objDetail.endRange = '';
    this.frm.controls['frmDetail'].setValue(objDetail);

  };

  addRow(): void {
    
   
    var obj = this.frm.value;
    var objDetail = obj.frmDetail;
    

  //NEW    
    
    if(objDetail.prdProductId == ""||objDetail.prdProductId ==null)
    {
      this.toastrService.warning("Please Select Product!");
      return;
    }

    // if(objDetail.quantity == "")
    // {
    //   this.toastrService.warning("Quantity is required!");
    //   return;
    // }

    if(objDetail.rate == "") 
    {
      this.toastrService.warning("Buy rate is required!");
      return;
    }
    if(objDetail.salesRate == "") 
    {
      this.toastrService.warning("Sales Rate is required!");
      return;
    }
    if(objDetail.invWarrantyPeriodId == "") 
    {
      this.toastrService.warning("Warranty Period is required!");
      return;
    }
    if( this.hasDeviceID == true && (objDetail.deviceNumber.trim() == '' || objDetail.deviceNumber.trim() === 'undefined'))
    {
      this.toastrService.warning("Please enter device number!");
      return;
    } 
      
    objDetail.cmnStoreId = this.frm.get('cmnStoreId')?.value;


    if(objDetail.deviceNumber){
      var quantity = objDetail.deviceNumber.split(',').length; 
      objDetail.quantity = quantity;
    }


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
    } 
    else {

      //New
  

      
      // var totalAmt = obj.payableAmount == undefined ? 0 : obj.payableAmount;
       var totalAmt=0;
     // totalAmt += objDetail.total;
      objDetail.deviceNumber = objDetail.deviceNumber.trim();
      
      // obj.payableAmount = totalAmt;
      // this.frm.controls['frm'].setValue(obj);

     // this.frm.controls['payableAmount'].setValue(totalAmt);
    
     
      this.details.push(objDetail);
      this.details.forEach(element => {
        totalAmt=totalAmt+element.total;
      //  obj.payableAmount=obj.payableAmount+element.total;
      });
      this.frm.controls['payableAmount'].setValue(totalAmt);
      // for(var i=0;this.details.length>i,i++;){
      //   totalAmt =totalAmt+this.details[i].total;
      // }
      

      this.frm.controls['frmDetail'].setValue(objDetail);
      
    }

       

  }

  removeRow(rowData: any): void {
    var totalAmt=0;
    // var totalAmt=this.frm.controls['payableAmount'].value;
    //  totalAmt=totalAmt-rowData.total;
    var index=rowData.index;
    this.details.splice(index, 1); // 'index' is the index of the row you want to remove
    this.details.forEach(element => {
      totalAmt=totalAmt+element.total;
    //  obj.payableAmount=obj.payableAmount+element.total;
    });
    this.frm.controls['payableAmount'].setValue(totalAmt);
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

  setProductModel(res:any) {
    var obj = this.frm.value;
    var objDetail = obj.frmDetail;
    //objDetail = this.frm.get('frmDetails')?.value;
    //const productId = this.frm.get('prdProductId')?.value;
    let objProduct = this.products.find(w => w.name === objDetail.productName);
    this.hasDeviceID= objProduct.hasDeviceID    
    objDetail.name = objProduct.name;
    objDetail.prdProductId = objProduct.id;
    objDetail.prdProductModelId = objProduct.prdProductModelId
    this.frm.controls['frmDetail'].setValue(objDetail);
  }

  savePurchase() {
    // if (this.frm.invalid) return false;
    // console.log(this.frm.value);
    if (this.details.length == 0) { this.toastrService.error("No Item found"); return false; }
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        var obj = this.frm.value;
        if (obj.id > 0) {
          obj.modifiedBy = this.auth.getUserId()
        } else {
          obj.createdBy = this.auth.getUserId()
          obj.createdDate = new Date();
        }

        let requestBody = { obj: obj, list: this.details };
        this.gSvc.postdata("Inventory/Purchase/savePurchase", requestBody).subscribe(res => {
          this.search();
          if (res.success) {
            this.toastrService.success(res.message);
            alert(res.message);
            this.frm.reset();
            this.details = [];
            location.reload();
          } else {
            this.toastrService.error(res.message);
          }
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

  getSupplier() {
    this.gSvc.postdata("Inventory/Supplier/GetAll", {}).subscribe(res => {
      this.supplierList = res;
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getSupplier)' +  err.message);
    })
  }
  purchaseSearchList(obj: any) {
    this.gSvc.postdata("Inventory/Purchase/PurchaseSearch", { obj }).subscribe(res => {
      this.purchaseList = res;
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (purchaseSearchLis)' +  err.message);
    })
  }
  getStore() {
    this.gSvc.postdata("Common/Store/GetByCompanyId/"+ this.auth.getCompany(), {}).subscribe(res => {
      this.storeList = res;
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getStore)' +  err.message);
    })
  }

  getProducts() {
    debugger;
    this.gSvc.postdata("Inventory/Product/GetTransactionableProducts", {}).subscribe(res => {
      this.products = res;
     
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getProducts)' +  err.message);
    })
  }

 
  getWarrantyPeriods() {
    this.gSvc.postdata("Inventory/WarrantyPeriod/GetAll", {}).subscribe(res => {
      this.warrentyList = res;

    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (getWarranty)' +  err.message);
    })
  }
  search() {
    var obj = this.searchFrm.value;
    obj.cmnCompanyId = this.auth.getCompany();
    this.gSvc.postdata("Inventory/Purchase/PurchaseSearch", JSON.stringify(obj)).subscribe(res => {
      
      this.purchaseList = res;
    }, err => {
      this.toastrService.error(err.message);
      console.log('Exception: (search)' +  err.message);
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



  //   itemBulkUpload() {
  //     this.displayItemBulkModal = true;
  //     //this.reset();
  // /*    this.gSvc.postdata("api/Item/Item/" + id + "", {}).subscribe((res: any) => {
  //       this.viewInfo = res;
  //     }, err => {
  //       this.toastrService.error("Error! Data Not Found");
  //     })*/
  // }

  resetFile(){
    this.myFileInput.nativeElement.value = '';
  }

  importProducts($event: any) {

    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;

        if (sheets.length) {

          //alert('greater');

          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          if (rows != undefined && rows.length) {
            var devices = '';
            var qty = 0;
            for (var i = 0; i < rows.length; i++) {
              var obj: any = { productName: '', deviceNumber: '' };
              obj = rows[i];
              if (obj.DeviceNumber != undefined) {
                qty++;
                if (devices != '') {
                  devices += ',' + obj.DeviceNumber.trim();
                } else {
                  devices = obj.DeviceNumber.trim();
                }
              }
            }

            var obj = this.frm.value;
            var objDetail = obj.frmDetail;
            objDetail.deviceNumber = devices.trim();
            objDetail.quantity = qty;
            this.frm.controls['frmDetail'].setValue(objDetail);

            //console.log(rows);
            //this.movies = rows;

            /*  this.gSvc.postdata("api/ItemType/UpdateItemType", JSON.stringify(this.frm.value)).subscribe(res => {
                this.frm.reset();
                this.getItemtype();
              }*/
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
  //   //return this.gSvc.postdatafile('Inventory/Purchase/UploadFile', formData).subscribe(() => alert("File uploaded"));
  //   this.gSvc.postdatafile('Inventory/Purchase/UploadFile', formData).subscribe(res => {
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

  onclick(event: any) {
    if (event.target.checked == true) {
      this.isDisplayed = true;
    }
    else {
      this.isDisplayed = false;
    }
  }

  reload() {
    this.router.navigateByUrl('/inventory/purchase')
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
    this.exportService.exportToExcel(this.purchaseList, 'subscriber_invoice', columnsToExport);
  }
}