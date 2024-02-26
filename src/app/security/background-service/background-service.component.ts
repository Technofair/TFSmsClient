import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-background-service',
  templateUrl: './background-service.component.html',
  styleUrls: ['./background-service.component.css'],
  providers: [ConfirmationService]
})
export class BackgroundServiceComponent implements OnInit {

  isOn: boolean = false;
  srvcStatus:string='Stoped';

  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService, private Authser: AuthService) {

  }



  ngOnInit(): void {
    this.getServiceStatus();
  }

  getServiceStatus() {
    this.gSvc.postdata("api/GeneralServices/GetServiceStatus", {}).subscribe(res => {
      debugger;
      this.isOn = res;
    }, err => {
      this.toastrService.error("error");
    })
  }

  startStopService() {
    debugger;
    var pararm = { IsStop: this.isOn };
    this.gSvc.postparam("api/GeneralServices/ServiceStartStop", pararm).subscribe(res => {
      this.isOn = this.isOn ? false : true;
      this.getServiceStatus();
    }, err => {
      this.toastrService.error("error");
    })
  }

}
