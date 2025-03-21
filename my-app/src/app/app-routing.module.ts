import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { RegisterComponent } from './register/register.component';
import { ErrorComponent } from './error/error.component';
import { AuthGuard } from './auth.guard';
import { FeedbackComponent } from './feedback/feedback.component';
import { ProfileComponent } from './profile/profile.component';
import { BlogComponent } from './blog/blog.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';

const routes: Routes = [
  { path: '', component: HomeComponent,canActivate: [AuthGuard] }, // Trang chủ
  { path: 'order-confirmation/:orderId', component: OrderConfirmationComponent },
  { path: 'home', component: HomeComponent }, // Trang chủ
  { path: 'register', component: RegisterComponent },
  { path: 'sanpham', component: ProductComponent }, // Trang danh sách sản phẩm
  { path: 'giohang', component: CartComponent }, // Giỏ hàng
  { path: 'thanhtoan', component: CheckoutComponent }, // Thanh toán
  { path: 'gioithieu', component: AboutComponent }, // Giới thiệu
  { path: 'lienhe', component: ContactComponent }, // Liên hệ
  { path: 'view-product-detail/:id', component: ProductDetailComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'error', component: ErrorComponent }, // ✅ Route cho trang lỗi
  { path: '**', redirectTo: 'error' }, // ✅ Chuyển hướng đến trang lỗi nếu route không hợp lệ
  
 
  // {path:'quenmatkhau',component:#},
  ];  
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
