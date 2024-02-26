import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-channel-category',
  templateUrl: './channel-category.component.html',
  styleUrls: ['./channel-category.component.css'],

  providers: [ConfirmationService]
})
export class ChannelCategoryComponent implements OnInit {

  channelCategoryList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  id: any;
  frm!: FormGroup;
  defaultChecked = true;

  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.frm = new FormGroup({
      id: new FormControl("0", [Validators.required]),
      name: new FormControl("", [Validators.required]),
      isActive: new FormControl(true, [Validators.required])
    });
    this.getChannelCategory();
  }

  save() {

    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.gSvc.postdata("Subscription/ChannelCategory/Save", JSON.stringify(this.frm.value)).subscribe(res => {
          console.log(this.frm.value);
          this.frm.reset();
          this.getChannelCategory();
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

  getChannelCategory() {
    this.gSvc.postdata("Subscription/ChannelCategory/GetAll", {}).subscribe(res => {
      this.channelCategoryList = res;
    }, err => {
      this.toastrService.error("Error! Channel Category List not found ");
    })
  }

  edit(res: any) {
    this.formId = 1;
    this.frm.patchValue(res);
  }

  showModalDialog(res: any) {
    this.displayModal = true;
    this.reset();
    this.viewInfo = res;
  }

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/home/subscription/channelcategory')
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