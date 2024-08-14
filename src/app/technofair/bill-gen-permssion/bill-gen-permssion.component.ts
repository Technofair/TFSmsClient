import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-bill-gen-permssion',
  templateUrl: './bill-gen-permssion.component.html',
  styleUrls: ['./bill-gen-permssion.component.css'],
  providers: [ConfirmationService]
})
export class BillGenPermssionComponent {
  list: any;
  monthes:any=[
    {id:'',name:"Select"},
    {id:1,name:"January"},
    {id:2,name:"February"},
    {id:3,name:"March"},
    {id:4,name:"April"},
    {id:5,name:"May"},
    {id:6,name:"June"},
    {id:7,name:"July"},
    {id:8,name:"August"},
    {id:9,name:"September"},
    {id:10,name:"October"},
    {id:11,name:"November"},
    {id:12,name:"December"}
  ];
  years:any=[
    {id:'',name:"Select"},
    {id:2024,name:"2024"},
    {id:2025,name:"2025"},
    {id:2026,name:"2026"},
    {id:2027,name:"2027"},
    {id:2028,name:"2028"},
    {id:2029,name:"2029"},
    {id:2030,name:"2030"},
    {id:2031,name:"2031"},
    {id:2032,name:"2032"},
    {id:2033,name:"2033"},
    {id:2034,name:"2034"},
    {id:2035,name:"2035"}
  ];
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  progressStatus: boolean = true;
  frm!: FormGroup

  constructor(private fb: FormBuilder,
    private router: Router,
    private confirmationService: ConfirmationService,
    private gSvc: GeneralService,
    private toastrService: ToastrService,
    private auth: AuthService) {

  }


  ngOnInit(): void {
    this.getFrm(); 
    this.getbillgenerationpermission();   
  }
  getFrm(){
    this.frm = this.fb.group({
      id: new FormControl(0),
      tFAMonthId: new FormControl(),
      year: new FormControl([Validators.required]),      
      isLocked:new FormControl(true),
      lockDate:new FormControl(null,[Validators.required]),
      createdBy:new FormControl(this.auth.getUserId()),
      createdDate:new FormControl(new Date()),
      modifiedBy:new FormControl(this.auth.getUserId()),
      modifiedDate:new FormControl(new Date())
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
          this.gSvc.postdata("api/TFABillGenPermssion/Save", JSON.stringify(this.frm.value)).subscribe(res => {
            this.frm.reset();
            this.getbillgenerationpermission();
            this.toastrService.success("BillGenerationPermssion Information Saved");
          }, err => {
            this.toastrService.error("Error! BillGenerationPermssion Information Not Saved");
          })
        } else if (this.formId == 1) {
          this.gSvc.postdata("api/TFABillGenPermssion/Save", JSON.stringify(this.frm.value)).subscribe(res => {
            this.frm.reset();
            this.formId = 0;
            this.getbillgenerationpermission();
            this.toastrService.success("BillGenerationPermssion Information Updated");

          }, err => {
            this.toastrService.error("Error! BillGenerationPermssion Information Not updated");
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

  getbillgenerationpermission() {   
    this.gSvc.postdata("api/TFABillGenPermssion/GetAll", {}).subscribe(res => {
      this.list = res;
    }, err => {
      this.toastrService.error("Error! Data list Not Found");
    })   
  }

  edit(res: any) {
    this.formId = 1;
    this.frm.patchValue(res);
  }

  reset(){

  }
  clear(table: Table) {
    table.clear();
  }
}
