import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-item-type',
  templateUrl: './item-type.component.html',
  styleUrls: ['./item-type.component.css'],
  providers: [ConfirmationService]
})
export class ItemTypeComponent implements OnInit {

  ItemtypeList: any;
  selectedCustomers: any;
  cols: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  constructor(private fb: FormBuilder, private router: Router,private confirmationService: ConfirmationService,private gSvc: GeneralService, private toastrService: ToastrService) {
    this.getItemtype();
  }

  frm: FormGroup = new FormGroup({
    id: new FormControl(""),
    name: new FormControl(""),
    code: new FormControl(""),
    remarks: new FormControl(""),
  })

  ngOnInit(): void {

    this.frm = this.fb.group({
      name: ["", [Validators.required]],
      code: [""],
      id: ["0"],
      remarks: [""],
    });
    this.getItemtype();
  }

  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
    if(this.frm.controls['id'].value==0){
      this.gSvc.postdata("api/ItemType/AddItemType", JSON.stringify(this.frm.value)).subscribe(res => {
        this.frm.reset();
        this.getItemtype();

      }, err => {
        this.toastrService.error("Error ! Item is not Saved .");
      })
    }else if(this.frm.controls['id'].value>0){

      this.gSvc.postdata("api/ItemType/UpdateItemType", JSON.stringify(this.frm.value)).subscribe(res => {
        this.frm.reset();
        this.getItemtype();
      }, err => {
        this.toastrService.error("Error ! Item is not Updated .");
      })
    }else{
      this.toastrService.error("Error ! Save and Update Not Work .");
    }
    return true;},
    reject: () => {

    }

  })
  return false;
  }


  getItemtype(){
    this.gSvc.postdata("api/ItemType/ItemTypes",{}).subscribe(res => {
      this.ItemtypeList = res;
      console.log(res);
    }, err => {
      this.toastrService.error("Error ! Item Types not found ?");
    })
  }

  edit(id:any){
    this.formId=1;
    this.getItemtype();
    this.gSvc.postdata("api/ItemType/ItemType/"+id+"",{}).subscribe((res:any) => {
      this.frm.controls['name'].setValue(res.name);
      this.frm.controls['code'].setValue(res.code);
      this.frm.controls['remarks'].setValue(res.remarks);
      this.frm.controls['id'].setValue(res.id);
    }, err => {

      this.toastrService.error("Error ! Item not found . ");
    })
  }

  showModalDialog(id:any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("api/ItemType/ItemType/" + id + "", {}).subscribe((res: any) => {
      this.viewInfo = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
}
  reload(){
    this.formId=0;
    this.router.navigateByUrl('/inventory/itemtype')
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
