import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductComponent } from './product/product.component';
import { CustomersComponent } from './customers/customers.component';
import { OrderComponent } from './order/order.component';
import { CategoryComponent } from './category/category.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AddProductComponent } from './add-product/add-product.component';

const routes: Routes = [
  { path: '', component: DashboardComponent }, // Trang chủ
  { path: 'product', component: ProductComponent }, // Trang chủ
  { path: 'addproduct', component: AddProductComponent }, // Trang chủ
  { path: 'customer', component: CustomersComponent }, // Trang chủ
  { path: 'order', component: OrderComponent }, // Trang chủ
  { path: 'category', component: CategoryComponent }, // Trang chủ
  { path: 'feedback', component: FeedbackComponent }, // Trang chủ
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
