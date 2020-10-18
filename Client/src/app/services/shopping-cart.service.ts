import { ItemCartModel } from 'src/app/models/item-cart-model';
import { store } from './../redux/store';
import { ActionType } from './../redux/action-type';
import { Injectable } from '@angular/core';
import { ShoppingCartModel } from './../models/shopping-cart-model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private http: HttpClient) { }

  // Get cart by user
  public async getCartByUser(userId: string): Promise<ShoppingCartModel>{
    try {

      const userCartObject = await this.http.get<ShoppingCartModel[]>("./api/shoppingCart/" + userId).toPromise();
      
      // If user isn't cart return undefined
      if (userCartObject === null) {
        return null
      }
      
      let userCart: ShoppingCartModel
      
      // Convert response item to normal object
      for (const prop in userCartObject) {
        userCart = userCartObject[prop]
      }
      
      return userCart
    } 
    catch (err) {
      console.log(err.message)
    }

  }

  // Add cart
  public async addNewCart(shoppingCart: ShoppingCartModel): Promise<ShoppingCartModel>{

    try {
      
      const addedNewCartObject = await this.http.post<ShoppingCartModel[]>("./api/shoppingCart/add-cart", shoppingCart).toPromise();
      
      let newCart: ShoppingCartModel
      
      // Convert response item to normal object
      for (const prop in addedNewCartObject) {
        newCart = addedNewCartObject[prop]
      }
      
      return newCart
      
    } 
    catch (err) {
      console.log(err.message)
    }
  }

  // Delete cart
  public deleteCart(cartId: string): void{
    this.http.delete("./api/shoppingCart/delete-cart/" + cartId).toPromise();
  }

    // Connected to Redux
  // Get all items related to cart
  public getAllItemsRelatedToCart(cartId: string): void{
    this.http
      .get<ItemCartModel>("./api/shoppingCart/items/" + cartId)
      .subscribe(items => {

        let allItems: ItemCartModel[]

        // Convert response item to normal object
        for (const prop in items) {
          allItems = items[prop]
        }

        // Insert products into Redux store
        store.dispatch({ type: ActionType.LoadAllItemCart, payload: allItems});

      })
  }
  
  // Add item cart
  public addItemCart(item: ItemCartModel): void{
    this.http
      .post<ItemCartModel[]>("./api/shoppingCart/add-item", item)
      .subscribe(addedItem => {

        let addedItemObject: ItemCartModel

        // Convert response item to normal object
        for (const prop in addedItem) {
          addedItemObject = addedItem[prop]
        }

        // Add item to Redux
        const action = { type: ActionType.AddItemCart, payload: addedItemObject }
        store.dispatch(action);
    },
    error => console.log(error.message))
  }

  // Edit item cart
  public editItemCart(item: ItemCartModel): Promise<ItemCartModel[]>{
    return this.http.patch<ItemCartModel[]>("./api/shoppingCart/update-item/" + item._id, item).toPromise();
  }
    
  // Delete item cart from redux and DB
  public deleteItemCart(itemId: string): void{

    // Delete item cart from DB
    this.http.delete("./api/shoppingCart/delete-item/" + itemId).toPromise();
    
    // Delete item cart to Redux
    store.dispatch({ type: ActionType.DeleteItemCart, payload: itemId });

  }


}
