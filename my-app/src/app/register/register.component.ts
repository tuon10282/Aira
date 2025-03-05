import { Component } from '@angular/core';
import { UserAPIService } from '../user-api.service';
import { Users } from '../../classes/Users';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user: Users = new Users();
  errMessage: string = '';

  constructor(private _service: UserAPIService) {}

  // Gán giá trị cho user
  public setUser(u: Users) {
    this.user = u;
  }

  // Xử lý chọn file ảnh
  onFileSelected(event: any, user: Users) {
    let file = event.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      user.Password = reader.result!.toString(); // Tạm thời gán vào password (có thể thay đổi thành avatar)
    };

    reader.onerror = (error) => {
      console.error('File error: ', error);
    };
  }

  // Gửi dữ liệu user lên server
  postUser() {
    this._service.postUser(this.user).subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        this.errMessage = err;
      }
    });
  }
}
