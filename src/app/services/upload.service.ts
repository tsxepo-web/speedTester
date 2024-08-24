import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, last, map, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private apiUrl = 'https://httpbin.org/post';

  constructor(private http: HttpClient) {}

  uploadFile(): Observable<{ duration: number; fileSize: number }> {
    const startTime = new Date().getTime();
    const sizeBytes = 1 * 1024 * 1024;
    const formData = new FormData();
    formData.append('file', new Blob([new ArrayBuffer(sizeBytes)]));
    const req = new HttpRequest('POST', `${this.apiUrl}`, formData, {
      reportProgress: true,
    });
    return this.http.request(req).pipe(
      tap((event) => {
        if (event.type === HttpEventType.DownloadProgress) {
          const percentDone = event.total
            ? Math.round((100 * event.loaded) / event.total)
            : 0;
        }
      }),
      last(),
      map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.Response) {
          const endTime = new Date().getTime();
          return {
            duration: endTime - startTime,
            fileSize: sizeBytes,
          };
        }
        return { duration: 0, fileSize: 0 };
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => {
      new error('An error occurred while uploading your file.');
    });
  }
}
