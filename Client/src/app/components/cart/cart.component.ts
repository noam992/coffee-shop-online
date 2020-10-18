import { BehaviorSubject, Subject } from 'rxjs';
import { ItemCartModel } from './../../models/item-cart-model';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ActionType } from './../../redux/action-type';
import { store } from './../../redux/store';
import { ShoppingCartService } from './../../services/shopping-cart.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { ShoppingCartModel } from 'src/app/models/shopping-cart-model';
import { Unsubscribe } from 'redux';
import { UserModel } from 'src/app/models/user-model';
import * as moment from 'moment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {

  public cart: ShoppingCartModel;
  public sourceData = [];
  public dataTable = new MatTableDataSource();
  public displayedColumns: string[] = ['product', 'amount', 'price', 'deleteItem'];
  public filterText = '';
  public user: UserModel
  public unsubscribe: Unsubscribe;
  public noCartUserContainer: boolean;
  public totalCostOfItemsCart: number;

  constructor(private myShoppingCartService: ShoppingCartService,
              private myRouter: Router,
              public myDialog: MatDialog) { }

  async ngOnInit() {

    await this.getItemCartByUser()

  }

  // Create new cart
  public createNewCart() {

    // Create new cart
    const newCart = new ShoppingCartModel;

    // Get day of today
    const date = new Date()

    // Insert value for property cart
    newCart.userId = this.user._id
    newCart.createdData = moment(date).format('YYYY-MM-DDTHH:MM')

    // Create new cart
    this.myShoppingCartService.addNewCart(newCart);

    // Get table of cart
    this.getItemCartByUser()
  }

  // Get items cart by user
  public async getItemCartByUser() {

    try {
      
      // Listen to changes from redux
      this.unsubscribe = store.subscribe(() => this.dataTable.data = store.getState().items);
      
      // Get user info from sessionStorage
      const userInfo = sessionStorage.getItem("user");
      this.user = JSON.parse(userInfo);
      
      // If user isn't exist turn out, else get his info 
      if (userInfo === null) {
        return
      }
      else {
        
        if (store.getState().items.length === 0) {
          
          // Remove message "empty cart"
          this.noCartUserContainer = false
          
          // Get cart by user id
          const shoppingCartByUser = await this.myShoppingCartService.getCartByUser(this.user._id);
          
          // If user have no cart, show message "empty cart"
          if (shoppingCartByUser === null) {
            this.noCartUserContainer = true
            return
          }
          
          // Get cart id
          const userCartId = shoppingCartByUser._id
          
          // Get all items by cart and insert them into Redux store
          this.myShoppingCartService.getAllItemsRelatedToCart(userCartId);
          
        }
        else {
          
          // Get products cart from Redux store
          this.dataTable.data = store.getState().items;
          
        }
        
      }
    } 
    catch (err) {
      console.log(err.message)
    }

  }

  // Highlight searching text
  public applyFilter(filterValue: string) {

    // Remove whitespace from both sides of a string
    this.filterText = filterValue.trim();

  }

  // Gets the total cost of all transactions.
  public getTotalCost() {
    
    let cost = []
    cost = this.dataTable.data

    const totalCost = cost.map(t => t.totalPriceByAmount).reduce((acc, value) => acc + value, 0);

    this.totalCostOfItemsCart = totalCost

    return totalCost
  }

  // Move to payment page and complete order
  public moveToCompleteOrder(): void {
    this.myRouter.navigate(['./order']);
  }

  // Destroy subscribe - stop listen to changes from redux
  public ngOnDestroy(): void {
    this.unsubscribe();
  }

  // Delete Cart
  public deleteCart(){

    // Open dialog with user to confirm the "delete cart"
    const dialogRef = this.myDialog.open(popUpDeleteCartDialog);

    dialogRef.afterClosed().subscribe(
      async result => {
        try {

          // If "true" - delete cart
          if (result === true) {
              
            // Get cart by user id
            const shoppingCartByUser = await this.myShoppingCartService.getCartByUser(this.user._id);
              
            // Get all the item cart of user
            const itemsCart: ItemCartModel[] = store.getState().items
              
            // Delete item cart from DB and Redux
            for (let i = 0; i < itemsCart.length; i++) {
              this.myShoppingCartService.deleteItemCart(itemsCart[i]._id);
            }
              
            // Delete cart
            this.myShoppingCartService.deleteCart(shoppingCartByUser._id);
              
            // clear all the items
            store.getState().items = [];
              
            // Get table of cart
            this.getItemCartByUser();
          }
          else {
            return
          }

        } 
        catch (err) {
          console.log(err.message)
        }

    });
  }

  // Delete Item from cart
  public removeItem(itemId){
    
    // Delete item
    this.myShoppingCartService.deleteItemCart(itemId);

    // Get table of cart
    this.getItemCartByUser();
  }

}

// Pop up dialog with user
@Component({
  selector: 'popUpDeleteCartDialog',
  templateUrl: 'pop-up-delete-cart-dialog.html',
})
export class popUpDeleteCartDialog {}








