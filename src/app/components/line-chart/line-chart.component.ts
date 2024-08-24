import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { Chart, Plugin } from 'chart.js/auto';
import { BaseChartDirective } from 'ng2-charts';
import 'chartjs-adapter-date-fns';

const whiteBackgroundPlugin: Plugin<'line'> = {
  id: 'whiteBackground',
  beforeDraw: (chart) => {
    const ctx = chart.ctx;
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};
Chart.register(whiteBackgroundPlugin);

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css',
})
export class LineChartComponent {
  historicalData: any[] = [];
  chart: any;

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('user_id');
    this.backendService.getHistoricalData(userId).subscribe((data) => {
      this.historicalData = data;
      this.createChart();
    });
  }

  createChart() {
    this.chart = new Chart('line-chart', {
      type: 'line',
      data: {
        labels: this.historicalData.map((d) => d.date),
        datasets: [
          {
            label: 'Download Speed',
            data: this.historicalData.map((d) => d.downloadSpeed),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'upload speed',
            data: this.historicalData.map((d) => d.uploadSpeed),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
            },
            title: {
              display: true,
              text: 'Date',
              font: {
                size: 14,
              },
              color: '#333',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Speed (Mbps)',
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
