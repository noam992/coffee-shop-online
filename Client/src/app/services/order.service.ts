import { Injectable } from '@angular/core';
import { OrderModel } from './../models/order-model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  // Add order
  public async addOrder(order: OrderModel): Promise<OrderModel>{
    try {

      const addedNewOrder = await this.http.post<OrderModel[]>("./api/order/add-order", order).toPromise();
      
      let newOrder: OrderModel
      
      // Convert response item to normal object
      for (const prop in addedNewOrder) {
        newOrder = addedNewOrder[prop]
      }
      
      return newOrder
      
    } 
    catch (err) {
      console.log(err.message)
    }
  }
    
}
