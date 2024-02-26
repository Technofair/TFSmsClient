import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-store-opening',
  templateUrl: './store-opening.component.html',
  styleUrls: ['./store-opening.component.css'],
  providers: [ConfirmationService]
})
export class StoreOpeningComponent implements OnInit {

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

  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService) {
    this.getItem();

  }

  frm: FormGroup = new FormGroup({
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
  })

  ngOnInit(): void {
    this.frm = this.fb.group({
      itemCategoryId: ["", [Validators.required]],
      itemName: ["", [Validators.required]],
      itemShortName: [""],
      itemBrandId: ["", [Validators.required]],
      itemTypeId: [""],
      itemModelId: ["",],
      isCardBase: [true],
      id: ["0"],
      remarks: [""],
      isActive: [true]
    });
    this.getItem();
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

  getItem() {
    this.gSvc.postdata("api/Item/Items", {}).subscribe(res => {
      this.itemList = res;
    
    }, err => {
      this.toastrService.error("error");
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