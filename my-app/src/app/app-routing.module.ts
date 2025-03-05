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

const routes: Routes = [
  { path: '', component: HomeComponent }, // Trang chủ
  { path: 'register', component: RegisterComponent },
  { path: 'dangnhap', component: SigninComponent },
  { path: 'dangky', component: SignupComponent },
  { path: 'sanpham', component: ProductComponent }, // Trang danh sách sản phẩm
  { path: 'sanphamchitiet', component: ProductDetailComponent }, // Chi tiết sản phẩm (id động)
  { path: 'giohang', component: CartComponent }, // Giỏ hàng
  { path: 'thanhtoan', component: CheckoutComponent }, // Thanh toán
  { path: 'gioithieu', component: AboutComponent }, // Giới thiệu
  { path: 'lienhe', component: ContactComponent }, // Liên hệ
  { path: '**', redirectTo: '' } // Điều hướng về trang chủ nếu không tìm thấy đường dẫn

  // {path:'quenmatkhau',component:#},
  ];  
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
