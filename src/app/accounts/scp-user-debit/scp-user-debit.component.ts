import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { Console } from 'console';

@Component({
  selector: 'app-scp-user-debit',
  templateUrl: './scp-user-debit.component.html',
  styleUrls: ['./scp-user-debit.component.css'],
  providers: [ConfirmationService]
})
export class ScpUserDebitComponent {
  list: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  frm!: FormGroup;
  organizationList:any;
  progressStatus: boolean = true;
  billers:any;
  constructor(private fb: FormBuilder,
     private router: Router,
     private confirmationService: ConfirmationService,
     private gSvc: GeneralService,
     private toastrService: ToastrService,
     private auth: AuthService) {

  }
  ngOnInit(): void {
    debugger
    this.frm = new FormGroup({
      id: new FormControl(0, [Validators.required]),
      secUserId: new FormControl([Validators.required]),
      amount: new FormControl(),
      remarks:new FormControl(), 
      createdBy: new FormControl(this.auth.getUserId, [Validators.required]),
      createdDate: new FormControl(new Date()),
      isActive: new FormControl(true, [Validators.required])
    });
    this.getUserDebit();
    this.getSecUserType();
  }

  save() {
   // this.progressStatus = false;
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        debugger
        console.log(JSON.stringify(this.frm.value));
        this.gSvc.postdata("api/ScpUserDebit/SaveScpProduct", JSON.stringify(this.frm.value)).subscribe(res => {
          this.frm.reset();
          this.getUserDebit();
          //this.progressStatus = true;
          this.toastrService.success("Successful");
        }, err => {
          //this.progressStatus = true;
          this.toastrService.error("Error! Data Not Saved.");
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }
  getUserDebit() { 
    this.gSvc.postdata("api/ScpUserDebit/GetAll", {}).subscribe(res => {
      this.list = res;
      this.progressStatus = true;
    }, err => {
      this.progressStatus = true;
      this.toastrService.error("List not found");
    })
  }
  edit(res: any) {
    debugger;    
    this.getSecUserType();
    this.frm.patchValue(res);
    console.log(res);
    //this.frm.controls["SecUserId"].setValue(res.secUserId);

  }

  showModalDialog(res: any) {
    this.displayModal = true;
    this.reset();
    this.viewInfo = res;
  }
  getSecUserType() {
    this.gSvc.postdata("Security/User/GetSecUsersByCompanyAndUserType?cmnCompanyId=2" + "&secUserTypeId=3", {}).subscribe((res: any) => {
      
      this.billers= res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }
  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/inventory/damagetype')
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