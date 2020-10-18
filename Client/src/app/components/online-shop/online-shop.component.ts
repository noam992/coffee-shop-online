import { HttpEventType } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharingDataWithEditProductService } from './../../services/sharing-data/sharing-data-with-edit-product.service';
import { CartComponent } from './../cart/cart.component';
import { ShoppingCartModel } from './../../models/shopping-cart-model';
import { UserModel } from 'src/app/models/user-model';
import { CategoryService } from './../../services/category.service';
import { CalculationFunctionsService } from './../../services/calculation-functions.service';
import { ItemCartModel } from 'src/app/models/item-cart-model';
import { store } from './../../redux/store';
import { MatDrawer } from '@angular/material/sidenav';
import { SharingDataWithHeaderService } from '../../services/sharing-data/sharing-data-with-header.service';
import { ConvertBase64ToImgSrcService } from './../../services/convert-base64-to-img-src.service';
import { Component, Inject, Input, OnInit, Renderer2, ViewChild, ɵConsole } from '@angular/core';
import { ProductModel } from 'src/app/models/product-model';
import { ProductService } from 'src/app/services/product.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryModel } from 'src/app/models/category-model';
import { SharingSizeScreenService } from 'src/app/services/sharing-data/sharing-size-screen.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-online-shop',
  templateUrl: './online-shop.component.html',
  styleUrls: ['./online-shop.component.css']
})
export class OnlineShopComponent implements OnInit {

  @Input()
  public deviceXs: boolean;

  @ViewChild('appCart') public appCart: CartComponent;

  public products:ProductModel[] = [];
  public AllProductsConstant:ProductModel[] = [];
  public contentDrawer: boolean;
  public categories: CategoryModel[] = [];
  public screenSize: string;
  public colorBtnCategory: string;
  public searchValue: any;
  public isLoadingProcessBar: boolean;
  public isSearchingProductsMessageError: boolean;
  
  // Button status
  public displayAddProductButton: boolean;
  public displayAddProductButtonToCart: boolean;
  public displayAmountOfProduct: boolean;
  public displayEditProduct: boolean;

  @ViewChild('drawer')
  public cartDrawer: MatDrawer;

  constructor(private myProductService: ProductService,
              private myCategoryService: CategoryService,
              private myConvertBase64ToImgSrcService: ConvertBase64ToImgSrcService,
              private mySharingUserNameHeaderParent: SharingDataWithHeaderService,
              private myShoppingCartService: ShoppingCartService,
              private myCalculationFunctions: CalculationFunctionsService,
              private mySharingDataWithEditProductService: SharingDataWithEditProductService,
              public myDialog: MatDialog,
              private myRouter: Router,
              private mySharingSizeScreenService: SharingSizeScreenService) {
                
                // Listening to any called from header component.   
                this.mySharingUserNameHeaderParent.drawerCalled$.subscribe(() => {
                  this.openCartDrawer(false);
                });

                // Listening to any called from layout component about screen size.  
                this.mySharingSizeScreenService.sizeScreenCalled$.subscribe(whichSizeScreenIs => {
                  this.screenSize = whichSizeScreenIs
                });
              }

  async ngOnInit() {
    try {

      // User mode
      this.checkUserMode()

      // Loading process bar
      this.LoadingProcessBar()

      // Get All the products
      this.myProductService.refreshNeeded$
        .subscribe(() => {
          this.getAllProducts();
      })

      this.getAllProducts();

      // Get categories
      this.categories = await this.myCategoryService.getAllCategory();

      // Add filter "All"
      const allObjectCategory = {
        _id: '1234',
        category: 'All'
      }
      // Push 'All' element to be first in the list's array 
      this.categories.unshift(allObjectCategory)

      // Get size of screen
      this.screenSize = this.mySharingSizeScreenService.getCurrentSize();

    } catch (err) {
      console.log(err.message)
    }
  }

  // Close drawer
  public toggleCartAndAddProductDrawer() {
    this.cartDrawer.toggle();
  }

  // Get all the products
  private getAllProducts() {
      
      this.myProductService.getAllProducts()
        .subscribe(
          response => {

            this.products = response.body.products
        
            // Convert Binary object to image source 
            for (let i = 0; i < this.products.length; i++) {         
              this.products[i].productImg = this.myConvertBase64ToImgSrcService.convertBase64ToImgSrc(this.products[i].productImgPath)
            }

            // Save all products in constant array (no filter on him)
            this.AllProductsConstant = this.products

          },
          error => console.log(error.message)
        );
  }

