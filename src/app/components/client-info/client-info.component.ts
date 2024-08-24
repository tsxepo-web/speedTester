import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SpeedDataService } from '../../services/speed-data.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-client-info',
  standalone: true,
  imports: [NgIf, CommonModule],
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.css'],
})
export class ClientInfoComponent implements OnInit {
  downloadSpeed: number = 0;
  uploadSpeed: number = 0;
  clientInfo: any = {};
  userId: string = '';

  constructor(
    private userInfoService: UserService,
    private speedDataService: SpeedDataService
  ) {}

  ngOnInit(): void {
    this.subscribeToSpeedData();
    this.userId = this.userInfoService.getUserId();
    this.fetchClientInfo();
  }

  private subscribeToSpeedData(): void {
    this.speedDataService.downloadSpeed$.subscribe(
      (speed) => (this.downloadSpeed = speed)
    );

    this.speedDataService.uploadSpeed$.subscribe(
      (speed) => (this.uploadSpeed = speed)
    );
  }

  private fetchClientInfo(): void {
    this.userInfoService.getUserInfo().subscribe({
      next: (data) => this.handleClientInfoResponse(data),
      error: (error) => this.handleClientInfoError(error),
    });
  }

  private handleClientInfoResponse(data: any): void {
    this.clientInfo = data;
    this.userInfoService.storeUserInfoInSessionStorage(
      data.ip_address,
      data.connection.isp_name,
      data.city
    );
  }

  private handleClientInfoError(error: any): void {
    console.error('Error fetching client info:', error);
  }
}
