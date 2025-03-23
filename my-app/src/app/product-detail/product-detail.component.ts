import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewService } from '../review.service';
import { CartService } from '../cart.service';
import { CommonModule } from '@angular/common';
import { Reviews } from '../../classes/Review';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: any;
  products: any[] = [];
  topStockProducts: any[] = [];
  reviews: Reviews[] = []; // Danh sách đánh giá
  errMessage: string = '';

  constructor(
    public _service: ProductsService,
    private reviewService: ReviewService, // Inject ReviewService
    private activateRoute: ActivatedRoute,
    private cartService: CartService,
    private router: Router
  ) {
    activateRoute.paramMap.subscribe(
      (param) => {
        let id = param.get('id');
        if (id != null) {
          this.searchProduct(id);
          this.getProductReviews(id); // Lấy đánh giá khi chọn sản phẩm
        }
      }
    );
  }

  ngOnInit() {
    this._service.getProducts().subscribe({
      next: (data) => { 
        this.products = data; 
        this.getTopStockProducts();
      },
      error: (err) => { this.errMessage = err; }
    });
  }

  searchProduct(productId: string) {
    this._service.getProduct(productId).subscribe({
      next: (data) => { 
        this.product = data;
        // Nếu sản phẩm đã tải, hãy tải danh sách sản phẩm nếu chưa có
        if (!this.products || this.products.length === 0) {
          this._service.getProducts().subscribe({
            next: (productsData) => { 
              this.products = productsData;
              this.getTopStockProducts();
            },
            error: (err) => { this.errMessage = err; }
          });
        }
      },
      error: (err) => { this.errMessage = err; }
    });
  }
    // Lấy danh sách đánh giá theo ProductID
    getProductReviews(productId: string) {
      this.reviewService.getReviewsByProductId(productId).subscribe({
        next: (data) => { 
          this.reviews = data;
        },
        error: (err) => { 
          this.errMessage = 'Không thể tải đánh giá!';
          console.error(err);
        }
      });
    }
  

  // Phương thức để lấy 5 sản phẩm có StockQuantity lớn nhất
  getTopStockProducts() {
    if (this.products && this.products.length > 0) {
      // Sắp xếp sản phẩm theo StockQuantity giảm dần
      const sortedProducts = [...this.products].sort((a, b) => {
        return b.StockQuantity - a.StockQuantity;
      });
      
      // Lấy 5 sản phẩm đầu tiên (hoặc ít hơn nếu không đủ 5 sản phẩm)
      this.topStockProducts = sortedProducts.slice(0, 4);
    }
  }

  viewDetail(product: any) {
    console.log("Product:", product);  // Kiểm tra product có _id không
    console.log("Navigating to:", `/view-product-detail/${product._id}`);
    this.router.navigate(['/view-product-detail', product._id]);
  }
  addToCart(product: any) {
    if (!this.cartService.isLoggedIn()) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      this.router.navigate(['/login']);
      return;
    }

    if (!product || !product._id) {
      console.error('Lỗi: Không tìm thấy sản phẩm để thêm vào giỏ hàng.');
      return;
    }

  // Tính giá cuối cùng sau khi giảm giá
  const originalPrice = product.oldPrice > 0 ? product.oldPrice : product.oldPrice; // Chỉ lấy oldPrice nếu lớn hơn 0
  const finalPrice = product.Price; // Giá cuối cùng đã giảm
  
  const discountValue = originalPrice > finalPrice && originalPrice > 0 
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) 
    : 0;
  
  

  // Tạo item phù hợp với cấu trúc MongoDB
  const cartItem = {
    product_id: product._id,
    name: product.ProductName, // Đổi từ 'Name' -> 'ProductName'
    price: originalPrice, // Giá gốc
    final_price: finalPrice, // Giá sau giảm
    discount: discountValue, // Phần trăm giảm giá (giữ 2 số thập phân)
    image: product.Images?.[0] || "", // Lấy ảnh đầu tiên nếu có
    quantity: 1 // Mặc định số lượng khi thêm vào giỏ hàng
  };

    // Gọi CartService để thêm vào giỏ hàng
    this.cartService.addToCart(cartItem).subscribe({
      next: (response: any) => {
        console.log("Thêm vào giỏ hàng thành công:", response);
        alert("Đã thêm sản phẩm vào giỏ hàng!");
      },
      error: (error: any) => {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        if (error.status === 401) {
          alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          this.cartService.logout();
          this.router.navigate(['/login']);
        } else {
          alert('Có lỗi xảy ra: ' + error);
        }
      }
    });
  }


}

