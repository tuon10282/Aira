import { Component } from '@angular/core';
import { ProductsService } from '../products.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  product: any;
  errMessage: string = '';
  constructor(public _service: ProductsService, private activateRoute:ActivatedRoute){
  activateRoute.paramMap.subscribe(
    (param)=>{
    let id=param.get('id')
    if(id!=null)
    {
    this.searchProduct(id)
    }
    }
  )
}
  searchProduct(productId:string)
  {
  this._service.getProduct(productId).subscribe({
  next:(data)=>{this.product=data},
  error:(err)=>{this.errMessage=err}
  })
  } 

}
