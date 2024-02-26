import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    getReportData(): Observable<any[]> {
        const dummyData = [
            {
                email: 'example1@example.com',
                name: 'John Doe',
                mobileNo: '1234567890',
                address: '123 Main St'
            },
            
        ];

        return of(dummyData);
    }
}
