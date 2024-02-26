import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
    providedIn: 'root'
})
export class ExportService {

    // exportToExcel(data: any[], fileName: string): void {
    //     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    //     XLSX.writeFile(wb, `${fileName}.xlsx`);
    // }

    exportTExcel(data: any[], fileName: string): void {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, fileName);
    }

    exportToExcel(data: any[], fileName: string, columns: string[]): void {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
          data.map(item => {
              const exportedItem: any = {};
              columns.forEach(column => {
                  exportedItem[column] = item[column];
              });
              return exportedItem;
          })
      );
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, fileName);
  }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url: string = window.URL.createObjectURL(data);
        const a: HTMLAnchorElement = document.createElement('a');
        a.href = url;
        a.download = fileName + '.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }

}
