import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'web-chield-paywith',
  templateUrl: './chield-paywith.component.html',
  styleUrls: ['./chield-paywith.component.css'],
  styles: []
})
export class ChieldPaywithComponent implements OnInit  {
  constructor(private router:Router, public layoutService: LayoutService,private toastrService: ToastrService) 
  { }
  ngOnInit(): void {
   
  };
}