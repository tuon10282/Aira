export class Users {
    constructor(
        public Name: string = "",
        public Email: string = "", // Sửa kiểu dữ liệu thành string
        public Password: string = ""
    ) {}
}
export interface User {
    Name: string;
    Email: string;
    Password: string; // Nếu không cần password, có thể bỏ đi
  }
  