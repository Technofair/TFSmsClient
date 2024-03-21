import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-item-brand',
  templateUrl: './client-bank-info.component.html',
  styleUrls: ['./client-bank-info.component.css'],
  providers: [ConfirmationService]
})
export class ClientBankInfoComponent implements OnInit {

  ItembrandList: any;
  selectedCustomers: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  frm!: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService,private auth :AuthService) {
   
  }
  ngOnInit(): void {
    this.getFrm();
  }
  getFrm(){
    this.frm = this.fb.group({
      id: new FormControl(0),
      name: new FormControl(""),
      shortName: new FormControl(""),
      address: new FormControl(""),
      createdBy:new FormControl(this.auth.getUserId()),
      createdDate:new FormControl(new Date()),
      modifiedBy:new FormControl(this.auth.getUserId()),
      modifiedDate:new FormControl(new Date()),
      isActive:new FormControl(true)
    });
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
    this.gSvc.postdata("Inventory/Brand/GetAll", {}).subscribe(res => {
      this.ItembrandList = res;
    }, err => {
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
