import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-collection',
  templateUrl: './company-collection.component.html',
  styleUrls: ['./company-collection.component.css'],
  providers: [ConfirmationService]
})
export class CompanyCollectionComponent {

  organizationList: any;
  test: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;

  constructor(private fb: FormBuilder, private router: Router,private confirmationService: ConfirmationService,private gSvc: GeneralService, private toastrService: ToastrService) {
    this.getOrganizationList();
  }

  frm: FormGroup = new FormGroup({
    id: new FormControl(""),
    // name: new FormControl(""),
    // code: new FormControl(""),
    // remarks: new FormControl(""),
  })

  ngOnInit(): void {

    this.frm = this.fb.group({
      // name: ["", [Validators.required]],
      // code: [""],
      id: ["0"],
      // remarks: [""],
    });
    
  }

  save() {
    
  }


  getOrganizationList() {
    this.gSvc.postdata("api/Organization/Organizations", {}).subscribe(res => {
      this.organizationList = res;
      console.log(res);
    }, err => {
      this.toastrService.error("Error! Charge Amount list not found");
    })
  }

  edit(id:any){
    this.formId=1;
    this.getOrganizationList();
    this.gSvc.postdata("api/ItemType/ItemType/"+id+"",{}).subscribe((res:any) => {
      // this.frm.controls['name'].setValue(res.name);
      // this.frm.controls['code'].setValue(res.code);
      // this.frm.controls['remarks'].setValue(res.remarks);
      // this.frm.controls['id'].setValue(res.id);
    }, err => {

      // this.toastrService.error("Error ! Item not found . ");
    })
  }

  showModalDialog(id:any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("api/ItemType/ItemType/" + id + "", {}).subscribe((res: any) => {
      this.viewInfo = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
}
  reload(){
    this.formId=0;
    this.router.navigateByUrl('/inventory/collection')
  }
  clear(table: Table) {
    table.clear();
}
  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }
}