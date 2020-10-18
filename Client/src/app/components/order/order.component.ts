import { SharingDataWithCartService } from './../../services/sharing-data/sharing-data-with-cart.service';
import { MatDialog } from '@angular/material/dialog';
import { ItemCartModel } from 'src/app/models/item-cart-model';
import { OrderService } from './../../services/order.service';
import { RestrictTimePickerService } from './../../services/restrict-time-picker.service';
import { CityService } from './../../services/city.service';
import { OrderModel } from './../../models/order-model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { store } from './../../redux/store';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit, Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { UserModel } from 'src/app/models/user-model';
import { Unsubscribe } from 'redux';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy, AfterViewInit {

  public dataOrderTable = new MatTableDataSource();
  public displayedColumns: string[] = ['Item', 'Amount', 'Price'];
  public user: UserModel;
  
  public orderInfo = new OrderModel;
  public unsubscribe: Unsubscribe;
  public citiesList = [];
  public minDate: Date;
  public maxDate: Date;

  public cityIdForm: string = this.orderInfo.cityId

  // Form property
  public deliveryForm: FormGroup;
  public cityId: FormControl;
  public deliveryAddress: FormControl;
  public deliveryTime: FormControl;

  // Get status validation of payment form 
  public childFormValid: boolean = true

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private myShoppingCartService: ShoppingCartService,
              private myCityService: CityService,
              private myRestrictTimePickerService: RestrictTimePickerService,
              private myOrderService: OrderService,
              public myDialog: MatDialog,
              private myRouter: Router,
              private mySharingDataWithCartService: SharingDataWithCartService) {}

  async ngOnInit() {

    try {
      
      // Initialize form and validators
      this.createDeliveryFormController();
      this.createDeliveryForm();
      
      // Restrict delivery time
      this.restrictDeliveryTime();
      
      // Get cities list
      this.citiesList = await this.myCityService.getAllCity();
      
      // Listen to changes from redux
      this.unsubscribe = store.subscribe(() => this.dataOrderTable.data = store.getState().items);
      
      // Get user info from sessionStorage
      const userInfo = sessionStorage.getItem("user");
      
      // If user existed insert relevant values to orderInfo
      if (userInfo) {
        
        this.user = JSON.parse(userInfo);
        
        this.orderInfo = {
          userId: this.user._id,
          cityId: this.user.cityId,
          address: this.user.address
        }
        
      }
      
      if (store.getState().items.length === 0) {
        
        // Get products cart from service - DB
        // Get cart by user id
        const shoppingCartByUser = await this.myShoppingCartService.getCartByUser(this.user._id);
        
        // Get cart id
        const userCartId = shoppingCartByUser._id
        
        // Get shopping cart id value from items list to orderInfo
        this.orderInfo.shoppingCartId = userCartId
        
        // Get all items by cart and insert them into Redux store
        this.myShoppingCartService.getAllItemsRelatedToCart(userCartId)
        
      }
      else {
        
        // Get products cart from Redux store
        this.dataOrderTable.data = store.getState().items

        // Get shopping cart id value from items list to orderInfo
        const cartId = store.getState().items[0].shoppingCartId
        this.orderInfo.shoppingCartId = cartId
      }
      
    }
    catch (err) {
      console.log(err.message)
    }

  }

  // Paginator function
  ngAfterViewInit() {
    this.dataOrderTable.paginator = this.paginator;
  }

  // Gets the total cost of all transactions.
  public getTotalCost() {
  
    let cost = []
    cost = this.dataOrderTable.data

    const totalPrice = cost.map(t => t.totalPriceByAmount).reduce((acc, value) => acc + value, 0);
    
    // Get shopping cart id value from items list to orderInfo
    this.orderInfo.totalPrice = totalPrice

    return totalPrice
  }

  // validation form
  public createDeliveryFormController() {
    this.cityId = new FormControl('', Validators.required);
    this.deliveryAddress = new FormControl('', Validators.required);
    this.deliveryTime = new FormControl('', Validators.required);
  }

  // Create form
  public createDeliveryForm() {

    this.deliveryForm = new FormGroup({
      cityId: this.cityId,
      deliveryAddress: this.deliveryAddress,
      deliveryTime: this.deliveryTime
    })

  }

  // Restricted delivery time
  public restrictDeliveryTime() {
    
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const restrictTime = this.myRestrictTimePickerService.RestrictForOneMonth();
    
    // Get minimum time restricted
    const minRestrict = restrictTime.minTime;
    const minYear = parseInt(minRestrict.split('/')[0]);
    const minMonth = parseInt(minRestrict.split('/')[1]);
    const minDay = parseInt(minRestrict.split('/')[2]);
    
    // Get maximum time restricted
    const maxRestrict = restrictTime.maxTime
    const maxYear = parseInt(maxRestrict.split('/')[0]);
    const maxMonth = parseInt(maxRestrict.split('/')[1]);
    const maxDay = parseInt(maxRestrict.split('/')[2]);

    this.minDate = new Date(minYear, minMonth-1, minDay); 
    this.maxDate = new Date(maxYear, maxMonth-1, maxDay);
  }

  // Get last four number card from "app-payment" component
  public lastFourNumberCardHandler($event: string){

    this.orderInfo.lastFourNumOfCard = parseInt($event)

  }

  // Get statues payment form
  public getStatuesPaymentForm ($event: boolean){

    if ($event) {
      this.childFormValid = false
    } else {
      this.childFormValid = true
    }

  }

  // Complete button form
  public async completeOrder() {
    try {
      
      // Convert Time picker to moment format 
      const date = new Date();
      this.orderInfo.orderTime = moment(date).format('YYYY-MM-DDTHH:MM');
      this.orderInfo.deliveryTime = moment(this.orderInfo.deliveryTime).format('YYYY-MM-DDTHH:MM');
      
      // Add new order
      const addedOrder: OrderModel = await this.myOrderService.addOrder(this.orderInfo);

      // Destroy cart user
      this.deleteCart(addedOrder.shoppingCartId)

      // Popup dialog of success process
      this.myDialog.open(popUpDialogCompleteOrder);

      // Send to cart boolean value about completed order.
      // Cart component will refresh his list item
      this.mySharingDataWithCartService.setDataFromOrder(true);
      
      // Go back to shopping page
      this.myRouter.navigate(['./online-shop']);
    }
    catch (err) {
      console.log(err.message)
    }

  }

  // Delete cart and relate item
  public async deleteCart(cartId: string){

    try {
      
      // Get all the item cart of user
      const itemsCart: ItemCartModel[] = store.getState().items
      
      // Delete item cart from DB and Redux
      for (let i = 0; i < itemsCart.length; i++) {
        this.myShoppingCartService.deleteItemCart(itemsCart[i]._id);
      }
      
      // Delete cart
      this.myShoppingCartService.deleteCart(cartId);
      
      // clear all the items
      store.getState().items = []

    } 
    catch (err) {
      console.log(err.message)
    }

  } 

  // Destroy subscribe - stop listen to changes from redux
  public ngOnDestroy(): void {
    this.unsubscribe();
  }

}

// Pop up dialog with user
@Component({
  selector: 'popUpDialogCompleteOrder',
  templateUrl: 'pop-up-dialog-complete-order.html',
})
export class popUpDialogCompleteOrder {}
