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
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.css'],
  providers: [ConfirmationService]
})
export class BackupServiceComponent implements OnInit {

  isOn: boolean = false;
  srvcStatus:string='Stoped';

  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService, private Authser: AuthService) {

  }


  ngOnInit(): void {
   
  }
  getBackup() {
    this.gSvc.postdata("api/BackupDB/BackupAllDB", {}).subscribe(res => {    
      this.isOn = res;
      this.toastrService.success(res.messages);
    }, err => {
      this.toastrService.error("error");
    })
  }
}
