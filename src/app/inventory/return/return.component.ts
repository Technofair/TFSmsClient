import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import {read, utils} from "xlsx";

@Component({
  selector: 'app-challan',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.css'],
  providers: [ConfirmationService]
})
export class ReturnComponent implements OnInit {
//---------------------------------------
show: boolean = true;
  buttonName: any = 'Map Serial';
  details: any[] = [];
  supplierList: any[] = [];
  storeList: any[] = [];
  products: any[] = [];
  movies: any[] = [];
  displayItemBulkModal: boolean = false;
  warrentyList: any;
  ingredient: any;
  quantity: any;
  rate: any;
  total: any;
  fileToUpload: any;
  isDisplayed: boolean = false;
//--------------------------------------
  itemCategory: any;
  itemList: any;
  brandList: any;
  itemTypeList: any;
  itemModelList: any;
  boxTypeList: any;
  organizationList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
 frm!:FormGroup
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService) {
    this.getOrganizationList();
  }
  ngOnInit(): void {
    this.frmcreate();
    this.getOrganizationList();
  }
  frmcreate(){
    this.frm = this.fb.group({
      id: new FormControl(""),
    itemName: new FormControl(""),
    itemBrandId: new FormControl(""),
    itemTypeId: new FormControl(""),
    itemModelId: new FormControl(""),
    itemCategoryId: new FormControl(""),
    cardTypeId: new FormControl(""),
    cartonNo: new FormControl(""),
    remarks: new FormControl(""),
    isActive: new FormControl(),
    itemShortName: new FormControl(),
    frmDetail: this.fb.group({
      id: new FormControl(0),
      invPurchaseId: new FormControl(0),
      prdProductId: new FormControl([Validators.required]),
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
      startRange:new FormControl(),
      endRange:new FormControl(),
      name: new FormControl(),
      deviceNumber: new FormControl(''),
      productModel: new FormControl(),
      total: new FormControl(),
      filePath: new FormControl()
    }),
    });
  }

  save() {
    // if (this.frm.invalid) return false;
    // this.confirmationService.confirm({
    //   message: 'Are you sure that you want to proceed?',
    //   header: 'Confirmation',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     if (this.formId == 0) {
    //       this.gSvc.postdata("api/Item/AddItem", JSON.stringify(this.frm.value)).subscribe(res => {
    //         this.frm.reset();
    //         this.getItem();
    //         this.toastrService.success("Item Saved");
    //       }, err => {
    //         this.toastrService.error("Error ! Item Not Saved");
    //       })
    //     } else if (this.formId == 1) {
    //       this.gSvc.postdata("api/Item/UpdateItem", JSON.stringify(this.frm.value)).subscribe(res => {
    //         this.frm.reset();
    //         this.formId = 0;
    //         this.getItem();
    //         this.toastrService.success("Item Updated");
    //       }, err => {
    //         this.toastrService.error("Error! Item Not Updated");
    //       })
    //     } else {
    //       this.toastrService.error("Error");
    //     }
    //     return true;
    //   },
    //   reject: () => {

    //   }

    // })
    // return false;
  }

  edit(id: any) {
    // this.formId = 1; 
    // this.gSvc.postdata("api/Item/Item/" + id + "", {}).subscribe((res: any) => {
    //   this.frm.controls['itemName'].setValue(res.name);
    //   this.frm.controls['itemCategoryId'].setValue(res.itemCategoryId);
    //   this.frm.controls['itemBrandId'].setValue(res.itemBrandId);
    //   this.frm.controls['itemTypeId'].setValue(res.itemTypeId);
    //   this.frm.controls['itemModelId'].setValue(res.itemModelId);
    //   this.frm.controls['isActive'].setValue(res.isActive == "Y" ? true : false);
    //   this.frm.controls['isCardBase'].setValue(res.isCardBase);
    //   this.frm.controls['cartonNo'].setValue(res.cartonNo);
    //   this.frm.controls['remarks'].setValue(res.remarks);
    //   this.frm.controls['id'].setValue(res.id);
    // }, err => {
    //   this.toastrService.error("error");
    // })
  }

  getOrganizationList() {
    this.gSvc.postdata("api/Organization/Organizations", {}).subscribe(res => {
      this.organizationList = res;
      console.log(res);
    }, err => {
      this.toastrService.error("Error! Charge Amount list not found");
    })
  }

  showModalDialog(id: any) {
    // this.displayModal = true;
    // this.reset();
    // this.gSvc.postdata("api/Item/Item/" + id + "", {}).subscribe((res: any) => {
    //   this.viewInfo = res;
    // }, err => {
    //   this.toastrService.error("Error! Data Not Found");
    // })
  }
  setProductModel(){
    var obj = this.frm.value;
    var objDetail=obj.frmDetail;
     //objDetail = this.frm.get('frmDetails')?.value;
    //const productId = this.frm.get('prdProductId')?.value;
    let objProduct = this.products.find(w => w.id === objDetail.prdProductId);
    objDetail.name=objProduct.name;
    objDetail.prdProductModelId=objProduct.prdProductModelId
    this.frm.controls['frmDetail'].setValue(objDetail);

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
  onclick(event: any) {
    if (event.target.checked == true) {
      this.isDisplayed = true;
    }
    else {
      this.isDisplayed = false;
    }
  }
  addSerial(): void {
    var devices='';
    var obj = this.frm.value;
    var objDetail=obj.frmDetail;
    var deviceID=objDetail.deviceNumber;
    var startRange=objDetail.startRange;
    var endRange=objDetail.endRange;
    for(var i= startRange; i<=endRange;i++){
       
       if(devices !='')
       {
        devices +=","+ deviceID+i;
       }else{
        devices = deviceID+i;
       }
    }
         
          objDetail.deviceNumber=devices;
          objDetail.startRange='';
          objDetail.endRange='';
          this.frm.controls['frmDetail'].setValue(objDetail);

  };
  importProducts($event: any) {
    //console.log('yes');
    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;
        
        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
            if(rows !=undefined && rows.length)
            {
              var devices='';
              var qty=0;
              for(var i=0;i<rows.length;i++)
            {
              var obj:any={productName:'',deviceNumber:''};
              obj=rows[i];
              if(obj.DeviceNumber !=undefined){
                qty++;
              if(devices !='')
              {
                devices +=','+obj.DeviceNumber;
            }else{
              devices=obj.DeviceNumber;
            }
          }
        }
  
          var obj = this.frm.value;
          var objDetail=obj.frmDetail;
          objDetail.deviceNumber=devices;
          objDetail.quantity=qty;
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
  addRow(): void {
    //const objDetail = this.frm.get('frmDetail')?.value;
    //let userName = this.frm.controls['frmOrdDetails'].value.prdProductId;
    //console.log(userName);

    var obj = this.frm.value;
    var objDetail=obj.frmDetail;
    objDetail.cmnStoreId=this.frm.get('cmnStoreId')?.value;
    objDetail.total=(objDetail.rate * objDetail.quantity);
    debugger;
    var totalAmt=obj.totalAmount==undefined?0:obj.totalAmount;
    totalAmt +=objDetail.total;
    this.frm.controls['totalAmount'].setValue(totalAmt);

    const results = this.details.filter((element: any) => {
      if (element.prdProductId === objDetail.prdProductId ) {
        return true;
      }
      return false;
    });

    if (results.length>0) {
      this.toastrService.info("Please input complete data!");
      // alert(results);
    } else {
      this.details.push(objDetail);
    }
  }

  reload() {
    // this.formId = 0;
    // this.router.navigateByUrl('/inventory/item')
  }
  reset() {
    // this.frm.reset();
    // this.frm.controls['id'].setValue(0);
    // this.frm.markAsPristine();
  }
  
  clear(table: Table) {
    // table.clear();
  }
}