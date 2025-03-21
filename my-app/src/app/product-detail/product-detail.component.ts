import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewService } from '../review.service';
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

}

