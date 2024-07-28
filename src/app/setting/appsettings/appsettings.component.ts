import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';


@Component({
  selector: 'app-appsettings',
  templateUrl: './appsettings.component.html',
  styleUrls: ['./appsettings.component.css'],
  providers: [ConfirmationService]
})
export class AppsettingsComponent {
  activeTabs: any;
  list: any;
  AllowAutoSubscriberNumber: boolean = true;
  AllowPurchase: boolean = true;
  AllowSale: boolean = true;
  //formId = 0;
  frm!: FormGroup;
  //progressStatus: boolean = true; 
  constructor(private fb: FormBuilder,
    private router: Router,
    private confirmationService: ConfirmationService,
    private gSvc: GeneralService,
    private toastrService: ToastrService,
    private auth: AuthService) {

  }
  ngOnInit(): void {
    this.frm = new FormGroup({
      id: new FormControl(0),
      allowAutoSubscriberNumber: new FormControl(true, [Validators.required]),
      subscriberNumberLength: new FormControl(0, [Validators.required]),
      allowPurchase: new FormControl(true, [Validators.required]),
      allowSale: new FormControl(true, [Validators.required]),
      allowRenewableArrear: new FormControl(),
      allowMigration: new FormControl(),
      isProduction: new FormControl(),
      appKey: new FormControl(""),
      createdBy: new FormControl(this.auth.getUserId()),
      createdDate: new FormControl(new Date()),
      modifiedBy: new FormControl(this.auth.getUserId()),
      modifiedDate: new FormControl(new Date())
    });
    this.getAppSetting();
  }

  saveAppSetting() {    
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(JSON.stringify(this.frm.value));
        debugger
        this.gSvc.postdata("Common/CmnAppSetting/Update", JSON.stringify(this.frm.value)).subscribe(res => {
          this.frm.reset();
          this.getAppSetting();        
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

  getAppSetting() {
    this.gSvc.postdata("Common/CmnAppSetting/GetCmnAppSetting", {}).subscribe(res => {
      this.list = res;
    }, err => {
      this.toastrService.error("List not found");
    })
  }

  edit(res: any) {
    this.getAppSetting();
    this.frm.patchValue(res);
  }

  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }
}

