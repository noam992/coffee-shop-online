import { SharingDataWithHeaderService } from './../../services/sharing-data/sharing-data-with-header.service';
import { UserModel } from './../../models/user-model';
import { Unsubscribe } from 'redux';
import { SharingSizeScreenService } from './../../services/sharing-data/sharing-size-screen.service';
import { IsOpenDrawerLogInParentService } from './../../services/sharing-data/is-open-drawer-log-in-parent.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  public screenSize: string;

  // Button status
  public displaySignInBtn: boolean;
  public displaySignUpBtn: boolean;

  constructor(private myIsOpenDrawerLogInParentService: IsOpenDrawerLogInParentService,
              private myIsOpenLogInDrawerService: IsOpenDrawerLogInParentService,
              private mySharingSizeScreenService: SharingSizeScreenService,
              private myRouter: Router,
              private mySharingUserNameHeaderParent: SharingDataWithHeaderService) { 

                // Listening to any called from layout component about screen size.  
                this.mySharingSizeScreenService.sizeScreenCalled$.subscribe(whichSizeScreenIs => {
                  this.screenSize = whichSizeScreenIs
                });

                // Listening to any called from log in component.
                // log in component call to function in this component to change status user
                // And change user mode    
                this.mySharingUserNameHeaderParent.drawerFunctionCalled$.subscribe(() => {

                  // User mode
                  this.checkUserMode()
                });

                // Listening to any called from header component.
                // header component call to function in this component to change status user
                // And change user mode    
                this.mySharingUserNameHeaderParent.signOutCalled$.subscribe(() => {

                  // User mode
                  this.checkUserMode()
                });
              }

  ngOnInit(): void {
     
    // Get user info from session storage
    const userJson = sessionStorage.getItem('user');
      
    // Regex valid email
    const regexEmail = /^\w+[\w-\.]*\@([\w-]+\.)+[\w-]+$/.test(userJson);
      
    // After register "user" key contain email's user only - Handle this occur 
    if (userJson && regexEmail) {
      this.myIsOpenLogInDrawerService.isOpenLogInDrawer(true);
    }

    // Get size of screen
    this.screenSize = this.mySharingSizeScreenService.getCurrentSize();
    
  }

  // Move to log in
  public moveToLogIn() {
    this.myIsOpenDrawerLogInParentService.isOpenLogInDrawer(true);
  }

  // Move to register
  public moveToRegister() {
    this.myRouter.navigate(['./register']);
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
    this.displaySignInBtn = false;
    this.displaySignUpBtn = false;
  }
  
  // Admin mode
  public AdminMode(){
    this.displaySignInBtn = false;
    this.displaySignUpBtn = false;
  }
  
  // Guest mode
  public GuestMode(){
    this.displaySignInBtn = true;
    this.displaySignUpBtn = true;

    // If user is "Guest" move him to home page
    this.myRouter.navigate(['./home']);
  }

  // Unsubscribe to changes on layout size screen (came from sharing component)
  ngOnDestroy(){
    
  }

}
