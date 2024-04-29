import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
  providers: [ConfirmationService]
})
export class StoreComponent implements OnInit {

  storeList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  frm!: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService,private auth:AuthService) {
    this.getStore();
  }
 

  ngOnInit(): void {
    this.frm = new FormGroup({
      id: new FormControl("0"),
      cmnCompanyId: new FormControl(this.auth.getCompany()),
      code: new FormControl(""),
      name: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required]),
      space: new FormControl(),
      prefix: new FormControl(),
      contactPerson: new FormControl(""),
      contactNo: new FormControl(""),
      email: new FormControl(""),
      isActive: new FormControl(true),
      createdBy: new FormControl(this.auth.getUserId()),
      // CreatedDate: new FormControl(""),
      modifiedBy: new FormControl(this.auth.getUserId()),
      // ModifiedDate: new FormControl(""),
    })

    
  }

  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.gSvc.postdata("Common/Store/Save", JSON.stringify(this.frm.value)).subscribe(res => {
          this.frm.reset();
          this.getStore();
          this.toastrService.success("New Store Added");
        }, err => {
          this.toastrService.error("Error ! Store Not Saved");
        })

        return true;
      },
      reject: () => {
      }
    })
    return false;
  }

  getStore() {
    this.gSvc.postdata("Common/Store/GetAll", {}).subscribe(res => {
      this.storeList = res;
      console.log(res);
    }, err => {
      this.toastrService.error("Error! Store List not found");
    })
  }

  edit(res: any) {
    this.frm.patchValue(res);
  }

  showModalDialog(res: any) {
    this.displayModal = true;
    this.viewInfo = res;
    this.reset();

  }

  reload() {
    this.router.navigateByUrl('/inventory/store')
  }
  reset() {
    this.frm.reset();
    this.frm.controls['Id'].setValue(0);
    this.frm.markAsPristine();
  }

  clear(table: Table) {
    // table.clear();
  }
}