import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductComponent } from './product/product.component';
import { CustomersComponent } from './customers/customers.component';
import { OrderComponent } from './order/order.component';
import { CategoryComponent } from './category/category.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AddProductComponent } from './add-product/add-product.component';
import { BlogComponent } from './blog/blog.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { UpdateOrderComponent } from './update-order/update-order.component';
import { BlogUpdateComponent } from './blog-update/blog-update.component';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { CustomerUpdateComponent } from './customer-update/customer-update.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'update-product', component: UpdateProductComponent },
  { path: 'product', component: ProductComponent },
  { path: 'addproduct', component: AddProductComponent },
  { path: 'addblog', component: AddBlogComponent },
  { path: 'customer', component: CustomersComponent }, 
  { path: 'order', component: OrderComponent }, 
  { path: 'category', component: CategoryComponent }, 
  { path: 'feedback', component: FeedbackComponent }, 
  { path: 'blog', component: BlogComponent },
  { path: 'view-product-detail/:id', component: UpdateProductComponent },
  { path: 'view-order-detail/:id', component: UpdateOrderComponent },
  { path: 'view-blog-detail/:id', component: BlogUpdateComponent },
  { path: 'view-user-detail/:id', component: CustomerUpdateComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
