import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { UserService } from '../../services/user.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css',
})
export class BarChartComponent {
  ispResults: any;
  chart: any;

  ngOnInit(): void {
    const userInfo = this.userInfoService.getUserInfoFromSessionStorage();
    const location = userInfo?.city || 'Unknown City';
    this.backendService.getIspResult(location!).subscribe((data: any) => {
      this.ispResults = data.isPs;
      this.createChart();
    });
  }
  constructor(
    private backendService: BackendService,
    private userInfoService: UserService
  ) {}

  createChart() {
    var isps = this.ispResults.map((d: any) => d.isp);
    var downloadSpeed = this.ispResults.map((d: any) => d.downloadSpeed);
    const uploadSpeed = this.ispResults.map((d: any) => d.uploadSpeed);

    this.chart = new Chart('bar-chart', {
      type: 'bar',
      data: {
        labels: isps,
        datasets: [
          {
            label: 'Download Speed',
            data: downloadSpeed,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            label: 'Upload Speed',
            data: uploadSpeed,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        scales: {
          y: {
            title: {
              display: true,
              text: 'Speed',
              font: {
                size: 14,
              },
              color: '#333',
            },
          },
        },
      },
    });
  }
}
