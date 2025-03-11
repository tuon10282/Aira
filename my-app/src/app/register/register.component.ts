import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserAPIService } from '../user-api.service';
import { Users } from '../../classes/Users';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  // For registration
  user: Users = new Users();
  
  // For login
  loginData: { Email: string, Password: string } = { Email: '', Password: '' };
  
  errMessage: string = '';
  isActive: boolean = false;
  
  // Password visibility toggles
  showPassword: boolean = false;
  showLoginPassword: boolean = false;
  
  @ViewChild('container') container!: ElementRef;
  @ViewChild('userForm') userForm!: NgForm;
  @ViewChild('loginForm') loginForm!: NgForm;
  
  constructor(private _service: UserAPIService) {}
  
  ngAfterViewInit() {
    console.log("Container:", this.container);
  }
  
  toggleRegister() {
    if (this.container && this.container.nativeElement) {
      this.container.nativeElement.classList.add('active');
    }
  }
  
  toggleLogin() {
    if (this.container && this.container.nativeElement) {
      this.container.nativeElement.classList.remove('active');
    }
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    console.log("Password visibility:", this.showPassword);
  }
  
  toggleLoginPasswordVisibility() {
    this.showLoginPassword = !this.showLoginPassword;
    console.log("Login password visibility:", this.showLoginPassword);
  }
  
  // Gán giá trị cho user
  public setUser(u: Users) {
    this.user = u;
  }
  
  // Gửi dữ liệu user lên server
  postUser() {
    // Kiểm tra tính hợp lệ của form
    if (this.userForm.invalid) {
      let errorMessage = "Please correct the following issues:";
      
      // Kiểm tra lỗi cho trường Name
      if (this.userForm.controls['name']?.invalid) {
        if (this.userForm.controls['name'].errors?.['required']) {
          errorMessage += "\n- Name is required";
        }
        if (this.userForm.controls['name'].errors?.['minlength']) {
          errorMessage += "\n- Name must be at least 3 characters";
        }
      }
      
      // Kiểm tra lỗi cho trường Email
      if (this.userForm.controls['email']?.invalid) {
        if (this.userForm.controls['email'].errors?.['required']) {
          errorMessage += "\n- Email is required";
        }
        if (this.userForm.controls['email'].errors?.['email']) {
          errorMessage += "\n- Invalid email format";
        }
      }
      
      // Kiểm tra lỗi cho trường Password
      if (this.userForm.controls['password']?.invalid) {
        if (this.userForm.controls['password'].errors?.['required']) {
          errorMessage += "\n- Password is required";
        }
        if (this.userForm.controls['password'].errors?.['minlength']) {
          errorMessage += "\n- Password must be at least 6 characters";
        }
      }
      
      // Hiển thị alert với tất cả các lỗi
      alert(errorMessage);
      return; // Dừng xử lý tiếp theo
    }
    
    // Nếu form hợp lệ, tiến hành gửi dữ liệu
    this._service.postUser(this.user).subscribe({
      next: (data) => {
        console.log("User created successfully:", data);
        
        if (typeof data === "string") {
          this.user = JSON.parse(data);
        } else {
          this.user = data;
        }
        
        alert("Account created successfully!");
        this.toggleLogin(); // Automatically switch to login form after successful registration
      },
      error: (err) => {
        console.error("Error:", err);
        this.errMessage = err;
        alert("Error creating account: " + err);
      }
    });
  }
  
  // Login user functionality
  loginUser() {
    // Kiểm tra tính hợp lệ của form login
    if (this.loginForm.invalid) {
      let errorMessage = "Please correct the following issues:";
      
      // Kiểm tra lỗi cho trường Email
      if (this.loginForm.controls['loginEmail']?.invalid) {
        if (this.loginForm.controls['loginEmail'].errors?.['required']) {
          errorMessage += "\n- Email is required";
        }
        if (this.loginForm.controls['loginEmail'].errors?.['email']) {
          errorMessage += "\n- Invalid email format";
        }
      }
      
      // Kiểm tra lỗi cho trường Password
      if (this.loginForm.controls['loginPassword']?.invalid) {
        if (this.loginForm.controls['loginPassword'].errors?.['required']) {
          errorMessage += "\n- Password is required";
        }
      }
      
      // Hiển thị alert với tất cả các lỗi
      alert(errorMessage);
      return; // Dừng xử lý tiếp theo
    }
    
    // Nếu form hợp lệ, tiến hành đăng nhập
    // Ở đây bạn cần thêm service method cho đăng nhập
    this._service.loginUser(this.loginData).subscribe({
      next: (data) => {
        console.log("Login successful:", data);
        alert("Login successful!");
        // Xử lý thành công, ví dụ: redirect hoặc lưu token
      },
      error: (err) => {
        console.error("Login error:", err);
        alert("Login failed: " + err);
      }
    });
  }
}