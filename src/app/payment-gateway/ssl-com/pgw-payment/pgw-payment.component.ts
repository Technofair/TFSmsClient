import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { distinct, from, map } from 'rxjs';
import { ChieldPaymentComponent } from 'src/app/website/chield-payment/chield-payment.component';
@Component({
  selector: 'app-pgw-payment',
  templateUrl: './pgw-payment.component.html',
  styleUrls: ['./pgw-payment.component.css']
})
export class PgwPaymentComponent implements OnInit {
  @ViewChild(ChieldPaymentComponent) toppayment!: ChieldPaymentComponent;
  gateways:any;
  getWayaList:any;
  distinctTyp:any;
  getArray : any =[{id:1 ,name:'Mobile Banking',chield:[]},{id:2 ,name:'Internet Banking',chield:[]},{id:3 ,name:'Card',chield:[]}]
    constructor(private gsv:GeneralService) {
    }
    ngOnInit(){
      this.getPaymentList();
    }
    getPaymentList(){
      this.gsv.postdata("api/MFSPGW/GetSSLCommerzGrantToken?deviceNumberId=553&&paymentMethodId=5", {}).subscribe(res => {
       this.gateways=res.desc;
       this.getData();
      })
      console.log(this.getArray);
    }
    getData(){
      this.gateways.forEach((element:any) => {
        if(element.type=='internetbanking'){
          var mb =this.getArray.filter((x:any)=>x.id==2)[0];
          mb.chield.push(element);
        }else if(element.type=='mobilebanking'){
          var mb =this.getArray.filter((x:any)=>x.id==1)[0];
          mb.chield.push(element);
        }else{
          var mb =this.getArray.filter((x:any)=>x.id==3)[0];
          mb.chield.push(element);
        }
      });
    }
    getWayaLists(data:any){
      debugger
      var dt=this.getArray.find((x: { id: any; })=>x.id==data);
      this.getWayaList=dt.chield;
    }
}
