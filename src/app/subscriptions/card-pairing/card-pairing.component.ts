import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-card-pairing',
  templateUrl: './card-pairing.component.html',
  styleUrls: ['./card-pairing.component.css'],
  providers: [ConfirmationService]
})
export class CardPairingComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService) {

  }

  frm: FormGroup = new FormGroup({
    id: new FormControl(""),
    cardNumber: new FormControl(""),
    irdnumber: new FormControl(""),
  })

  ngOnInit(): void {

    this.frm = this.fb.group({
      id: [""],
      cardNumber: ["", [Validators.required]],
      irdnumber: ["", [Validators.required]],
    });

  }

  pair() {
    if (this.frm.invalid) return false;
    console.log(this.frm.value);
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.gSvc.postdata("api/STBAssign/PairCard", JSON.stringify(this.frm.value)).subscribe(res => {
          console.log(this.frm.value);
          this.frm.reset();
          this.toastrService.success("Card Pair Successful");
        }, err => {
          this.toastrService.error("Pair Error");
        })
        return true;
      },
      reject: () => {

      }

    })
    return false;
  }

  unpair() {
    if (this.frm.invalid) return false;
    console.log(this.frm.value);
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.gSvc.postdata("api/STBAssign/UnPairCard", JSON.stringify(this.frm.value)).subscribe(res => {
          console.log(this.frm.value);
          this.frm.reset();
          this.toastrService.success("Card unpair Successful");
        }, err => {
          this.toastrService.error("Unpair error");
        })
        return true;
      },
      reject: () => {

      }

    })
    return false;
  }

  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }
}