  // Loading process bar
  public LoadingProcessBar() {

    this.isSearchingProductsMessageError = false

    // If products array is empty start loading process bar
    if (this.products.length === 0) {
      this.isLoadingProcessBar = true;

      // Start count 5 min to check again status products array.
      setInterval(() => {

        // If products array still empty, stop loading process bar and print message
        if (this.products.length === 0) {
          this.isLoadingProcessBar = false;
          this.isSearchingProductsMessageError = true;
        }
        // If products array found items, stop loading process bar and don't print message
        else {
          this.isLoadingProcessBar = false;
          this.isSearchingProductsMessageError = false
        }
      }, 5000);
    }
  }

  // Check if user is Log in, Guest or Admin or after Signed up,
  public checkUserMode(){

    // Get user info from session storage
    const userJson = sessionStorage.getItem('user');

    // Regex valid email
    const regexEmail = /^\w+[\w-\.]*\@([\w-]+\.)+[\w-]+$/.test(userJson);

    // After register "user" key contain email's user only - Handle this occur 
    if (userJson && regexEmail) {
      this.GuestMode();
      return
    }

    // Convert "user" key to object
    const user: UserModel = JSON.parse(userJson)
    
    // User signed in
    if (userJson && user.isAdmin === 0) {
      this.UserMode();
    } 
    // User is Admin
    else if(userJson && user.isAdmin === 1) {
      this.AdminMode();
    } 
    // User is Guest
    else {
      this.GuestMode();
    }

  }

  // User mode
  public UserMode(){
    this.displayAddProductButton = false;
    this.displayAddProductButtonToCart = true;
    this.displayAmountOfProduct = true;
    this.displayEditProduct = false;
  }

  // Admin mode
  public AdminMode(){
    this.displayAddProductButton = true;
    this.displayAddProductButtonToCart = false;
    this.displayAmountOfProduct = false;
    this.displayEditProduct = true;
  }

  // Guest mode
  public GuestMode(){
    this.displayAddProductButton = false;
    this.displayAddProductButtonToCart = true;
    this.displayAmountOfProduct = true;
    this.displayEditProduct = false;

    // If user is "Guest" move him to home page
    this.myRouter.navigate(['./home']);
  }

  // Open side drawer
  public openCartDrawer(contentValue: boolean){
    
    // Get content of drawer
    if (contentValue === true) {
      
      // Display add product component
      this.contentDrawer = true
    } else {
      
      // Display cart component
      this.contentDrawer = false
    }

    // Open drawer
    this.cartDrawer.toggle();
    
  }

  // Add product to cart
  public async addProductToCart(productId: string, valueAmount: number) {
    try {
      
      let itemObject = new ItemCartModel()
      let productObject: ProductModel
      let cartId: string
      
      // Check if item already exist into store/ into user's cart
      const item = store.getState().items.find(i => i.product._id === productId)
      
      if (item) {
        
        // Open dialog with user
        this.myDialog.open(popUpUserDialog);
        return
      }
      
      // Get user info from sessionStorage
      const user = JSON.parse(sessionStorage.getItem("user"));
      
      // Get cart id by user 
      let shoppingCartByUser: ShoppingCartModel = await this.myShoppingCartService.getCartByUser(user._id);
      
      // If cart isn't exist, create a new one
      if (shoppingCartByUser === null) {
        
        // Create new cart
        const newCart = new ShoppingCartModel;
        
        // Get day of today
        const date = new Date()
        
        // Insert value for property cart
        newCart.userId = user._id
        newCart.createdData = moment(date).format('YYYY-MM-DDTHH:MM');
        
        // Add new shopping cart
        const addedNewCart: ShoppingCartModel = await this.myShoppingCartService.addNewCart(newCart);
        
        // Get cart id by user
        cartId = addedNewCart._id
      } else{
        
        // Get cart id by user
        cartId = shoppingCartByUser._id
      }
      
      // Get product by current button
      const product = await this.myProductService.getSpecificProducts(productId)
      
      // Insert value into property of itemObject
      itemObject.amount = valueAmount
      itemObject.productId = productId
      itemObject.totalPriceByAmount = this.myCalculationFunctions.sumByPriceAndAmount(product.price, valueAmount);
      itemObject.shoppingCartId = cartId
      
      // Add product in DB and Redux through service
      this.myShoppingCartService.addItemCart(itemObject)
      
      // Open table items cart of user
      // Remove message "empty cart"
      this.appCart.noCartUserContainer = false;
      
    } 
    catch (err) {
      console.log(err.message)
    }

  }

