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

  getProductListPaginate(thePageNumber: number,
                        pageSize: number,  
                        theCategoryId: any): Observable <GetResponseProducts>{

    // build URL based on categoryId, pageNum, pageSize
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                      + `&page=${thePageNumber}&size=${pageSize}` ;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

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

  searchProductsPaginate(thePageNumber: number,
    pageSize: number,  
    theSearchKeyword: string): Observable <GetResponseProducts>{

    // build URL based on categoryId, pageNum, pageSize
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theSearchKeyword}`
      + `&page=${thePageNumber}&size=${pageSize}` ;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
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

  getProduct(theProductId: any): Observable<Product>  {
    // build URL based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }
}

interface GetResponseProducts{
  _embedded: {
    products: Product[]; 
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number;
  } 
}

interface GetResponseProductCategory{
  _embedded: {
    productCategory: ProductCategory[]; 
  } 
}
