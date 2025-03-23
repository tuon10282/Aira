// dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define proper interfaces for the responses
export interface DashboardStats {
  allOrders: any;
  monthlyRevenue: number;
  newSales: number;
  totalUniqueCustomers: number; // Changed field name
}

export interface RevenueData {
  labels: string[];
  income: number[];
  revenue: number[];
}

export interface ProductSaleItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface ProductSalesData {
  totalSoldQuantity: number;
  productQuantities: { name: string; quantity: number }[];
  labels: string[];
  data: number[];
  legend: ProductSaleItem[];
}

export interface RecentOrder {
  orderId: string;
  productName: string;
  orderDate: Date;
  price: number;
  status: string;
}


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3002'; // Your Express server URL

  constructor(private http: HttpClient) { }

  // Get dashboard stats
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`);
  }

  // Get revenue data for chart
  getRevenueData(): Observable<RevenueData> {
    return this.http.get<RevenueData>(`${this.apiUrl}/dashboard/revenue`);
  }

  // Get product sales data for pie chart
  getProductSalesData(): Observable<ProductSalesData> {
    return this.http.get<ProductSalesData>(`${this.apiUrl}/dashboard/product-sales`);
  }

  // Get recent orders
  getRecentOrders(): Observable<RecentOrder[]> {
    return this.http.get<RecentOrder[]>(`${this.apiUrl}/dashboard/recent-orders`);
  }
}