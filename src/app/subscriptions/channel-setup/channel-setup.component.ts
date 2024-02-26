import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-channel-setup',
  templateUrl: './channel-setup.component.html',
  styleUrls: ['./channel-setup.component.css'],

  providers: [ConfirmationService]
})
export class ChannelSetupComponent {

  channelSetupList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  id: any;

  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService, private route: ActivatedRoute) {

  }

  frm: FormGroup = new FormGroup({
    // Id: new FormControl(""),
    // Code: new FormControl(""),
    // Name: new FormControl(""),
    // ShortName: new FormControl(""),
    // Address: new FormControl(""),

  })

  ngOnInit(): void {
    this.frm = this.fb.group({
      Id: ["0", [Validators.required]],
      Code: ["0", [Validators.required]],
      Name: ["", [Validators.required]],
      ShortName: [""],
      Address: ["", [Validators.required]],

    });
    this.getChannelSetup();
  }

  save() {

    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.formId == 0) {
          
          this.gSvc.postdata("Common/Company/Save", JSON.stringify(this.frm.value)).subscribe(res => {
            console.log(res);
            this.frm.reset();
            this.toastrService.success("Saved success");
          }, err => {
            this.toastrService.error("Error ! Data is not saved . ");
          })
        } else if (this.formId == 1) {
          this.gSvc.postdata("Common/Company/Save", JSON.stringify(this.frm.value)).subscribe(res => {
            this.frm.reset();
            this.toastrService.success("Updated success");
            this.formId == 1;
          }, err => {
            this.toastrService.error("Error ! Data is not updated . ");
          })
        } else {
          this.toastrService.error("Error ! Data is not saved or updated. ");
        }
        return true;
      },
      reject: () => {

      }

    })
    return false;
  }

  getChannelSetup() {
    this.gSvc.postdata("Subscribtion/ChannelSetup/GetAll", {}).subscribe(res => {
      this.channelSetupList = res;
    }, err => {
     // this.toastrService.error("Error! Data not found ");
    })
  }

  edit(id: any) {
    this.formId = 1;
    this.getChannelSetup();
    this.gSvc.postdata("Common/Company/GetByCompanyId/" + id + "", {}).subscribe((res: any) => {
      this.frm.controls['id'].setValue(res.id);
      this.frm.controls['code'].setValue(res.code);
      this.frm.controls['name'].setValue(res.name);
      this.frm.controls['shortName'].setValue(res.shortName);
      this.frm.controls['address'].setValue(res.address);
      // this.frm.patchValue(res);
    }, err => {
     // this.toastrService.error("error");
    })
  }

  showModalDialog(id: any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("Common/Company/GetByCompanyId/" + id + "", {}).subscribe((res: any) => {
      this.viewInfo = res;
    }, err => {
     // this.toastrService.error("Error! Data Not Found");
    })
  }

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/home/setting/company')
  }
  clear(table: Table) {
    table.clear();
  }
  reset() {
    this.frm.reset();
    this.frm.controls['Id'].setValue(0);
    this.frm.markAsPristine();
  }
}