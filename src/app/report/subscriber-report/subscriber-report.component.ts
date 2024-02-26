import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../layout/service/report.service';
import { ExportService } from '../../layout/service/export.service';

@Component({
  selector: 'app-subscriber-report',
  templateUrl: './subscriber-report.component.html',
  styleUrls: ['./subscriber-report.component.css']
})
export class SubscriberReportComponent implements OnInit {
  reportData: any[] = [];

  constructor(
      private reportService: ReportService,
      private exportService: ExportService
  ) {}

  ngOnInit(): void {
      this.fetchReportData();
  }

  fetchReportData(): void {
      this.reportService.getReportData().subscribe(data => {
          this.reportData = data;
      });
  }

  exportToExcel(): void {
      this.exportService.exportTExcel(this.reportData, 'report_data');
  }
}
