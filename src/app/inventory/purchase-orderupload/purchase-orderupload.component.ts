import { HttpClient, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { GeneralService } from 'src/app/services/general.service';
interface orderFormSubmissionResult { };
@Component({
  selector: 'app-purchase-orderupload',
  templateUrl: './purchase-orderupload.component.html',
  styleUrls: ['./purchase-orderupload.component.css']
})


export class PurchaseOrderuploadComponent {

  fileToUpload: any;
  frm!: FormGroup;

  constructor(private readonly httpClient: HttpClient, private gSvc: GeneralService, private fb: FormBuilder) { }

  ngOnInit() {
    this.frm = this.fb.group({
      orderNo: new FormControl(''),
      supplier: new FormControl(''),
      orderfile: new FormControl(),
    });
  }
  public pageTitle = 'Welcome to fileupload component';
  


  handleFileInput(event: Event) {
    // Access the file from the event object
    const target = event.target as HTMLInputElement;
    const file: File | null = target.files?.[0] || null;

    if (file) {
      this.fileToUpload = file;
      // Handle the file
      // You can access the file properties like file.name, file.size, etc.
    } else {
      alert("Error");
      // No file selected or an error occurred
    }
  }

  submitForm() {
    
    const formData: FormData = new FormData();
    //formData.append("cardNumber", "asjalkd")
    formData.append('fileSource', this.fileToUpload);
    return this.gSvc.postdatafile('Security/Menu/UploadFile', formData).subscribe(() => alert("File uploaded"));
  }

}