  // Free searching by product name
  public searchProduct(searchProductValue){

    // Loading process bar
    this.LoadingProcessBar()

    // Clear color of category's button
    this.colorBtnCategory = null

    // If user chose clear search input, he get back all the products.if no,  get back all the products. if no, his list products filters by his searching
    if (searchProductValue === "") {
      this.products = this.AllProductsConstant
    } 
    else {
      const filterDataBySearching = this.AllProductsConstant.filter( product => {
        return product.productName.toLowerCase().includes(searchProductValue.toLowerCase());
    });

    this.products = filterDataBySearching

    }
  }

  // Filter products by category
  public async filterProducts(event: string){

    // Loading process bar
    this.LoadingProcessBar()

    // Clear searching input
    this.searchValue = ''

    // Change color of button
    this.colorBtnCategory = event

    // If user chose 'All', he get back all the products. if no, his list products filters by category
    if (event === "All") {
      this.products = this.AllProductsConstant
    } else {
      this.products = this.AllProductsConstant.filter(p => p.category.category === event);
    }

  }

  public editProduct(productId: string){

    // Send product id to edit product component 
    this.mySharingDataWithEditProductService.getProductId(productId)

    // Open dialog edit product
    this.myDialog.open(popUpEditProductDialog, {
      data: productId
    })
  }

}


// Pop up dialog with user
@Component({
  selector: 'popUpUserDialog',
  templateUrl: 'pop-up-user-dialog.html',
})
export class popUpUserDialog {}

// Pop up dialog with user
@Component({
  selector: 'popUpEditProductDialog',
  templateUrl: 'pop-up-edit-product-dialog.html',
  styleUrls: ['./online-shop.component.css']
})
export class popUpEditProductDialog implements OnInit {

  public product = new ProductModel;
  public editForm: FormGroup;
  public categories: CategoryModel[] = [];
  public imgUrl: string = undefined;
  public selectedFile: File;
  public fileName: string = "No file selected";

  constructor(public dialogRef: MatDialogRef<popUpEditProductDialog>,
              @Inject(MAT_DIALOG_DATA) public data: string,
              private myProductService: ProductService,
              private myCategoryService: CategoryService,
              private myConvertBase64ToImgSrcService: ConvertBase64ToImgSrcService,
              private myFormBuilder: FormBuilder) {this.createEditProductForm();}

  async ngOnInit() {
    try {

      // Get all category
      this.categories = await this.myCategoryService.getAllCategory();

      // Get current product
      const currentProduct = await this.myProductService.getSpecificProducts(this.data);

      this.product = {
        _id: currentProduct._id,
        productName: currentProduct.productName,
        productImg: currentProduct.productImg,
        productImgType: currentProduct.productImgType,
        productImgPath: currentProduct.productImgPath,
        productText: currentProduct.productText,
        price: currentProduct.price,
        categoryId: currentProduct.categoryId
      }
      this.imgUrl = this.myConvertBase64ToImgSrcService.convertBase64ToImgSrc(currentProduct.productImgPath);
      this.fileName = currentProduct.productName
  
    } catch (err) {
      console.log(err.message)
    }

  }

  // validation and form
  createEditProductForm() {
    this.editForm = this.myFormBuilder.group({
      editProductName: [this.product.productName, [
        Validators.required
      ]],
      editProductImg: [null],
      editProductText: [this.product.productText, [
        Validators.required
      ]],
      editPrice: [this.product.price, [
        Validators.required
      ]],
      editProductCategoryId: [this.product.categoryId, [
        Validators.required
      ]]
    }) 
  }

  // Preview Image and insert file to form
  public onFileSelected(event) {
    
    // Get file from input and create preview
    let reader = new FileReader()

    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event: any) => {
      this.imgUrl = event.target.result 
    }

    // Get file name
    const ImgValue = this.editForm.get('editProductImg').value
    this.fileName = ImgValue._fileNames
    
    // Insert input file to variable
    const file = (event.target as HTMLInputElement).files[0];
    this.editForm.patchValue({
      editProductImg: file
    })
    this.editForm.get('editProductImg').updateValueAndValidity()
  }

  public editProduct() {

    // Convert to FormData
    let myFormData:any = new FormData();
    myFormData.append("productId", this.product._id);
    myFormData.append("editProductName", this.product.productName);
    myFormData.append("editProductImg", this.editForm.get('editProductImg').value);
    myFormData.append("editProductText", this.product.productText);
    myFormData.append("editPrice", this.product.price);
    myFormData.append("editProductCategoryId", this.product.categoryId);

    // Patch product
    this.myProductService.editProduct(myFormData, this.product._id)
      .subscribe(
        response => {
          // Close pop Up dialog

        },
        error => console.log(error.message)
      )

  }
  
}

