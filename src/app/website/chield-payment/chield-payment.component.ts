import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'web-chield-payment',
  templateUrl: './chield-payment.component.html',
  styleUrls: ['./chield-payment.component.css'],
  styles: []
})
export class ChieldPaymentComponent implements OnInit  {
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