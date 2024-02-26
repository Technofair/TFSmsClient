import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
  providers: [ConfirmationService]
})
export class ItemComponent implements OnInit {
  categories: any[] = [];
  brands: any[] = [];
  formId: any;
  frm!: FormGroup;
  items: any[] = [];
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService, private auth: AuthService) {


  }



  ngOnInit(): void {
    this.formId = 0;
    this.frm = this.fb.group({
      id: new FormControl(0),
      cmnCompanyId:new FormControl(this.auth.getCompany()),
      name: new FormControl(""),
      prdProductId: new FormControl(0),
      prdBrandId: new FormControl(0),
      isWarrantyable: new FormControl(true),
      isActive: new FormControl(true),
      isCard: new FormControl(false),
      levelNo: new FormControl(0),
      hasDeviceID: new FormControl(),
      createdBy: new FormControl(this.auth.getUserId()),
      createdDate: new Date(),
      modifiedBy: new FormControl(),
      modifiedDate: new FormControl(),
      isLastNode:new FormControl(),
      frmItemModel: this.fb.group({
        id: new FormControl(0),
        prdProductId: new FormControl(0),
        name: new FormControl(''),
        isCardbased: new FormControl(false),
        isActive: new FormControl(true),
      })

    });

    this.getCategory();
    this.getBrand();
    this.getAllItem();
  }

  getCategory() {
    this.gSvc.postdata("Inventory/Product/GetGroup", {}).subscribe(res => {
      this.categories = res;
    }, err => {
      this.toastrService.error("Error! Caterory not found ");
    })
  }

  getBrand() {
    this.gSvc.postdata("Inventory/Brand/GetAll", {}).subscribe(res => {
      this.brands = res;
    }, err => {
      this.toastrService.error("Error! Brand not found");
    })
  }


  addRow(): boolean {
    const orderItem = this.frm.get('frmItemModel')?.value;

    if (orderItem.name == "") {
      this.toastrService.error("Item Model is required!");
      return false;
    }
    const results = this.items.filter((element: any) => {
      if (element.name === orderItem.name) {
        return true;
      }
      return false;
    });

    if (results.length > 0) {
      this.toastrService.info("Duplicated Entry!");
      return false
    } else {
      this.items.push(orderItem);
      //this.frm.controls['frmItemModel'].reset();
      this.frm.controls['frmItemModel'].setValue({
        id: 0,
        prdProductId: 0,
        name: '',
        isCardbased: false,
        isActive: true,
      });
      return true;
    }
  }
  removeRow(index: number): void {
    this.items.splice(index, 1); // 'index' is the index of the row you want to remove
  }

  save() {    
    if (this.frm.invalid) return false;

    if (this.items.length == 0) { this.toastrService.error("No Item Model found"); return false; }

    //var obj = {
      //id: this.frm.controls['id'].value,
      //cmnCompanyId: this.auth.getCompany(),
      //name: this.frm.controls['name'].value,
      //prdProductId: this.frm.controls['prdProductId'].value,
      //prdBrandId: this.frm.controls['prdBrandId'].value,
      //isWarrantyable: this.frm.controls['isWarrantyable'].value,
      //isActive: this.frm.controls['isActive'].value,
      //isCard: this.frm.controls['isCard'].value,
      //levelNo: this.frm.controls['levelNo'].value,
      //isLastNode: this.frm.controls['prdProductId'].value ? true : false,
      //hasDeviceID:this.frm.controls['hasDeviceID'].value,
      //createdBy: this.auth.getUserId(),
      //createdDate: new Date()
    //};
   if(this.frm.controls['prdProductId'].value){
    this.frm.controls['isLastNode'].setValue(true);
   }
   debugger;
    this.frm.controls["cmnCompanyId"].setValue(this.auth.getCompany())
    this.frm.get("id")?.value == "0" ? this.frm.controls["createdBy"].setValue(this.auth.getUserId()) : this.frm.controls["modifiedBy"].setValue(this.auth.getUserId());

    let objReq = { obj: this.frm.value, list: this.items }

    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        if (this.formId == 0) {
          //console.log(this.frm.value);
          this.gSvc.postdata("Inventory/Product/Save", objReq).subscribe(res => {            
            if (res.success) {
              this.frm.reset();
              this.items = [];
              this.getAllItem();
              this.toastrService.success("Item Saved");
            }
            else {
              this.toastrService.error("Error ! Item Not Saved");
            }
          }, err => {
            this.toastrService.error("Error ! Item Not Saved");
          })
        } else if (this.formId == 1) {
          this.gSvc.postdata("Inventory/Product/Save", objReq).subscribe(res => {
            if (res.success) {
              this.frm.reset();
              this.formId = 0;
              this.getAllItem();
              this.toastrService.success("Item Updated");
            }
          }, err => {
            this.toastrService.error("Error! Item Not Updated");
          })
        } else {
          this.toastrService.error("Error");
        }
        return true;
      },
      reject: () => {

      }

    })
    return false;
  }


  // getItems() {
  //   this.gSvc.postdata("Inventory/Item/GetAll", {}).subscribe(res => {
  //     this.brands = res;
  //   }, err => {
  //     this.toastrService.error("Error! Brand not found");
  //   })
  // }

  public productList: any = [];
  // getAllItem() {   
  //   this.gSvc.postdata("Inventory/Product/GetProducts", {}).subscribe(res => {
  //     this.productList = res;
  //   }, err => {
  //     this.toastrService.error("Error! Brand not found");
  //   })
  // }
 getAllItem() {   
    this.gSvc.postdata("Inventory/Product/GetProductsLastNode", {}).subscribe(res => {
      this.productList = res;
    }, err => {
      this.toastrService.error("Error! Brand not found");
    })
  }
  
  // edit(id: any) {
  //   this.formId = 1;
  //   this.gSvc.postdata("api/Item/Item/" + id + "", {}).subscribe((res: any) => {
  //     this.frm.controls['itemName'].setValue(res.name);
  //     this.frm.controls['itemCategoryId'].setValue(res.itemCategoryId);
  //     this.frm.controls['itemBrandId'].setValue(res.itemBrandId);
  //     this.frm.controls['itemTypeId'].setValue(res.itemTypeId);
  //     this.frm.controls['itemModelId'].setValue(res.itemModelId);
  //     this.frm.controls['isActive'].setValue(res.isActive == "Y" ? true : false);
  //     this.frm.controls['isCardBase'].setValue(res.isCardBase);
  //     this.frm.controls['cartonNo'].setValue(res.cartonNo);
  //     this.frm.controls['remarks'].setValue(res.remarks);
  //     this.frm.controls['id'].setValue(res.id);
  //   }, err => {
  //     this.toastrService.error("error");
  //   })
  // }


  edit(item: any) {
    this.items=[];
    this.formId = 1;
    this.frm.patchValue(item);
    //this.frm.controls['id'].setValue(item.id);
    //this.frm.controls['name'].setValue(item.name);
    //this.frm.controls['prdProductId'].setValue(item.prdProductId);
    //this.frm.controls['prdBrandId'].setValue(item.prdBrandId);
    //this.frm.controls['isWarrantyable'].setValue(item.isWarrantyable);
    //this.frm.controls['isActive'].setValue(item.isActive);
    //this.frm.controls['isCard'].setValue(item.isCard);
    //this.frm.controls['levelNo'].setValue(item.levelNo);
    //this.frm.controls['hasDeviceID'].setValue(item.hasDeviceID);

    if (item.productModels.length > 0) {
      var modelList: productModel[] = item.productModels;
      modelList.forEach(model => {
        this.items.push({
          id: model.id,
          prdProductId: model.prdProductId,
          name: model.name,
          isCardbased: model.isCardbased,
          isActive: model.isActive
        });
      });
    }
  }

  showModalDialog(res: any) {
    
    //this.displayModal = true;
    this.reset();
    //this.viewInfo = res;
  }

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/inventory/item')
  }
  reset() {
    this.frm.setValue({
      id: 0,
      name: '',
      prdProductId: 0,
      prdBrandId: 0,
      isWarrantyable: true,
      isActive: true,
      isCard: false,
      levelNo: 0,

      frmItemModel:({
        id: 0,
        prdProductId: 0,
        name: '',
        isCardbased: false,
        isActive: true,
      })

    });
    
    
    
    // this.frm.reset();
    // this.frm.controls['id'].setValue(0);
    //this.frm.markAsPristine();
    this.items=[];
  }

  clear(table: Table) {
    table.clear();
  }
}

export interface productModel {
  id?: number;
  prdProductId?: number;
  name?: string;
  isCardbased?: boolean;
  isActive?: boolean;
}