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
  years:any;
  monthes:any;
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
    this. getcompanyPackageTypes();
  }
  getFrm(){
    this.frm = this.fb.group({
      id: new FormControl(0),
      year: new FormControl(Validators.required),
      monthId: new FormControl(),
 
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
          this.gSvc.postdata("api/TFAClientPackage/Save", JSON.stringify(this.frm.value)).subscribe(res => {
            this.getFrm();
            
            this.toastrService.success(res.message);
          }, err => {
            this.toastrService.error("Error! ClientPackage Not Saved");
          })
        
        return true;
      },
      reject: () => {

      }
    })
    return false;
  }

  getcompanyPackageTypes() {
    this.gSvc.postdata("api/TFACompanyPackageType/GetAll", {}).subscribe(res => {
      this.monthes = res;
    }, err => {
      this.toastrService.error("Error! Data list Not Found");
    })    
  }


  edit(res: any) {
    
    this.frm.patchValue(res);
  }

  
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
