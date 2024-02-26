import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-web-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  styles: [`
  :host ::ng-deep .pi-eye,
  :host ::ng-deep .pi-eye-slash {
      transform:scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
  }
`]
})
export class WebMenuComponent implements OnInit  {
  
  constructor(private router:Router, public layoutService: LayoutService,private toastrService: ToastrService) 
  { }
  ngOnInit(): void {
  };
}
