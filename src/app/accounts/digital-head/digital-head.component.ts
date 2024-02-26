import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-digital-head',
  templateUrl: './digital-head.component.html',
  styleUrls: ['./digital-head.component.css'],
  providers: [ConfirmationService]
})
export class DigitalHeadComponent implements OnInit {

  digitalHeadList: any;

  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService) {
    this.getDigitalHeadList();
  }

  frm: FormGroup = new FormGroup({
    id: new FormControl(""),
    headName: new FormControl(""),
    headType: new FormControl(""),
    remarks: new FormControl(""),
    isActive: new FormControl(""),
  })

  ngOnInit(): void {
    this.frm = this.fb.group({
      headName: ["", [Validators.required]],
      headType: ["", [Validators.required]],
      id: ["0"],
      remarks: [""],
      isActive: [""],
    });
    this.getDigitalHeadList();

  }

  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.formId == 0) {
          this.gSvc.postdata("api/DigitalHead/AddHead", JSON.stringify(this.frm.value)).subscribe(res => {
            this.reset();
            this.getDigitalHeadList();
            this.toastrService.success("Digital Head Saved");
          }, err => {
            this.toastrService.error("Error! Digital Head Not Saved");
          })
        } else if (this.formId == 1) {
          this.gSvc.postdata("api/DigitalHead/UpdateHead", JSON.stringify(this.frm.value)).subscribe(res => {
            this.reset();
            this.formId = 0;
            this.getDigitalHeadList();
            this.toastrService.success("Digital Head Updated");
          }, err => {
            this.toastrService.error("Error! Digital Head Not updated");
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


  getDigitalHeadList() {
    this.gSvc.postdata("api/DigitalHead/DigitalHeads", {}).subscribe(res => {
      this.digitalHeadList = res;
      console.log(res);
    }, err => {
      this.toastrService.error("Error! Digital Head list not found");
    })

  }

  edit(id: any) {
    this.getDigitalHeadList();
    this.formId = 1;
    this.gSvc.postdata("api/DigitalHead/DigitalHead/" + id + "", {}).subscribe((res: any) => {
      this.frm.controls['headName'].setValue(res.headName);
      this.frm.controls['headType'].setValue(res.headType);
      this.frm.controls['remarks'].setValue(res.remarks);
      this.frm.controls['id'].setValue(res.id);
    }, err => {
      this.toastrService.error("Error! Digital Head not found");
    })
  }

  showModalDialog(id:any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("api/DigitalHead/DigitalHead/" + id + "", {}).subscribe((res: any) => {
      this.viewInfo = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
}

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/admin/digitalhead')
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