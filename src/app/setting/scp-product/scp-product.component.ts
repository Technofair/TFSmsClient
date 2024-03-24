import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Utility } from 'src/app/services/utility.service';

@Component({
  selector: 'app-item-brand',
  templateUrl: './scp-product.component.html',
  styleUrls: ['./scp-product.component.css'],
  providers: [ConfirmationService]
})
export class ScpProductComponent implements OnInit {

  products: any;
  selectedCustomers: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  frm!:FormGroup;
  progressStatus:boolean=true;
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService ,private auth:AuthService ,private utill:Utility) {
   
  }
  ngOnInit(): void {
    this.getFrm();
    this.getProducts();
  }
  getFrm(){
    this.frm = this.fb.group({
        id: new FormControl(0),
        name: new FormControl(),
        price: new FormControl(),
        isActive: new FormControl(),
        createdBy: new FormControl(this.auth.getUserId()),
        createdDate: new FormControl(new Date()),
        modifiedBy: new FormControl(this.auth.getUserId()),
        modifiedDate: new FormControl(new Date()),
    });
  }
  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        
          this.gSvc.postdata("api/ScpProduct/SaveScpProduct", JSON.stringify(this.frm.value)).subscribe(res => {
            this.getProducts();
            this.reset()
            this.toastrService.success("Product Saved");
          }, err => {
            this.toastrService.error("Error! Product Not Saved");
          })
        
        return true;
      },
      reject: () => {

      }

    })
    return false;
  }

  getProducts() {
    this.progressStatus=false;
    this.gSvc.postdata("api/ScpProduct/GetAll", {}).subscribe(res => {
      this.products = res;
      this.progressStatus=true;
    }, err => {
      this.progressStatus=true;
      this.toastrService.error("Error! Product Not Found");
    })

  }

  edit(res: any) {
    this.frm.patchValue(res);
  }

  reset() {
    this.getFrm();
    //this.frm.markAsPristine();
  }
  clear(table: Table) {
    table.clear();
  }
}
