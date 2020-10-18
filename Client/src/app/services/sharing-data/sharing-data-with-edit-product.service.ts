import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharingDataWithEditProductService {

    // Variable that contain id product
    private productToEdit = new Subject<any>();

    // Observable string streams
    public functionCalledAndGetProductId$ = this.productToEdit.asObservable();
  
    // Service message commands
    public getProductId(productId: string) {
      this.productToEdit.next(productId);
    }
}
