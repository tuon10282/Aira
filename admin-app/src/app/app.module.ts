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

@NgModule({
  declarations: [
    AppComponent,
    PannelComponent,
    DashboardComponent,
    CustomersComponent,
    OrderComponent,
    CategoryComponent,
    FeedbackComponent,
    BlogComponent,
    ProductComponent,
    AddProductComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
