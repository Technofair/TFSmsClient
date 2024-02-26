import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { TopNavBarComponent } from '../topnavbar/topnavbar.component';

@Component({
  selector: 'app-web-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  styles: [`
  :host ::ng-deep .pi-eye,
  :host ::ng-deep .pi-eye-slash {
      transform:scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
  }
`]
})

export class WebAboutComponent implements OnInit {
  @ViewChild(TopNavBarComponent) topNavBar!: TopNavBarComponent;
  constructor(private router: Router, public layoutService: LayoutService, private toastrService: ToastrService) { }

  ngOnInit(): void {

  };

}
