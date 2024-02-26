import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Utility } from 'src/app/services/utility.service';

@Component({
  selector: 'app-damage',
  templateUrl: './damage.component.html',
  styleUrls: ['./damage.component.css'],
  providers: [ConfirmationService]
})
export class DamageComponent implements OnInit {
  damageList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  frm!: FormGroup;
  constructor(
    private fb: FormBuilder
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService
    , private toastrService: ToastrService
    , private auth: AuthService
    , private _util: Utility) {
    //this.getCardType();
  }
  // frm: FormGroup = new FormGroup({
  //   Id: new FormControl(0),
  //   RefNo: new FormControl(""),
  //   Date: new FormControl(""),
  //   CmnCompanyId: new FormControl(""),
  //   CmnFinancialYearId: new FormControl(""),
  //   Status: new FormControl(""),
  //   ApprovalStatus: new FormControl(""),
  //   CreatedBy: new FormControl(""),
  //   CreatedDate: new FormControl(""),
  //   ModifiedBy: new FormControl(""),
  //   ModifiedDate: new FormControl(""),

  //   DeviceNumber: new FormControl(''),
  //   PrdDamageId: new FormControl(0),
  //   CmnStoreId: new FormControl(""),
  //   PrdDamageTypeId: new FormControl(""),
  //   PrdProductId: new FormControl(""),
  //   // currentStock: new FormControl(""),
  //   Quantity: new FormControl(""),
  //   Rate: new FormControl(""),
  //   Reason: new FormControl(""),
  // })

  ngOnInit(): void {
    this.frm = this.fb.group({
      Id: [0, [Validators.required]],
      RefNo: ["ref", [Validators.required]],
      Date: [this._util.Today(), [Validators.required]],
      CmnCompanyId: [this.auth.getCompany(), [Validators.required]],
      CmnFinancialYearId: ["1", [Validators.required]],
      Status: [""],
      ApprovalStatus: [""],
      CreatedBy: [this.auth.getUserId(), [Validators.required]],
      CreatedDate: [this._util.Today(), [Validators.required]],
      ModifiedBy: [""],
      ModifiedDate: [""],

      DeviceNumber: [''],
      PrdDamageId: [0, [Validators.required]],
      CmnStoreId: [null, [Validators.required]],
      PrdDamageTypeId: [null, [Validators.required]],
      PrdProductId: [null, [Validators.required]],
      // currentStock: [0],
      Quantity: [1, [Validators.required]],
      Rate: [0, [Validators.required]],
      Reason: [null, [Validators.required]],
    });

    this.frmSearch();

    // this.getCardType();
    this.getCompany();
    this.getDamageType();
    this.getProducts();
    this.getStore();

    this.search();
  }


