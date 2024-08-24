import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private apiUrl = 'https://speedtestbackend.azurewebsites.net/api';

  constructor(private http: HttpClient) {}

  saveData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user`, data);
  }
  getHistoricalData(userId: any): Observable<any[]> {
    const endpoint = `${this.apiUrl}/stats/userId/history?userId=${userId}`;
    return this.http.get<any[]>(endpoint);
  }

  getIspResult(location: string) {
    const endpoint = `${this.apiUrl}/stats/ISP?location=${location}`;
    return this.http.get<any[]>(endpoint);
  }
}
