import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { read, utils } from "xlsx";
import { ExportService } from 'src/app/layout/service/export.service';
import { Utility } from 'src/app/services/utility.service';

@Component({
  selector: 'app-company',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css'],
  providers: [ConfirmationService]
})
export class ClientListComponent implements OnInit {

  companyList: any;
  companyTypeList: any;
  divisionList: any;
  districtList: any;
  upazilla: any;
  thanaList: any;
  unionList: any;
  countryList: any;

  apiurl: any;
  displayModal: boolean = false;
  attachmentModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  id: any;
  genderList: any;
  clientViews: any[] = [];
  frm!: FormGroup;
  hideButton: boolean = true;
  attachmentTypes: any[] = [];
  attachmentList: any[] = [];
  removeData: any = "";

  constructor(
    private fb: FormBuilder
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService
    , private toastrService: ToastrService
    , private route: ActivatedRoute
    , private auth: AuthService
    , private exportService: ExportService
    , public util: Utility,
  ) {

  }



  ngOnInit(): void {
    this.genderList = [{ 'id': 1, "name": 'Male' }, { 'id': 2, "name": 'Female' }, { 'id': 3, "name": 'Others' }]
    //this.attachmentList = [{ 'id': 0, "name": 'SELECT' }, { 'id': 1, "name": 'NID' }, { 'id': 2, "name": 'TRADE LICENSE' }, { 'id': 3, "name": 'TIN' }, { 'id': 4, "name": 'VAT/BIN' }, { 'id': 5, "name": 'ORGANIZATION MEMBERSHIP' }]

  
    this.getCompany();
   // this.getAttachType();
   // this.getCompanyType();
   
   
  }

  exportToExcel(): void {
    const columnsToExport: string[] = ['name', 'code', 'contactPerson', 'contactNo', 'email', 'address'];
    this.exportService.exportToExcel(this.companyList, 'client_report', columnsToExport);
  }

  getCompany() {
    this.gSvc.postdata("Common/Company/GetAll", {}).subscribe(res => {
      this.companyList = res;
    }, err => {
      this.toastrService.error("Error! Company list not found ");
    })
  }

  getCompanyType() {
    this.gSvc.postdata("Common/Company/GetCompanyType", this.auth.getCompany()).subscribe(res => {
      this.companyTypeList = res;
    }, err => {
      this.toastrService.error("Error! Company type list not found");
    })
  }

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/home/setting/company')
  }
  clear(table: Table) {
    table.clear();
  }
  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.controls['isActive'].setValue(true);
    this.frm.markAsPristine();
  }

  getAttachType() {
    this.gSvc.postdata("HRM/FileCategory/GetAll", {}).subscribe(res => {
      this.attachmentTypes = res;
    }, err => {
      this.toastrService.error("Error! Attachment list not found");
    })
  }

 
}
