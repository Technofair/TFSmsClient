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
    
    this.getserverInfo();
    


  }
  getserverInfo() {
  this.gSvc.postdata("api/ServerInfo/GetServerInfo", {}).subscribe(res => {   
  this.softwareInfo=res;
  fetch('https://ipinfo.io/json')
  .then(response => response.json())
  .then(data => {
    // console.log(data.ip); // Client's IP address
    // console.log(data.city); // City
    // console.log(data.region); // Region
    // console.log(data.country); // Country
    this.softwareInfo.serverIp=data;
  })
  .catch(error => {
    console.error('Error fetching IP information:', error);
  });
      
      this.toastrService.success(res.messages);
    }, err => {
      this.toastrService.error("error");
    })
  }
}
