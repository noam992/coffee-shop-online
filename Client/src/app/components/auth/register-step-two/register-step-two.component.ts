import { CityService } from './../../../services/city.service';
import { UserModel } from './../../../models/user-model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CityModel } from 'src/app/models/city-model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SharingDataRegisterService } from 'src/app/services/sharing-data/sharing-data-register.service';
import {MatDialog} from '@angular/material/dialog';


@Component({
  selector: 'app-register-step-two',
  templateUrl: './register-step-two.component.html',
  styleUrls: ['./register-step-two.component.css']
})
export class RegisterStepTwoComponent implements OnInit {

  public user = new UserModel;
  public citiesList = [];
  public phones = {
    prefixHome: undefined,
    home: undefined,
    smartOne: undefined,
    smartTwo: undefined,
    smartThree: undefined,
  }
  public errorHomePhone: string; 
  public homePhoneError
  public countPhones = []
  public firstSmartPhone
  public secondSmartPhone
  public thirdSmartPhone
  public ableAddPhone: boolean = false;
  public ableRemovePhone: boolean = true;
  


  constructor(private myCityService: CityService,
              private myRouter: Router,
              private myAuthenticationService: AuthenticationService,
              private mySharingDataRegister: SharingDataRegisterService,
              public myDialog: MatDialog) { }

  async ngOnInit() {
    try {

      // Get data register from previous register process
      const firstStepRegister = this.mySharingDataRegister.getData();

      // Only if first step register is completed, use it   
      if (firstStepRegister) {
        this.user = firstStepRegister
      }

      // Get cities list
      this.citiesList = await this.myCityService.getAllCity();     

    } catch (err) {
      alert(err.message)
    }
  }

  // Validation and margin home phone to user details
  public isHomePhoneError() {
    // Get value of home phone
    let prefix = this.phones.prefixHome;
    let mainHomeNumber = this.phones.home;

    // If Input home phone is empty (""), that equal to undefined
    if (mainHomeNumber === "") {
      mainHomeNumber = undefined
    }

    // Validation for home phone
    if (mainHomeNumber === undefined && prefix === undefined) {
      this.user.phoneNumbers.homeNumber = undefined;
      return false
    }
    else if (mainHomeNumber !== undefined && prefix === undefined) {

      this.errorHomePhone = "Missing area code"
      this.user.phoneNumbers.homeNumber = undefined;
      this.homePhoneError = {display: 'block', color: 'red', fontSize: "11px", marginTop: "-10px"};
      return true 
    }
    else if (mainHomeNumber === undefined || /^\d{7,7}$/.test(mainHomeNumber) === false && prefix !== undefined) {

      this.errorHomePhone = "Missing home number, must be 7 numbers"
      this.user.phoneNumbers.homeNumber = undefined;
      this.homePhoneError = {display: 'block', color: 'red', fontSize: "11px", marginTop: "-10px"};
      return true
    }

    // If user fill home number and it's valid, so add number to user details
    this.user.phoneNumbers.homeNumber = `0${this.phones.prefixHome}${this.phones.home}`
  }

  // Click on add phone button
  public addSmartPhone() {

    // Array for count number of phone to manage button and display phone input 
    const checkPhones = this.countPhones.length;

    // Zero means no addition phones except the first one, let to add one more 
    if (checkPhones === 0) {

      // Add index phone to array
      this.countPhones.push(1)
      this.secondSmartPhone = {display: 'block'};
      
      // Able remove button
      this.ableRemovePhone = false;

      // Keep button able to add more phone number
      this.ableAddPhone = false;

    // One means there have one phone except the first one, restrict to adding more 
    } else if (checkPhones === 1) {

      this.countPhones.push(2)
      this.thirdSmartPhone = {display: 'block'};
      
      // Able remove button
      this.ableRemovePhone = false;

      // Disabled add button
      this.ableAddPhone = true;
    }

  }
  
  // Click on remove phone button
  public removedSmartPhone() {

    // Array for count number of phone to manage button and display phone input 
    const checkPhones = this.countPhones.length;

    // Zero means no addition phones except the first one, let to add one more 
    if (checkPhones === 1) {

      // Add index phone to array
      this.countPhones.splice(0, 1)
      this.secondSmartPhone = {display: 'none'};
      
      // Clear phone value input, which is removed
      this.user.phoneNumbers.smartPhoneTwo = undefined;

      // Able remove button
      this.ableRemovePhone = true;

      // Keep button able to add more phone number
      this.ableAddPhone = false;

    // One means there have one phone except the first one, restrict to adding more 
    } else if (checkPhones === 2) {

      // Add index phone to array
      this.countPhones.splice(1, 1)
      this.thirdSmartPhone = {display: 'none'};
      
      // Clear phone value input, which is removed
      this.user.phoneNumbers.smartPhoneThree = undefined;

      // Able remove button
      this.ableRemovePhone = false;

      // Disabled add button
      this.ableAddPhone = false;
    }

  }

  // Add new user
  public addUser() {
      
    // Any phone number is empty ("") convert him to undefined
    if (this.user.phoneNumbers.smartPhoneTwo === "") {
      this.user.phoneNumbers.smartPhoneTwo = undefined
    }
    if (this.user.phoneNumbers.smartPhoneThree === "") {
      this.user.phoneNumbers.smartPhoneThree = undefined
    }
      
    // Add new user
    this.myAuthenticationService.addNewUser(this.user)
      .subscribe(
        response => {
        
          // Save token in sessionStorage as completed Without insert the real token, to let home page open log in drawer
          sessionStorage.setItem("token", "Register process completed")
          
          // Save user email to insert it in log in form
          sessionStorage.setItem("user", response.body.newUser.email)
          
          // Pop up modal to completed process
          this.myDialog.open(ModalCompletedProcess);
    
          },
          error => console.log(error.message)
      )
     
  }

  // Move home page 
  public moveToHomePage() {
    this.myRouter.navigate(['./home']);
  }

  // Move home page 
  public BackToLastPage() {
    this.myRouter.navigate(['./register']);
  }

}

@Component({
  selector: 'modal-completed-process',
  templateUrl: './modal-completed-process.html',
  styleUrls: ['./register-step-two.component.css']
})

export class ModalCompletedProcess {}
