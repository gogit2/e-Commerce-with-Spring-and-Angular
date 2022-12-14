import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: any = 1;
  previousCategoryId: any = 1;
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElments: number = 0;
  
  previousKeyword: string = "";

  constructor(private productService: ProductService,
              private cartService:CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() =>{
      this.listProducts();
    });
  }

  listProducts(){

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode){
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
    
  }

  handleSearchProducts(){
    const theSearchKeyword: any = this.route.snapshot.paramMap.get('keyword'); 

    // now search for products using keyword

    // check if we have a diffrent keyword than previous
    // If we have then set thePageNumber back to
    if(this.previousKeyword != theSearchKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theSearchKeyword;

    this.productService.searchProductsPaginate(this.thePageNumber-1, 
                                              this.thePageSize, 
                                              theSearchKeyword)
                                              .subscribe(this.processReult());
  }

  handleListProducts(){
    // check if "id" parameter is avilabale
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    
    if(hasCategoryId){
      // get the "id" param string. convert string to number using "+" symbol
      this.currentCategoryId = this.route.snapshot.paramMap.get('id');
    } else{
      this.currentCategoryId = 1;
    }

    // check if we have a diffrent category than previous
    // If we have then set thePageNumber back to
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId= ${this.currentCategoryId}, thePageNumber=${this.thePageNumber}, `)

    this.productService.getProductListPaginate(this.thePageNumber -1,
                                              this.thePageSize,
                                              this.currentCategoryId)
                                              .subscribe(this.processReult());
}

  processReult() {
    return (data: { _embedded: { products: Product[]; }; page: { number: number; size: number; totalElements: number; }; }) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElments = data.page.totalElements;  
    };
  }

  updatePageSize(pageSize: any) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }
  
  addToCart(tempProduct: Product) {
    console.log(`Adding to cart: ${tempProduct.name}, ${tempProduct.unitPrice}`)

    const theCartItem = new CartItem(tempProduct);

    this.cartService.addToCart(theCartItem);
  }

}
