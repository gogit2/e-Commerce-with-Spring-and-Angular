import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryId: any): Observable <Product[]>{

    // build URL based on categoryId
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  searchProducts(theSearchKeyword: any): Observable <Product[]> {
    // build URL based on search keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theSearchKeyword}`;

    return this.getProducts(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  
}

interface GetResponseProducts{
  _embedded: {
    products: Product[]; 
  } 
}

interface GetResponseProductCategory{
  _embedded: {
    productCategory: ProductCategory[]; 
  } 
}
