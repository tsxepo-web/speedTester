import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, last, map, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  private apiUrl = 'https://speedtestbackend.azurewebsites.net/api/';

  constructor(private http: HttpClient) {}

  startDownload(): Observable<{ duration: number; fileSize: number }> {
    const startTime = Date.now();
    const req = new HttpRequest(
      'GET',
      `${this.apiUrl}/FileShare/download-test-file`,
      {
        reportProgress: true,
        responseType: 'blob',
      }
    );

    return this.http.request<Blob>(req).pipe(
      tap((event: HttpEvent<Blob>) => {
        if (event.type === HttpEventType.DownloadProgress) {
          const percentDone = event.total
            ? Math.round((100 * event.loaded) / event.total)
            : 0;
          console.log(`Download Progress: ${percentDone}%`);
        }
      }),
      last(),
      map((event: HttpEvent<Blob>) => {
        if (event.type === HttpEventType.Response) {
          const endTime = Date.now();
          const fileSize = (event as HttpResponse<Blob>).body!.size;
          return {
            duration: endTime - startTime,
            fileSize,
          };
        }
        return { duration: 0, fileSize: 0 };
      }),
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(
      () => new Error('An error occurred while downloading your file.')
    );
  }
}
