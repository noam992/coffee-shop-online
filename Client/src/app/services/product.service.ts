import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ProductModel } from './../models/product-model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }
  
  private _refreshNeeded$ = new Subject<void>();

  // refresh products list
  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  // Get all products
  public getAllProducts(): Observable<any>{
    return this.http.get<ProductModel[]>("./api/product", {
      observe: 'response'
    });
  }

  // Get specific product
  public async getSpecificProducts(productId: string): Promise<ProductModel>{
    try {

      const productObject = await this.http.get<ProductModel[]>("./api/product/" + productId).toPromise();
      
      let oneProduct: ProductModel
      
      // Convert response item to normal object
      for (const prop in productObject) {
        oneProduct = productObject[prop]
      }
      
      return oneProduct
    }
    catch (err) {
    console.log(err.message)
    }
  }



  // Add product
  public addProduct(product: FormData): Observable<any>{
    return this.http
      .post<any>("./api/product/add-product", product, {
        reportProgress: true,
        observe: 'events'
      })
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
        })
      )
      
  }

  // Edit product
  //public editProduct(product: ProductModel): Promise<ProductModel[]>{
  //  return this.http.patch<ProductModel[]>("./api/product/update-product/" + product._id, product).toPromise();
  //}

  public editProduct(product: FormData, productId: string): Observable<any>{
    return this.http
      .patch<any>("./api/product/update-product/" + productId, product, {
        observe: 'response'
      })
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
        })
      )   
  }

  // Delete product
  public deleteProduct(productId: string): void{
    this.http.delete("./api/product/delete-product/" + productId).toPromise();
  }

}
