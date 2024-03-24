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
  banks:any;
  companies:any;
  progressStatus:boolean=true;
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService,private auth :AuthService) {
   
  }
  ngOnInit(): void {
    this.getFrm();
    this.getBanks();
    this. getCompanies();
  }
  getFrm(){
    this.frm = this.fb.group({
      id: new FormControl(0),
      cmnCompanyId: new FormControl(),
      bnkBankId: new FormControl(),
      accountName: new FormControl(""),
      accountNo: new FormControl(""),
      referenceID: new FormControl(""),
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
      
          this.gSvc.postdata("api/ClientBankAccountInfo/Save", JSON.stringify(this.frm.value)).subscribe(res => {
            this.frm.reset();
            this.toastrService.success("Client Bank Account Info Saved");
          }, err => {
            this.toastrService.error("Error! Client Bank Account Info Not Saved");
          })
        return true;
      },
      reject: () => {

      }

    })
    return false;
  }

  getBanks() {
    this.gSvc.postdata("api/BankInformation/GetAll", {}).subscribe(res => {
      this.banks = res;
    }, err => {
      this.toastrService.error("Error! Data list Not Found");
    })
  }
  
  getCompanies() {
    this.gSvc.postdata("Common/Company/GetCompanyList", {}).subscribe(res => {
      this.companies = res;
    }, err => {
      this.toastrService.error("Error! Company list not found ");
    })
  }
  edit(res: any) {
   this.frm.patchValue(res);
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
