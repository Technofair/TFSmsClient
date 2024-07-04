import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-software-info',
  templateUrl: './server-info.component.html',
  styleUrls: ['./server-info.component.css'],
  providers: [ConfirmationService]
})
export class ServerInfoComponent implements OnInit {
 softwareInfo:any;
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService, private Authser: AuthService) {

  }
  ngOnInit(): void {
    
    this.getsoftwareInfo();
    

    
  }
  getsoftwareInfo() {
    this.gSvc.postdata("api/SoftwareInfo/GetSoftwareInfo", {}).subscribe(res => {   
       debugger;
        this.softwareInfo=res;
      this.toastrService.success(res.messages);
    }, err => {
      this.toastrService.error("error");
    })
  }
}
