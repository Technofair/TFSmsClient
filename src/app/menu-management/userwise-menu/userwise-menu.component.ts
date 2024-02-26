import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-userwise-menu',
  templateUrl: './userwise-menu.component.html',
  //styleUrls: ['./userwise-menu.component.css']
})
export class UserwiseMenuComponent {
  checkboxForm: FormGroup | any;
  constructor(private fb: FormBuilder, private gSvc: GeneralService, private toastrService: ToastrService, private router: Router) { 
  }
  ngOnInit() {
    this.checkboxForm = this.fb.group({
      checkboxes: this.fb.array([])
    });
  }

  get checkboxes(): FormArray {
    return this.checkboxForm.get('checkboxes') as FormArray;
  }

  getSelectedCheckboxes() {
    const selectedCheckboxes = this.checkboxForm.value.checkboxes
      .map((checked:any, index:any) => checked ? this.checkboxes.controls[index].value : null)
      .filter((value: any) => value !== null);
  
    //console.log('Selected checkboxes:', selectedCheckboxes);
  }
  clear(table:any) {
    table.clear();
  }
}
