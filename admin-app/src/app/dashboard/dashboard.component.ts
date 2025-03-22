import { AfterViewInit, Component } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    this.createLineChart();
    this.createPieChart();
  }

  private createLineChart(): void {
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [
            {
              label: 'Total Income',
              data: [4, 3, 5, 7, 8.5, 8, 7.5],
              borderColor: 'red',
              borderWidth: 2,
              fill: false,
              tension: 0.4,
              pointRadius: 0,
            },
            {
              label: 'Total Revenue',
              data: [2, 5, 3, 6, 9, 7, 8],
              borderColor: 'black',
              borderWidth: 2,
              fill: false,
              tension: 0.4,
              pointRadius: 0,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { mode: 'index', intersect: false }
          },
          scales: {
            y: {
              beginAtZero: false,
              min: 2,
              max: 10,
              ticks: { stepSize: 2 }
            },
            x: { grid: { display: false } }
          }
        }
      });
    }
  }

  private createPieChart(): void {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Scented Candle Type 1', 'Scented Candle Type 2', 'Scented Candle Type 3', 'Scented Candle Type 4'],
          datasets: [{
            data: [38, 26, 10, 5],
            backgroundColor: ['rgb(0, 51, 204)', 'rgb(0, 102, 255)', 'rgb(51, 153, 255)', 'rgb(255, 204, 0)'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `${context.label || ''}: ${context.parsed || 0}%`
              }
            }
          }
        }
      });
    }
  }
}
