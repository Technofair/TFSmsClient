import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportViewer } from './reportviewer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
//import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';


@NgModule({
  declarations: [
    ReportViewer//, LoadingSpinnerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ReportViewer,
  ]
})
export class ReportViewerModule { }
