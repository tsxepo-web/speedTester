import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpeedDataService {
  private downloadSpeedSubject = new BehaviorSubject<number>(0);
  private uploadSpeedSubject = new BehaviorSubject<number>(0);

  downloadSpeed$: Observable<number> = this.downloadSpeedSubject.asObservable();
  uploadSpeed$: Observable<number> = this.uploadSpeedSubject.asObservable();

  setDownloadSpeed(speed: number) {
    this.downloadSpeedSubject.next(speed);
  }

  setUploadSpeed(speed: number) {
    this.uploadSpeedSubject.next(speed);
  }
}
