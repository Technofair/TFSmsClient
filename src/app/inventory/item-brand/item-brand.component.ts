import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-item-brand',
  templateUrl: './item-brand.component.html',
  styleUrls: ['./item-brand.component.css'],
  providers: [ConfirmationService]
})
export class ItemBrandComponent implements OnInit {

  ItembrandList: any;
  selectedCustomers: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  itemBrandStatus:boolean=true;
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService) {
    this.getItembrand();
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
    this.getItembrand();
  }

  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.formId == 0) {

          this.gSvc.postdata("Inventory/Brand/Save", JSON.stringify(this.frm.value)).subscribe(res => {
            this.frm.reset();
            this.getItembrand();
            this.toastrService.success("Item Brand Saved");
          }, err => {
            this.toastrService.error("Error! Item Brand Not Saved");
          })
        } else if (this.formId == 1) {
          this.gSvc.postdata("Inventory/Brand/Save", JSON.stringify(this.frm.value)).subscribe(res => {
            this.frm.reset();
            this.formId = 0;
            this.getItembrand();
            this.toastrService.success("Item Brand Updated");

          }, err => {
            this.toastrService.error("Error! Item Brand Not updated");
          })
        } else {
          this.toastrService.error("System error!");
        }
        return true;
      },
      reject: () => {

      }

    })
    return false;
  }

  getItembrand() {
    this.itemBrandStatus=false;
    this.gSvc.postdata("Inventory/Brand/GetAll", {}).subscribe(res => {
      this.ItembrandList = res;
      this.itemBrandStatus=true;
    }, err => {
      this.itemBrandStatus=true;
      this.toastrService.error("Error! Data list Not Found");
    })

  }

  edit(id: any) {
    this.formId = 1;
    this.getItembrand();
    this.gSvc.postdata("Inventory/Brand/GetById/" + id + "", {}).subscribe((res: any) => {
      this.frm.controls['name'].setValue(res.name);
      this.frm.controls['code'].setValue(res.code);
      this.frm.controls['remarks'].setValue(res.remarks);
      this.frm.controls['id'].setValue(res.id);
      this.viewInfo = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  showModalDialog(id: any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("api/ItemBrand/ItemBrand/" + id + "", {}).subscribe((res: any) => {
      this.viewInfo = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
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
}