  companies: any[] = [];
  getCompany() {
    this.gSvc.postdata("Common/Company/GetClientByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
      this.companies = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  damageTypes: any[] = [];
  getDamageType() {
    this.gSvc.postdata("Inventory/DamageType/GetAll/", {}).subscribe((res: any) => {
      this.damageTypes = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  products: any[] = [];
  getProducts() {
    this.gSvc.postdata("Inventory/Product/GetTransactionableProducts", {}).subscribe(res => {
      debugger;
      this.products = res;
    }, err => {
      this.toastrService.error("error");
    })
  }

  storeList: any[] = [];
  getStore() {
    this.gSvc.postdata("Common/Store/GetByCompanyId/" + this.auth.getCompany(), {}).subscribe(res => {
      this.storeList = res;
      this.frm.controls['CmnStoreId'].setValue(this.storeList[0].id);
    }, err => {
      this.toastrService.error("Error! Store not found");
    })
  }

  prodStock: number = 0;
  getProdStockRate() {
    debugger;
    var objFrm = this.frm.value;
    var obj = {
      cmnCompanyId: objFrm.CmnCompanyId,
      cmnFinancialYearId: 1,
      cmnStoreId: objFrm.CmnStoreId,
      prdProductId: objFrm.PrdProductId
    };
    this.gSvc.postdata("Inventory/Challan/GetCurrentStockByParam", JSON.stringify(obj)).subscribe((res: any) => {
      debugger;
      // this.frm.controls["currentStock"].setValue(res.currentStock);
      this.frm.controls["Rate"].setValue(res.salesRate);
      // objFrm.Quantity = res.currentStock;
      // objFrm.Rate = res.salesRate;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  addrows() {
    debugger;
    var frmVal = this.frm.value;
    if (frmVal.Quantity > 0) {
      if (frmVal.Id > 0) {
        var dtl = this.details.filter(x => x.prdDamageId == frmVal.PrdDamageId)[0];

        dtl.prdDamageId = frmVal.PrdDamageId;
        dtl.cmnStoreId = frmVal.CmnStoreId;
        dtl.deviceNumber = frmVal.DeviceNumber,
          dtl.prdDamageTypeId = frmVal.PrdDamageTypeId;

        dtl.prdProductId = frmVal.PrdProductId;
        dtl.name = this.products.filter(x => x.id == frmVal.PrdProductId)[0].name;
        // dtl.currentStock= frmVal.currentStock,
        dtl.quantity = frmVal.Quantity;
        dtl.rate = frmVal.Rate;
        dtl.reason = frmVal.Reason
      } else {
        var chkdetails = this.details.filter(x => x.prdProductId == frmVal.PrdProductId)
        if (chkdetails.length == 0) {
          this.details.push({
            id: frmVal.Id,
            prdDamageId: frmVal.PrdDamageId,
            cmnStoreId: frmVal.CmnStoreId,
            deviceNumber: frmVal.DeviceNumber,
            // store: this.storeList.filter(x => x.id == frmVal.CmnStoreId)[0].name,
            prdDamageTypeId: frmVal.PrdDamageTypeId,
            // damageType: this.damageTypes.filter(x => x.id == frmVal.PrdDamageTypeId)[0].name,
            prdProductId: frmVal.PrdProductId,
            name: this.products.filter(x => x.id == frmVal.PrdProductId)[0].name,
            // currentStock: frmVal.currentStock,
            quantity: frmVal.Quantity,
            rate: frmVal.Rate,
            reason: frmVal.Reason
          });
        }
      }
    }
  }

  details: any[] = [];

  editDtl(entity: any) {
    this.frm.controls["Id"].setValue(entity.prdDamageId);
    this.frm.controls["PrdDamageId"].setValue(entity.prdDamageId);
    this.frm.controls["CmnStoreId"].setValue(entity.cmnStoreId);
    this.frm.controls["DeviceNumber"].setValue(entity.deviceNumber);
    this.frm.controls["PrdDamageTypeId"].setValue(entity.prdDamageTypeId);
    this.frm.controls["PrdProductId"].setValue(entity.prdProductId);
    // this.frm.controls["currentStock"].setValue(entity.currentStock);
    this.frm.controls["Quantity"].setValue(entity.quantity);
    this.frm.controls["Rate"].setValue(entity.rate);
    this.frm.controls["Reason"].setValue(entity.reason);
  }

  removeRow(index: number): void {
    this.details.splice(index, 1); // 'index' is the index of the row you want to remove
  }

  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var frmMstr = this.frm.value;
        var obj = {
          id: frmMstr.Id,
          refNo: frmMstr.PrdDamageId == 0 ? 'ref' : frmMstr.RefNo,
          date: this._util.Today(),
          cmnCompanyId: this.auth.getCompany(),
          cmnFinancialYearId: 1,
          remarks: frmMstr.Reason,
          createdBy: this.auth.getUserId(),
          createdDate: this._util.Today(),
          modifiedBy: this.auth.getUserId(),
          modifiedDate: this._util.Today()
        };

        var details = {
          id: frmMstr.Id,
          prdDamageId: frmMstr.PrdDamageId,
          cmnStoreId: frmMstr.CmnStoreId,
          deviceNumber: frmMstr.DeviceNumber,
          prdDamageTypeId: frmMstr.PrdDamageTypeId,
          prdProductId: frmMstr.PrdProductId,
          quantity: frmMstr.Quantity,
          rate: frmMstr.Rate,
          reason: frmMstr.Reason
        };

        let requestBody = { obj: obj, list: details };
        if (this.formId == 0) {
          this.gSvc.postdata("Inventory/Damage/Save", requestBody).subscribe(res => {
            this.frm.reset();
            this.details = [];
            this.search();
            this.toastrService.success("Damage Saved");
          }, err => {
            this.toastrService.error("Error! Damage Not Saved");
          })
        } else if (this.formId == 1) {
          this.gSvc.postdata("Inventory/Damage/Save", requestBody).subscribe(res => {
            this.frm.reset();
            this.details = [];
            this.formId = 0;
            this.search();
            this.toastrService.success("Damage Updated");
          }, err => {
            this.toastrService.error("Error! Damage Not updated");
          })
        } else {
          this.toastrService.error("System error!");
        }
        return true;
      },
      reject: () => {

      }

    })
    return false;
  }

  searchFrm!: FormGroup;

  frmSearch() {
    this.searchFrm = this.fb.group({
      refNo: new FormControl(),
      fromDate: new FormControl(),
      toDate: new FormControl(),
      // slsCustomerId: new FormControl(),
      // prdEditionId: new FormControl(),
      cmnCompanyId: new FormControl(),
      // cmnFinancialYearId: new FormControl(),
      cmnStoreId: new FormControl(),
      partyId: new FormControl(),
      hrmEmployeeId: new FormControl()
    })
  }

  search() {
    debugger;
    var obj = this.searchFrm.value;
    obj.cmnCompanyId = this.auth.getCompany();
    this.gSvc.postdata("Inventory/Damage/SearchDamage", obj).subscribe(res => {
      debugger;
      this.damageList = res;

    }, err => {
      this.toastrService.error("Error! list not found");
    })
  }
  selectedRow:any;
  edit(id: any) {
    this.selectedRow=id;
    this.formId = 1;
    this.search();
    this.gSvc.postdata("Inventory/Damage/GetDamageDetailByDamageAndProductId/" + id + "", {}).subscribe((res: any) => {
      debugger;
      this.frm.controls["Id"].setValue(res.objView.prdDamageId);
      this.frm.controls["RefNo"].setValue(res.objDamage.refNo);
      this.frm.controls["PrdDamageId"].setValue(res.objView.prdDamageId);
      this.frm.controls["CmnStoreId"].setValue(res.objView.cmnStoreId);
      this.frm.controls["DeviceNumber"].setValue(res.objView.deviceNumber);
      this.frm.controls["PrdDamageTypeId"].setValue(res.objView.prdDamageTypeId);
      this.frm.controls["PrdProductId"].setValue(res.objView.prdProductId);
      this.frm.controls["Quantity"].setValue(res.objView.quantity);
      this.frm.controls["Rate"].setValue(res.objView.rate);
      this.frm.controls["Reason"].setValue(res.objView.reason);
    }, err => {
      this.toastrService.error("Error! Damage not found");
    })
  }

  showModalDialog(id: any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("api/CardType/BoxType/" + id + "", {}).subscribe((res: any) => {
      this.viewInfo = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/inventory/damage')
  }
  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }
  clear(table: Table) {
    table.clear();
  }
}