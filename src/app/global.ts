// import { Injectable } from '@angular/core'

// @Injectable()
// export class GlobalSharedService {
//   public balance:number = 0;
// }

// export let globalVariables: any = {
//     version: '1.3.3.7',
//     author: '0x1ad2',
//     everything: 42,
//     balance:0
//    };

//'use strict';

// export const sep='/';
// export const version: string="22.2.2"; 
// export var balance:number=0;

// export class GlobalModel {
//     balance: number = 0;
//     constructor(balance: number) {

//         this.balance = balance;
//     }
// }

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class balanceService {

    private rechargeBalance = new BehaviorSubject(0);
    currentBalance = this.rechargeBalance.asObservable();

    constructor() {

    }
    updateCurrentBalance(balance: number) {
        this.rechargeBalance.next(balance);
    }
}