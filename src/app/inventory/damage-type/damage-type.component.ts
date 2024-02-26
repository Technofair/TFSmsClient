import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-damage-type',
  templateUrl: './damage-type.component.html',
  styleUrls: ['./damage-type.component.css'],
  providers: [ConfirmationService]
})
export class DamageTypeComponent {
  damageTypeList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  frm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService, private auth: AuthService) {

  }

  ngOnInit(): void {
    this.frm = new FormGroup({
      id: new FormControl(0, [Validators.required]),
      name: new FormControl("", [Validators.required]),
      description: new FormControl(),
      createdBy: new FormControl(this.auth.getUserId, [Validators.required]),
      createdDate: new FormControl("2023-05-29"),
      isActive: new FormControl(true, [Validators.required])
    });
    this.getDamageType();
  }



  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.gSvc.postdata("Inventory/DamageType/Save", JSON.stringify(this.frm.value)).subscribe(res => {
          this.frm.reset();
          this.getDamageType();
          this.toastrService.success("Successful");
        }, err => {
          this.toastrService.error("Error! Data Not Saved.");
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }

  getDamageType() {
    this.gSvc.postdata("Inventory/DamageType/GetAll", {}).subscribe(res => {
      this.damageTypeList = res;
    }, err => {
      this.toastrService.error("Damage list not found");
    })
  }

  edit(res: any) {
    this.formId = 1;
    this.frm.patchValue(res);
  }

  // delete(id: any) {
  //   this.confirmationService.confirm({
  //     message: 'Are you sure that you want to proceed?',
  //     header: 'Confirmation',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //     this.gSvc.postdata("Subscription/Broadcaster/Delete/" + id + "", {}).subscribe((res: any) => {
  //     this.frm.patchValue(res);
  //   }, err => {
  //     this.toastrService.error("Delete Error!");
  //   })
  //       return true;
  //     },
  //     reject: () => {
  //     }
  //   })
  //   return false;
  // }

  showModalDialog(res: any) {
    this.displayModal = true;
    this.reset();
    this.viewInfo = res;
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