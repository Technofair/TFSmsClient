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
  templateUrl: './client-bill-generation.component.html',
  styleUrls: ['./client-bill-generation.component.css'],
  providers: [ConfirmationService]
})
export class ClientBillGenerationComponent implements OnInit {
  companyCustomerWithClientPackages: any;
  progressStatus:boolean = true;

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
  frm!:FormGroup

  
  constructor(private fb: FormBuilder,
    private router: Router,
    private confirmationService: ConfirmationService,
    private gSvc: GeneralService,
    private toastrService: ToastrService,
    private auth :AuthService) {
  }

  ngOnInit(): void {
    this.getFrm();
    //this.getCompanyCustomerWithClientPackages();
    //this. getcompanyPackageTypes();
  }

  getFrm(){
    this.frm = this.fb.group({

      year: new FormControl('', Validators.required),
      monthId: new FormControl('', Validators.required),
      createdBy:new FormControl(this.auth.getUserId()),
      tfaCompanyCustomerId: new FormControl(null)
      
     // createdDate:new FormControl(new Date()),
      //modifiedBy:new FormControl(this.auth.getUserId()),
      //modifiedDate:new FormControl(new Date())
    });
  }



  generateClientBill() {

    if (this.frm.invalid) return false;

    var year = this.frm.controls['year'].value;
    var monthId= this.frm.controls['monthId'].value;
    var createdBy = this.frm.controls['createdBy'].value;

    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
            this.gSvc.postdata("api/TFAClientBill/GenerateClientBill", JSON.stringify(this.frm.value)).subscribe(res => {
            this.getFrm();
            this.toastrService.success(res.message);
          }, err => {
            this.toastrService.error(err.message);
          })
        
        return true;
      },
      reject: () => {

      }
    })
    return false;
  }


  getBillInfo(){

    var year = this.frm.controls['year'].value;
    var monthId= this.frm.controls['monthId'].value;
    this.getCompanyCustomerWithClientPackages(monthId, year);
  }

  getCompanyCustomerWithClientPackages(monthId: any, year: any) {
   // var url = "api/TFAClientBill/GetActiveCompanyCustomerWithClientPackage?monthId=" + monthId + "&year=" + year;
var url = "api/TFACompanyCustomer/GetActiveCompanyCustomerWithClientPackage?monthId=" + monthId + "&year=" + year;

    this.progressStatus = false;
    this.gSvc.postdata(url, {}).subscribe(res => {
    this.companyCustomerWithClientPackages = res;
    }, err => {
      this.toastrService.error("Error! Data list Not Found");
    })
    this.progressStatus=true;
  }


  

  generateSingleBill(row: any) {  
    
    this.frm.controls['tfaCompanyCustomerId'].setValue(row.tfaCompanyCustomerId);
    console.log(JSON.stringify(row));
    console.log(row.tFACompanyCustomerId);
    //return;
    this.generateClientBill();
  }

  // getcompanyPackageTypes() {
  //   this.gSvc.postdata("api/TFACompanyPackageType/GetAll", {}).subscribe(res => {
  //   //  this.monthes = res;
  //   }, err => {
  //     this.toastrService.error("Error! Data list Not Found");
  //   })    
  // } 

  reload() {
   
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
