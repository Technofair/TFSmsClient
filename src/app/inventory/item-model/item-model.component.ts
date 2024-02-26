import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-item-model',
  templateUrl: './item-model.component.html',
  styleUrls: ['./item-model.component.css'],
  providers: [ConfirmationService]
})
export class ItemModelComponent implements OnInit {

  itemModelList: any;
  selectedCustomers: any;

  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  constructor(private fb: FormBuilder, private router: Router,private confirmationService: ConfirmationService,private gSvc: GeneralService, private toastrService: ToastrService) {
    this.getItemModelList();
  }

  frm: FormGroup = new FormGroup({
    id: new FormControl(""),
    name: new FormControl(""),
    code: new FormControl(""),
    remarks: new FormControl(""),
  })

  ngOnInit(): void {

    this.frm = this.fb.group({
      id: ["0"],
      name: ["", [Validators.required]],
      code: [""],
      itemCategoryId: ["0"],
      remarks: [""],
    });
    this.getItemModelList();
  }

  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
    if(this.formId==0){
      this.gSvc.postdata("api/ItemModel/AddItemModel", JSON.stringify(this.frm.value)).subscribe(res => {
      this.frm.reset();
      this.getItemModelList();
      this.toastrService.success("Item Model Saved");
    }, err => {
      this.toastrService.error("Error ! Item Model Not Saved");
    })
    }else if(this.formId==1){
      this.gSvc.postdata("api/ItemModel/UpdateItemModel", JSON.stringify(this.frm.value)).subscribe(res => {
        this.frm.reset();
        this.formId=0;
        this.getItemModelList();
        this.toastrService.success("Item Model Updated");
      }, err => {

        this.toastrService.error("Error! Item Model Not Updated");

      })
    }else{
      this.toastrService.error("Error");
    }
    return true;},
    reject: () => {

    }

  })
  return false;
  }

  getItemModelList(){
    this.gSvc.postdata("api/ItemModel/ItemModels",{}).subscribe(res => {
      this.itemModelList=res;

    }, err => {
      this.toastrService.error("Item Model List Not Found");
    })
  }

  edit(id:any){
    this.formId=1;
    this.getItemModelList();
    this.gSvc.postdata("api/ItemModel/ItemModel/"+id+"",{}).subscribe((res:any) => {
      this.frm.controls['id'].setValue(res.id);
      this.frm.controls['name'].setValue(res.name);
      this.frm.controls['code'].setValue(res.code);
      this.frm.controls['remarks'].setValue(res.remarks);
    }, err => {
      this.toastrService.error("Error! Item Model Not Found");
    })
  }

  showModalDialog(id:any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("api/ItemModel/ItemModel/" + id + "", {}).subscribe((res: any) => {
      this.viewInfo = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
}

  reload(){
    this.formId=0;
    this.router.navigateByUrl('/inventory/itemmodel')
  }
  clear(table: Table) {
    table.clear();
}
  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }
}
