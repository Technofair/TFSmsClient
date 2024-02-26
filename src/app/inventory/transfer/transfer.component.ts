import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css'],
  providers: [ConfirmationService]
})
export class TransferComponent implements OnInit {
  formId=0;
  transferList:any;
  itemList:any;
  viewInfo: any = {};
  displayModal: boolean = false;

  constructor(private fb: FormBuilder, private router: Router,private confirmationService: ConfirmationService,private gSvc: GeneralService, private toastrService: ToastrService) {

  }

  frm: FormGroup = new FormGroup({
    id: new FormControl(""),
    name: new FormControl(""),
    stb: new FormControl(""),
    remarks: new FormControl(""),
  })

  ngOnInit(): void {
    this.frm = this.fb.group({
      id: ["0"],
      stb: [""],
      remarks: [""],
    });

    this.getItem();

  }
  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
    if(this.frm.controls['id'].value==0){
      this.gSvc.postdata("", JSON.stringify(this.frm.value)).subscribe(res => {
        this.frm.reset();

        alert("Success");
      }, err => {
        this.toastrService.error("error");
      })
    }else if(this.frm.controls['id'].value>0){
      this.gSvc.postdata("", JSON.stringify(this.frm.value)).subscribe(res => {
        this.frm.reset();

        alert("success");
      }, err => {
        this.toastrService.error("error");
      })
    }else{
      this.toastrService.error("error")
    }
    return true;},
    reject: () => {
       
    }
  
  })
  return false;
  }
  edit(id:any){
    this.formId=1;


    this.gSvc.postdata(""+id+"",{}).subscribe((res:any) => {
      this.frm.controls['id'].setValue(res.id);
      this.frm.controls['stb'].setValue(res.stb);
      this.frm.controls['remarks'].setValue(res.remarks);
    }, err => {
      this.toastrService.error("error");
    })
  }

  reload(){
    this.formId=0;
    this.router.navigateByUrl('/inventory/transfer')
  }
  clear(table: Table) {
    table.clear();
}
  reset(){this.formId=0;}

  getItem(){
    this.gSvc.postdata("api/Item/Items",{}).subscribe(res => {
      console.log(res);
      this.itemList=res;
    }, err => {
      this.toastrService.error("error");
    })

  }

  view(id:any){
    this.reset();
    this.gSvc.postdata("api/Item/Item/"+id+"",{}).subscribe((res:any) => {
      console.log(res);
      this.viewInfo = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }


}