import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PannelComponent } from './pannel/pannel.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductComponent } from './product/product.component';
import { CustomersComponent } from './customers/customers.component';
import { OrderComponent } from './order/order.component';
import { CategoryComponent } from './category/category.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { BlogComponent } from './blog/blog.component';
import { HttpClientModule } from '@angular/common/http';
import { AddProductComponent } from './add-product/add-product.component'; // Import HttpClientModule
import { FormsModule } from '@angular/forms';
import { UpdateProductComponent } from './update-product/update-product.component';
import { UpdateOrderComponent } from './update-order/update-order.component';
import { BlogUpdateComponent } from './blog-update/blog-update.component';
import { RouterModule, Routes } from '@angular/router';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { CustomerUpdateComponent } from './customer-update/customer-update.component'; // Import RouterModule and Routes

@NgModule({
  declarations: [
    AppComponent,
    PannelComponent,
    CustomersComponent,
    OrderComponent,
    CategoryComponent,
    ProductComponent,
    AddProductComponent,
    UpdateProductComponent,
    UpdateOrderComponent,
    BlogUpdateComponent,
    BlogComponent,
    AddBlogComponent,
    CustomerUpdateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FeedbackComponent,
    DashboardComponent


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
