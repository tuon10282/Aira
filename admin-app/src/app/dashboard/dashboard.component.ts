import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { 
  DashboardService, 
  DashboardStats, 
  RevenueData, 
  ProductSalesData, 
  RecentOrder
} from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DatePipe],
})
export class DashboardComponent implements AfterViewInit, OnInit {
  monthlyRevenue: number = 0;
  newSales: number = 0;
  newProductsInThreeDays: number = 0;

  revenueData: RevenueData = { labels: [], income: [], revenue: [] };
  productSalesData: ProductSalesData = {
    labels: [], data: [], legend: [],
    totalSoldQuantity: 0,
    productQuantities: []
  };
  recentOrders: RecentOrder[] = [];

  lineChart: Chart | null = null;
  pieChart: Chart | null = null;
  allOrders: any;
totalUniqueCustomers: any;

  constructor(private dashboardService: DashboardService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createLineChart();
      this.createPieChart();
    }, 500);
  }

  loadDashboardData(): void {
    this.dashboardService.getDashboardStats().subscribe({
      next: (data: DashboardStats) => {
        this.monthlyRevenue = data.monthlyRevenue;
        this.newSales = data.newSales;
        this.allOrders = data.allOrders;
        this.totalUniqueCustomers = data.totalUniqueCustomers; 
      },
      error: (err) => {
        console.error('Error loading dashboard stats:', err);
      }
    });

    this.dashboardService.getRevenueData().subscribe({
      next: (data: RevenueData) => {
        console.log("Product Sales Data:", data); // Debug
        this.revenueData = data;
        this.createLineChart();
      },
      error: (err) => {
        console.error('Error loading revenue data:', err);
      }
    });

    // this.dashboardService.getProductSalesData().subscribe({
    //   next: (data: ProductSalesData) => {
    //     this.productSalesData = data;
    //     // this.createPieChart();
    //   },
    //   error: (err) => {
    //     console.error('Error loading product sales data:', err);
    //   }
    // });

    this.dashboardService.getRecentOrders().subscribe({
      next: (data: RecentOrder[]) => {
        this.recentOrders = data.map(order => ({
          ...order,
          orderDate: order.orderDate ? new Date(order.orderDate) : new Date()
        }));
      },
      error: (err) => {
        console.error('Error loading recent orders:', err);
      }
    });
  }

  private createLineChart(): void {
    const canvas = document.getElementById('lineChart') as HTMLCanvasElement;
    if (!canvas || !this.revenueData.labels.length) return;

    if (this.lineChart) this.lineChart.destroy();

    this.lineChart = new Chart(canvas, {
type: 'line',
      data: {
        labels: this.revenueData.labels,
        datasets: [
          {
            label: 'Total Income',
            data: this.revenueData.income,
            borderColor: 'red',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
          },
          {
            label: 'Total Revenue',
            data: this.revenueData.revenue,
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
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: Math.min(...this.revenueData.income, ...this.revenueData.revenue) * 0.8,
            max: Math.max(...this.revenueData.income, ...this.revenueData.revenue) * 1.2,
            ticks: { stepSize: 2 }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }

  private createPieChart(): void {
    const canvas = document.getElementById('pieChart') as HTMLCanvasElement;
    if (!canvas || !this.productSalesData.labels.length) return;
  
    if (this.pieChart) this.pieChart.destroy();
  
    this.pieChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: this.productSalesData.labels,
        datasets: [{
          data: this.productSalesData.data,
          backgroundColor: ['rgb(0, 51, 204)', 'rgb(0, 102, 255)', 'rgb(51, 153, 255)', 'rgb(255, 204, 0)', 'rgb(128, 128, 128)'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
  formatCurrency(value: number): string {
    return value.toLocaleString('vi-VN') + ' VND';
  }
}