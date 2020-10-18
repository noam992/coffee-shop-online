import { ActionType } from './../../redux/action-type';
import { store } from './../../redux/store';
import { SharingDataWithHeaderService } from '../../services/sharing-data/sharing-data-with-header.service';
import { Router } from '@angular/router';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user-model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})

export class HeaderComponent implements OnInit {

  public userMode: string;

  // Button status
  public displayHomeButton: boolean;
  public displayLogInButton: boolean;
  public displaySignUpButton: boolean;
  public displayShoppingPageButton: boolean;
  public displaySignOutButton: boolean;
  public disableCartButton: boolean;

  @Output()
  public toggleDrawer = new EventEmitter(); 
  
  constructor(private myRouter: Router,
              private mySharingUserNameHeaderParent: SharingDataWithHeaderService) {
                    
                // Listening to any called from log in component.
                // log in component call to function in this component to change status "Guest" to user name
                // And change user mode    
                this.mySharingUserNameHeaderParent.drawerFunctionCalled$.subscribe(() => {

                  // User mode
                  this.checkUserMode()
                });
              }

  ngOnInit() {

    // User mode
    this.checkUserMode()

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
      this.UserMode(user);
    } 
    // User is Admin
    else if(userJson && user.isAdmin === 1) {
      this.AdminMode(user);
    } 
    // User is Guest
    else {
      this.GuestMode();
    }

  }

  // User mode
  public UserMode(user: UserModel){
    this.displayHomeButton = true;
    this.displayLogInButton = false;
    this.displaySignUpButton = false;
    this.displayShoppingPageButton = true;
    this.displaySignOutButton = true;
    this.disableCartButton = false;

    // Insert mode user
    this.userMode = user.firstName;
  }

  // Admin mode
  public AdminMode(user: UserModel){
    this.displayHomeButton = true;
    this.displayLogInButton = false;
    this.displaySignUpButton = false;
    this.displayShoppingPageButton = true;
    this.displaySignOutButton = true;
    this.disableCartButton = true;

    // Insert mode user
    this.userMode = user.firstName;
  }

  // Guest mode
  public GuestMode(){
    this.displayHomeButton = true;
    this.displayLogInButton = true;
    this.displaySignUpButton = true;
    this.displayShoppingPageButton = false;
    this.displaySignOutButton = false;
    this.disableCartButton = true;

    // Insert mode user
    this.userMode = "Guest";
  }

  // Button open log in drawer
  public openDrawerSignIn(): void {
    this.toggleDrawer.emit();
  }

  // Button move to register page
  public moveToRegister(): void {
    this.myRouter.navigate(['./register']);
  }

  // Button move to home page
  public moveToHomePage(): void {
    this.myRouter.navigate(['./home']);
  }

  // Button move to home page
  public moveToShopPage(): void {
    this.myRouter.navigate(['./online-shop']);
  }

  // Sign out
  public signOut(): void {

    // Remove "user" and "token" from session storage 
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    // Change user mode to Guest
    this.checkUserMode()

    // Move him to home page
    this.myRouter.navigate(['./home']);

    // Close log in drawer after successful log in 
    this.mySharingUserNameHeaderParent.signOutStatus();

    // Clear Items into Redux store
    store.dispatch({ type: ActionType.ClearAllItemCArtCart});

  }

  // Open cart and move to shopping page
  public openCartAndMoveToShoppingPage() {

    // Move to online shop page
    this.myRouter.navigate(['./online-shop']);

    // Open cart drawer
    this.mySharingUserNameHeaderParent.openDrawerCart();

  }
  

}
