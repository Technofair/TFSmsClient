import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-broadcaster',
  templateUrl: './broadcaster.component.html',
  styleUrls: ['./broadcaster.component.css'],

  providers: [ConfirmationService]
})
export class BroadcasterComponent implements OnInit {

  broadcasterList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  id: any;
  frm!: FormGroup;
  defaultChecked  = true;

  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.frm = new FormGroup({
      id: new FormControl("0", [Validators.required]),
      name: new FormControl("", [Validators.required]),
      address: new FormControl(""),
      isActive: new FormControl(true, [Validators.required])
    })
    this.getBroadcaster();
  }

  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.gSvc.postdata("Subscription/Broadcaster/Save", JSON.stringify(this.frm.value)).subscribe(res => {
          console.log(this.frm.value);
          this.frm.reset();
          this.defaultChecked = true;
          this.getBroadcaster();
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


  getBroadcaster() {
    this.gSvc.postdata("Subscription/Broadcaster/GetAll", {}).subscribe(res => {
      this.broadcasterList = res;
    }, err => {
      this.toastrService.error("Error! Company List not found ");
    })
  }

  edit(res: any) {
    this.formId = 1;
    this.frm.patchValue(res);
  }

  delete(id: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.gSvc.postdata("Subscription/Broadcaster/Delete/" + id + "", {}).subscribe((res: any) => {
          this.frm.patchValue(res);
        }, err => {
          this.toastrService.error("Delete Error!");
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }

  showModalDialog(res: any) {
    this.displayModal = true;
    this.reset();
    this.viewInfo = res;
  }

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/home/subscription/broadcaster')
  }
  clear(table: Table) {
    table.clear();
  }
  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    // this.frm.controls['isActive'].setValue(true);
    // this.frm.value.isActive = 1;
    this.defaultChecked = true;
    this.frm.markAsPristine();
  }
}