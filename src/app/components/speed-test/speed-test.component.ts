import { Component } from '@angular/core';
import { DownloadService } from '../../services/download.service';
import { UploadService } from '../../services/upload.service';
import { BackendService } from '../../services/backend.service';
import { UserService } from '../../services/user.service';
import { SpeedDataService } from '../../services/speed-data.service';
import { concatMap } from 'rxjs/operators';
import { NgIf } from '@angular/common';
import { ClientInfoComponent } from '../client-info/client-info.component';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { BarChartComponent } from '../bar-chart/bar-chart.component';

@Component({
  selector: 'app-speed-test',
  standalone: true,
  imports: [NgIf, ClientInfoComponent, LineChartComponent, BarChartComponent],
  templateUrl: './speed-test.component.html',
  styleUrl: './speed-test.component.css',
})
export class SpeedTestComponent {
  downloadSpeed: number = 0;
  uploadSpeed: number = 0;
  downloadInProgress: boolean = false;
  uploadInProgress: boolean = false;

  constructor(
    private downloadService: DownloadService,
    private uploadService: UploadService,
    private backendService: BackendService,
    private userInfoService: UserService,
    private speedDataService: SpeedDataService
  ) {}

  startTest() {
    this.prepareUserInfo();

    this.downloadInProgress = true;
    this.uploadInProgress = true;

    this.downloadService
      .startDownload()
      .pipe(
        concatMap((downloadDuration) =>
          this.handleDownloadCompletion(downloadDuration)
        ),
        concatMap(() => this.uploadService.uploadFile()),
        concatMap(async (uploadDuration) =>
          this.handleUploadCompletion(uploadDuration)
        ),
        concatMap((data) => this.backendService.saveData(data))
      )
      .subscribe({
        error: (error) => this.handleTestError(error),
      });
  }

  private prepareUserInfo() {
    const userInfo = this.userInfoService.getUserInfoFromSessionStorage();

    const ip = userInfo?.ip || 'Unknown IP';
    const isp = userInfo?.isp || 'Unknown ISP';
    const city = userInfo?.city || 'Unknown City';

    this.userInfoService.storeUserInfoInSessionStorage(ip, isp, city);
  }

  private handleDownloadCompletion(downloadDuration: {
    duration: number;
    fileSize: number;
  }) {
    this.downloadSpeed = this.calculateSpeed(
      downloadDuration.duration,
      downloadDuration.fileSize
    );
    this.speedDataService.setDownloadSpeed(this.downloadSpeed);
    this.downloadInProgress = false;

    return this.uploadService.uploadFile();
  }

  private handleUploadCompletion(uploadDuration: {
    duration: number;
    fileSize: number;
  }) {
    this.uploadSpeed = this.calculateSpeed(
      uploadDuration.duration,
      uploadDuration.fileSize
    );
    this.speedDataService.setUploadSpeed(this.uploadSpeed);
    this.uploadInProgress = false;

    const userInfo = this.userInfoService.getUserInfoFromSessionStorage();
    const userId = this.userInfoService.getUserId();

    return this.createSpeedTestData(userId, userInfo);
  }

  private createSpeedTestData(userId: string, userInfo: any) {
    return {
      Id: '',
      UserId: userId,
      Ip: userInfo?.ip || 'Unknown IP',
      ISP: userInfo?.isp || 'Unknown ISP',
      Location: userInfo?.city || 'Unknown City',
      UploadSpeed: this.uploadSpeed,
      DownloadSpeed: this.downloadSpeed,
      Date: new Date().toISOString(),
    };
  }

  private handleTestError(error: any) {
    console.error('Test failed:', error);
    this.downloadInProgress = false;
    this.uploadInProgress = false;
  }

  private calculateSpeed(duration: number, dataSizeInBytes: number): number {
    const dataSizeInBits = dataSizeInBytes * 8;
    const durationInSeconds = duration / 1000;
    return dataSizeInBits / durationInSeconds / 1024 / 1024;
  }
}
